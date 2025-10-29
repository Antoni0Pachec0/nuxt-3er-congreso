// composables/admin/use-users.js
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { AdminUsersApi } from '@/backend/admin/users-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'
import { useAuthStore } from '@/security/stores/auth'

const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
  ok:   (t, m) => (notify ? notify('success', t, m) : void 0),
  warn: (t, m) => (notify ? notify('warning', t, m) : void 0),
  err:  (t, m) => (notify ? notify('error',   t, m) : void 0),
  info: (t, m) => (notify ? notify('info',    t, m) : void 0),
}

const sleep = (ms)=> new Promise(r=>setTimeout(r, ms))
async function withBackoff(run, { attempts=5, base=300 } = {}) {
  let lastErr
  for (let i=0;i<attempts;i++){
    try { return await run() } catch (e){
      const msg = (e?.response?.data?.message || e?.message || '').toString()
      const status = e?.response?.status
      const throttled = status===429 || /ThrottlerException|Too Many Requests/i.test(msg)
      if (!throttled) throw e
      lastErr = e
      await sleep(base * Math.pow(1.8, i))
    }
  }
  throw lastErr
}

function normalizeGradeFE(input){ if(!input) return ''; const d=String(input).replace(/[^\d]/g,''); if(!d) return ''; const n=parseInt(d,10); if(isNaN(n)) return ''; return n<=9? String(Math.max(1,n)) : '10' }
function normalizeGroupFE(input){ if(!input) return ''; const c=String(input).trim().charAt(0).toUpperCase(); return /^[A-Z]$/.test(c)? c : '' }

export function useAdminUsers () {
  const busy = ref(false)
  const users = ref([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  // filtros
  const q = ref('')
  const fType = ref('')
  const fState = ref('')
  const fPay  = ref('')
  const grade = ref('')
  const group = ref('')

  // UI filtros
  const searchInput = ref('')
  const typeOptions = ['Estudiante','Docente','Ponente/Tallerista','Externo','Admin']
  const stateOptions = ['Activo','Inactivo','Suspendido','Eliminado']
  const payOptions   = ['Pagado','No pagado']
  const gradeOptions = ref([])
  const groupOptions = ref([])

  const selectedType = ref(''); const selectedState = ref(''); const selectedPay = ref('')
  const selectedGrade= ref(''); const selectedGroup = ref('')

  function pickType(v){ selectedType.value=v||''; fType.value=selectedType.value; fetchUsers({page:1}).catch(()=>{}) }
  function pickState(v){ selectedState.value=v||''; fState.value=selectedState.value; fetchUsers({page:1}).catch(()=>{}) }
  function pickPay(v){ selectedPay.value=v||''; fPay.value=selectedPay.value; fetchUsers({page:1}).catch(()=>{}) }
  function pickGrade(v){ selectedGrade.value=v||''; grade.value=selectedGrade.value; fetchUsers({page:1}).catch(()=>{}) }
  function pickGroup(v){ selectedGroup.value=v||''; group.value=selectedGroup.value; fetchUsers({page:1}).catch(()=>{}) }

  // helpers
  function mapTypeColor (type) {
    if (type === 'Estudiante') return 'type-estudiante'
    if (type === 'Docente') return 'type-docente'
    if (type === 'Ponente/Tallerista') return 'type-ponente'
    if (type === 'Admin') return 'type-admin'
    return 'type-externo'
  }
  function getIdLabel (type) { return (type==='Estudiante'||type==='Docente')? 'Matrícula':'ID' }

  const totalPages = computed(() => Math.max(1, Math.ceil((+total.value||0) / (+pageSize.value||20))))
  function onChangePageSize(val){ const ps=Math.max(1,Math.min(200,Number(val)||20)); if(ps===pageSize.value) return; pageSize.value=ps; fetchUsers({page:1}).catch(()=>{}) }

  // búsqueda con debounce
  let _deb=null
  function onSearchInput (val) {
    searchInput.value = val ? String(val) : ''
    if (_deb) clearTimeout(_deb)
    _deb = setTimeout(() => { q.value = searchInput.value; fetchUsers({ page: 1 }).catch(()=>{}) }, 350)
  }

  function clearFilters () {
    q.value=''; searchInput.value=''
    fType.value=''; selectedType.value=''
    fState.value=''; selectedState.value=''
    fPay.value='';  selectedPay.value=''
    grade.value=''; selectedGrade.value=''
    group.value=''; selectedGroup.value=''
    fetchUsers({page:1}).catch(()=>{})
  }

  function buildBackendFilter(){
    if (fType.value) return fType.value
    if (fState.value) return fState.value
    if (fPay.value)   return fPay.value
    return 'Todos'
  }

  // ===== fetch =====
  async function fetchUsers (opts = {}) {
    const normGrade = normalizeGradeFE(opts.grade ?? grade.value)
    const normGroup = normalizeGroupFE(opts.group ?? group.value)
    const filter = buildBackendFilter()

    busy.value = true
    try {
      const data = await AdminUsersApi.list({
        q: (opts.q !== undefined ? opts.q : q.value) || undefined,
        filter: filter || undefined,
        grade: normGrade || undefined,
        group: normGroup || undefined,
        page: (opts.page !== undefined ? opts.page : page.value),
        pageSize: (opts.pageSize !== undefined ? opts.pageSize : pageSize.value),
      }, { timeout: 20000 })

      users.value = (data?.data || []).map(u => ({
        ...u,
        status_event: !!u.status_event,
        eventEnabled: !!u.eventEnabled
      }))

      if (fPay.value === 'Pagado') users.value = users.value.filter(u => !!u.status_event)
      else if (fPay.value === 'No pagado') users.value = users.value.filter(u => !u.status_event)

      total.value = Number(data?.total) || users.value.length
      page.value  = Number(data?.page)  || 1
      pageSize.value = Number(data?.pageSize) || pageSize.value

      // opciones grado/grupo
      try {
        const gset = new Set(gradeOptions.value)
        const grset= new Set(groupOptions.value)
        for (const u of users.value) {
          if (u?.grade) gset.add(String(u.grade))
          if (u?.group) grset.add(String(u.group))
        }
        gradeOptions.value = Array.from(gset).filter(Boolean)
        groupOptions.value = Array.from(grset).filter(Boolean)
      } catch {}
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'No se pudo cargar usuarios'
      toast.err('Error', String(msg))
      throw e
    } finally {
      busy.value = false
    }
  }

  // ===== selección =====
  const selectionMode = ref(false)
  const selectedIds = ref(new Set())
  function clearSelection(){ selectedIds.value.clear() }
  function toggleSelectMode(next){
    const val = typeof next === 'boolean' ? next : !selectionMode.value
    selectionMode.value = val
    if (!val) clearSelection()
  }
  function toggleSelectModeAndClear(){ toggleSelectMode(!selectionMode.value) }
  function isSelected(id){ return selectedIds.value.has(Number(id)) }
  function toggleSelect(id){
    const n=Number(id)
    if (selectedIds.value.has(n)) selectedIds.value.delete(n)
    else selectedIds.value.add(n)
  }
  const isPageFullySelected = computed(()=> users.value.length>0 && users.value.every(u => selectedIds.value.has(Number(u.id))))
  function toggleSelectPage(){
    const ids = users.value.map(u=>Number(u.id))
    const full = ids.every(id => selectedIds.value.has(id))
    if (full) ids.forEach(id=>selectedIds.value.delete(id))
    else ids.forEach(id=>selectedIds.value.add(id))
  }
  const selectedCount = computed(()=> selectedIds.value.size)

  async function selectAllFiltered(){
    if (busy.value) return
    toast.info('Seleccionando','Buscando todos los usuarios filtrados…')
    const limit=100
    const filter = buildBackendFilter()
    const normGrade = normalizeGradeFE(grade.value)
    const normGroup = normalizeGroupFE(group.value)
    let p=1, fetched=0
    try{
      const first = await AdminUsersApi.list({ q:q.value||undefined, filter, grade:normGrade||undefined, group:normGroup||undefined, page:p, pageSize:limit }, { timeout: 20000 })
      const totalAll = Number(first?.total || 0)
      ;(first?.data||[]).forEach(u=> selectedIds.value.add(Number(u.id)))
      fetched += (first?.data||[]).length
      while (fetched < totalAll) {
        p += 1
        const resp = await AdminUsersApi.list({ q:q.value||undefined, filter, grade:normGrade||undefined, group:normGroup||undefined, page:p, pageSize:limit }, { timeout: 20000 })
        ;(resp?.data||[]).forEach(u=> selectedIds.value.add(Number(u.id)))
        fetched += (resp?.data||[]).length
        await sleep(60)
      }
      toast.ok('Listo', `Seleccionados ${selectedIds.value.size} usuarios`)
    }catch(e){
      toast.err('Error','No se pudieron seleccionar todos (filtrados)')
    }
  }

  // ===== individual =====
  const showModal = ref(false)
  const pendingActivate = ref(false)
  const currentUser = ref(null)
  const confirmBtn = ref(null)

  function onToggleActivation (user, event) {
    if (event?.target) event.target.checked = !!user.eventEnabled
    currentUser.value = user
    pendingActivate.value = !user.eventEnabled
    showModal.value = true
    nextTick(()=> confirmBtn.value?.focus?.())
  }
  function onToggleActivationUI(user, e){ onToggleActivation(user, e) }

  async function setActivation (userId, activate, reason, force) {
    const run = () => AdminUsersApi.setActivation(
      userId,
      { activate: !!activate, reason: reason ?? null, force: !!force, status_event: !!activate },
      { timeout: 15000 }
    )
    const res = await withBackoff(run, { attempts: 5, base: 300 })

    const idx = users.value.findIndex(u => Number(u.id)===Number(userId))
    if (idx !== -1) {
      const prev = users.value[idx]
      const eventEnabled = (res && 'eventEnabled' in res) ? !!res.eventEnabled : !!activate
      const status_event = (res && 'status_event' in res) ? !!res.status_event : !!eventEnabled

      users.value[idx] = {
        ...prev,
        eventEnabled,
        isActive: (res?.status === 'active') ? true : !!prev.isActive,
        status_event
      }
    }
    return res
  }

  async function applyToggle(){
    if (!currentUser.value) return
    try{
      const activate = !!pendingActivate.value
      await setActivation(currentUser.value.id, activate, null, true)
      showModal.value = false
      toast.ok('Actualizado','Estado de acceso actualizado.')
    }catch(e){
      const msg = e?.response?.data?.message || e?.message || 'No se pudo actualizar'
      toast.err('Error', String(msg))
    }
  }
  function cancelToggle(){ showModal.value=false }

  // ===== MASIVO =====
  const showBulk = ref(false)
  const bulkActivateFlag = ref(true)
  function openBulkConfirm(flag){ bulkActivateFlag.value = !!flag; showBulk.value = true }

  // ——— NUEVO: intenta bulk endpoint, si no existe usa secuencial con backoff
  async function bulkActivate(activate){
    const ids = Array.from(selectedIds.value)
    if (ids.length === 0) { showBulk.value=false; return }

    showBulk.value=false
    busy.value = true
    let ok=0, fail=0

    // 1) intento bulk en una sola llamada
    try {
      const result = await AdminUsersApi.bulkActivation({ ids, activate, force: true }, { timeout: 60000 })
      // Se espera result: [{ id, eventEnabled, status_event }, ...]
      const byId = new Map((result || []).map(r => [Number(r.id), r]))
      for (const u of users.value) {
        const r = byId.get(Number(u.id))
        if (r) {
          u.eventEnabled = !!r.eventEnabled
          u.status_event = typeof r.status_event === 'boolean' ? r.status_event : !!r.eventEnabled
          ok++
        }
      }
      await fetchUsers({ page: page.value })
      toast.ok('Operación masiva', `Correctos: ${ok} • Fallidos: ${fail}`)
      busy.value=false
      return
    } catch (e) {
      // Si el backend no tiene endpoint masivo (404/405/501), seguimos con la ruta secuencial
      const status = e?.response?.status
      if (![404,405,501].includes(status)) {
        busy.value=false
        toast.err('Error', 'No se pudo ejecutar la operación masiva')
        throw e
      }
    }

    // 2) fallback: secuencial con backoff y pausas
    try{
      for (const id of ids){
        try{
          await setActivation(id, activate, null, true)
          ok++
        }catch(e){
          fail++
        }
        await sleep(180) // un poco más de pausa para evitar throttle
      }
      await fetchUsers({ page: page.value })
      toast.ok('Operación masiva', `Correctos: ${ok} • Fallidos: ${fail}`)
    }catch(e){
      toast.err('Error','No se pudo completar la operación masiva')
    }finally{
      busy.value=false
    }
  }

  // UI handler (optimista + confirma)
  async function bulkActivateUI(flag){
    // Optimista: refleja en tabla mientras corre la operación
    const snapshots = users.value
      .filter(row => selectedIds.value.has(Number(row.id)))
      .map(row => ({ row, prev: { eventEnabled: row.eventEnabled, status_event: row.status_event } }))

    snapshots.forEach(({ row }) => {
      row.eventEnabled = flag
      row.status_event = flag
    })

    try {
      await bulkActivate(flag)
      toggleSelectMode(false) // sale del modo selección y limpia
    } catch (e) {
      // revertir si falla
      snapshots.forEach(({ row, prev }) => {
        row.eventEnabled = prev.eventEnabled
        row.status_event = prev.status_event
      })
      throw e
    }
  }

  // Export y logout
  function exportData(){
    const rows = [
      ['Nombre','Correo','Matrícula/ID','Tipo','Grado','Grupo','Estado','Pago','Acceso evento'],
      ...users.value.map(u=>[
        u?.name||'',u?.email||'',u?.code||'',u?.type||'',
        u?.grade||'',u?.group||'',
        u?.isActive?'Activo':'Inactivo',
        u?.status_event ? 'Pagado' : 'No pagado',
        u?.eventEnabled?'Habilitado':'Deshabilitado'
      ])
    ]
    const csv = rows.map(r=> r.map(s=> `"${String((s??'')).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='usuarios.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function logout(){ try{ await useAuthStore().logout(); navigateTo('/login') }catch{ toast.err('Error','No se pudo cerrar sesión') } }

  onMounted(()=> { fetchUsers().catch(()=>{}) })
  onBeforeUnmount(()=>{})

  return {
    users, total, page, pageSize, busy,
    searchInput, onSearchInput,
    typeOptions, selectedType, pickType,
    stateOptions, selectedState, pickState,
    payOptions, selectedPay, pickPay,
    gradeOptions, selectedGrade, pickGrade,
    groupOptions, selectedGroup, pickGroup,
    clearFilters,
    totalPages, goPage:(p)=>{ if(p>=1 && p<=totalPages.value && !busy.value) fetchUsers({page:p}) }, onChangePageSize,
    mapTypeColor, getIdLabel,
    selectionMode, toggleSelectModeAndClear, toggleSelectMode, clearSelection,
    isSelected, toggleSelect, toggleSelectPage, isPageFullySelected,
    selectedCount, selectAllFiltered,
    openBulkConfirm, showBulk, bulkActivateFlag, bulkActivate, bulkActivateUI,
    showModal, pendingActivate, currentUser, confirmBtn,
    onToggleActivation, onToggleActivationUI, applyToggle, cancelToggle,
    exportData, logout
  }
}
