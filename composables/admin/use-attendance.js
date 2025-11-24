import { ref, computed, onBeforeUnmount } from 'vue'
import jsQR from 'jsqr'
import { AdminAttendanceApi } from '@/backend/admin/attendance-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'

const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
    ok: (t, m) => notify?.('success', t, m),
    err: (t, m) => notify?.('error', t, m),
    warn: (t, m) => notify?.('warning', t, m),
}

export function useAttendance() {
    // Cámara
    const cameraOn = ref(false)
    const videoRef = ref(null)
    const canvasRef = ref(null)
    const streamRef = ref(null)
    const rafId = ref(null)

    // Eventos / sesiones
    const workshops = ref([])
    const loadingWorkshops = ref(false)
    const selectedWorkshopId = ref(0)
    const selectedScheduleId = ref(0) // 0 = todas

    // Modales
    const showEventModal = ref(false)
    const showListsModal = ref(false)

    // Último escaneo
    const lastScan = ref(null)
    const lastToken = ref(null)
    const lastTokenAt = ref(0)
    let clearLastScanTimeout = null

    // Listas de asistencia
    const listsFilterType = ref('all')
    const listsLoading = ref(false)
    const listsUsers = ref([])

    // búsqueda en listas
    const searchTerm = ref('')

    const currentWorkshop = computed(
        () => workshops.value.find(w => w.id === selectedWorkshopId.value) || null
    )

    const currentSessions = computed(() => currentWorkshop.value?.sessions || [])

    const currentSession = computed(
        () => currentSessions.value.find(s => s.id === selectedScheduleId.value) || null
    )

    const visibleUsers = computed(() => {
        const term = searchTerm.value.trim().toLowerCase()
        if (!term) return listsUsers.value

        return listsUsers.value.filter(u => {
            return (
                (u.name || '').toLowerCase().includes(term) ||
                (u.email || '').toLowerCase().includes(term) ||
                (u.matricula || '').toLowerCase().includes(term)
            )
        })
    })

    // ---------- Backend helpers ----------

    async function loadWorkshops() {
        if (loadingWorkshops.value) return
        loadingWorkshops.value = true
        try {
            const raw = await AdminAttendanceApi.listWorkshops()
            workshops.value = (raw || []).map(w => ({
                id: w.id,
                name: w.name,
                building: w.building,
                classroom: w.classroom,
                category: w.category,
                status: w.status,
                sessions: (w.schedules || w.sessions || []).map(s => ({
                    id: s.id,
                    label:
                        s.name ||
                        s.name_conference ||
                        `${new Date(s.date || s.assigned_date).toLocaleDateString('es-MX')} ${s.start_time ?? ''}`,
                    date: s.date || s.assigned_date,
                    start_time: s.start_time,
                    end_time: s.end_time,
                })),
            }))
        } catch (e) {
            console.error(e)
            toast.err('Error', 'No se pudieron cargar los talleres.')
        } finally {
            loadingWorkshops.value = false
        }
    }

    async function handleScan(token) {
        const now = Date.now()

        // Evitar spam con el mismo código
        if (lastToken.value === token && now - lastTokenAt.value < 3000) {
            return
        }

        lastToken.value = token
        lastTokenAt.value = now

        if (!selectedWorkshopId.value) {
            toast.warn('Selecciona evento', 'Primero elige el taller / sesión.')
            return
        }

        try {
            const payload = {
                qrValue: token, // 👈 coincide con ScanQrDto
                workshopId: selectedWorkshopId.value,
                scheduleId: selectedScheduleId.value || undefined,
            }

            const res = await AdminAttendanceApi.scanQr(payload)

            lastScan.value = {
                ...res,
                time: res.at || new Date().toISOString(),
            }

            // limpiar panel de información después de unos segundos
            if (clearLastScanTimeout) {
                clearTimeout(clearLastScanTimeout)
            }
            clearLastScanTimeout = setTimeout(() => {
                lastScan.value = null
            }, 8000)

            // marcar usuario como asistió en la tabla si ya está cargada
            if (res.user?.id && listsUsers.value.length) {
                listsUsers.value = listsUsers.value.map(u =>
                    u.id === res.user.id ? { ...u, attended: true } : u
                )
            }

            toast.ok('Asistencia registrada', res.message || 'Se registró la asistencia correctamente.')
        } catch (e) {
            console.error(e)

            const serverMsg = e?.response?.data?.message
            let msg = 'No se pudo registrar la asistencia.'

            if (typeof serverMsg === 'string') {
                // mensajes de negocio válidos (ej. sin pago)
                if (
                    serverMsg.includes('no tiene pago confirmado') ||
                    serverMsg.includes('QR no válido') ||
                    serverMsg.includes('usuario no encontrado')
                ) {
                    msg = serverMsg
                } else if (
                    serverMsg.includes('Invalid `this.prisma') ||
                    serverMsg.includes("Can't reach database server")
                ) {
                    msg = 'No se pudo conectar a la base de datos del sistema.'
                } else if (serverMsg.length < 120) {
                    // mensajes cortos OK
                    msg = serverMsg
                }
            } else if (e.code === 'ERR_NETWORK') {
                msg = 'No se pudo conectar al servidor. Verifica tu conexión.'
            }

            toast.err('Error', msg)
        }
    }

    async function loadLists() {
        if (!selectedWorkshopId.value) {
            toast.warn('Selecciona evento', 'Elige un taller / sesión primero.')
            return
        }

        listsLoading.value = true
        try {
            const res = await AdminAttendanceApi.listAttendance({
                workshopId: selectedWorkshopId.value,
            })

            const all = res.all || []
            const byType = res.byType || {}

            let users = all

            switch (listsFilterType.value) {
                case 'students':
                    users = byType['Estudiante'] || byType['Estudiantes'] || []
                    break
                case 'teachers':
                    users = byType['Docente'] || byType['Docentes'] || []
                    break
                case 'externals':
                    users = byType['Externo'] || byType['Externos'] || []
                    break
                case 'others':
                    users = byType['Otros'] || byType['Otro'] || []
                    break
                default:
                    users = all
            }

            listsUsers.value = users
        } catch (e) {
            console.error(e)
            const serverMsg = e?.response?.data?.message
            let msg = 'No se pudieron cargar las listas de asistencia.'

            if (typeof serverMsg === 'string' && serverMsg.includes('ThrottlerException')) {
                msg = 'Se hicieron demasiadas solicitudes seguidas. Espera unos segundos y vuelve a intentar.'
            }

            toast.err('Error', msg)
        } finally {
            listsLoading.value = false
        }
    }



    // ---------- Cámara y lectura de QR ----------

    async function startCamera() {
        if (cameraOn.value) return

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast.err('Error', 'Este navegador no soporta acceso a la cámara.')
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            })
            streamRef.value = stream

            if (videoRef.value) {
                videoRef.value.srcObject = stream
                try {
                    await videoRef.value.play()
                } catch (err) {
                    console.error('Error al reproducir el video:', err)
                }
            }

            cameraOn.value = true
            scanLoop()
        } catch (e) {
            console.error(e)
            toast.err('Error', 'No se pudo acceder a la cámara.')
        }
    }

    function stopCamera() {
        cameraOn.value = false
        if (rafId.value) {
            cancelAnimationFrame(rafId.value)
            rafId.value = null
        }
        if (streamRef.value) {
            streamRef.value.getTracks().forEach(t => t.stop())
            streamRef.value = null
        }
    }

    function toggleCamera() {
        if (cameraOn.value) stopCamera()
        else startCamera()
    }

    function scanLoop() {
        if (!cameraOn.value || !videoRef.value || !canvasRef.value) return

        const video = videoRef.value
        const canvas = canvasRef.value
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        const width = video.videoWidth || 640
        const height = video.videoHeight || 480

        canvas.width = width
        canvas.height = height

        ctx.drawImage(video, 0, 0, width, height)
        const imageData = ctx.getImageData(0, 0, width, height)
        const result = jsQR(imageData.data, width, height)

        if (result && result.data) {
            handleScan(result.data)
        }

        rafId.value = requestAnimationFrame(scanLoop)
    }

    // ---------- Modales ----------

    function openEventModal() {
        showEventModal.value = true
        loadWorkshops()
    }

    function closeEventModal() {
        showEventModal.value = false
    }

    function confirmEventSelection() {
        if (!selectedWorkshopId.value) {
            toast.warn('Selecciona taller', 'Debes seleccionar al menos un taller.')
            return
        }
        showEventModal.value = false
        toast.ok('Evento seleccionado', currentWorkshop.value?.name || 'Evento seleccionado')
    }

    function openListsModal() {
        if (!selectedWorkshopId.value) {
            toast.warn('Selecciona evento', 'Elige un taller / sesión primero.')
            return
        }
        showListsModal.value = true
        loadLists()
    }

    function closeListsModal() {
        showListsModal.value = false
    }

    function setFilterType(type) {
        listsFilterType.value = type
        if (showListsModal.value) {
            loadLists()
        }
    }

    onBeforeUnmount(() => {
        stopCamera()
        if (clearLastScanTimeout) {
            clearTimeout(clearLastScanTimeout)
        }
    })

    return {
        // cámara
        cameraOn,
        videoRef,
        canvasRef,
        toggleCamera,

        // eventos
        workshops,
        loadingWorkshops,
        selectedWorkshopId,
        selectedScheduleId,
        currentWorkshop,
        currentSessions,
        currentSession,

        // modales
        showEventModal,
        openEventModal,
        closeEventModal,
        confirmEventSelection,

        showListsModal,
        openListsModal,
        closeListsModal,

        // listas
        listsUsers,
        listsFilterType,
        listsLoading,
        setFilterType,
        loadLists,
        searchTerm,
        visibleUsers,

        // último escaneo
        lastScan,
    }
}
