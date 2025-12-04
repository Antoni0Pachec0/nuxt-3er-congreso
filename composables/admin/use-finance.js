import { ref, computed, onMounted } from 'vue'
import { AdminFinanceApi } from '@/backend/admin/finance-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'

const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
  ok: (t, m) => notify?.('success', t, m),
  err: (t, m) => notify?.('error', t, m),
  warn: (t, m) => notify?.('warning', t, m),
}

export function useFinance() {
  const ticketPrice = ref(380)
  const summary = ref({ paidUsersCount: 0, ticketPrice: 380, ticketsRevenue: 0, totalIngresosDb: 0, totalGastosDb: 0, balance: 0 })
  const categories = ref([])
  const movements = ref([])

  const selectedTipo = ref('ALL')
  const selectedCategoryId = ref(0)

  const busySummary = ref(false)
  const busyCategories = ref(false)
  const busyMovements = ref(false)
  const busyCreate = ref(false)
  const busy = computed(() => busySummary.value || busyCategories.value || busyMovements.value || busyCreate.value)

  // ============================
  // TIQUETE
  // ============================
  function loadTicketPriceFromStorage() {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('event_ticket_price')
    if (stored) ticketPrice.value = Number(stored)
  }

  function saveTicketPriceToStorage() {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('event_ticket_price', String(ticketPrice.value))
  }

  async function setTicketPrice(newPrice) {
    const val = Number(newPrice)
    if (!val || val <= 0) {
      return toast.warn('Precio inválido', 'Ingresa un precio válido.')
    }
    ticketPrice.value = val
    saveTicketPriceToStorage()
    fetchSummary()
  }

  // ============================
  // FETCH
  // ============================
  async function fetchSummary() {
    try {
      busySummary.value = true
      summary.value = await AdminFinanceApi.getSummary(ticketPrice.value)
    } catch {
      toast.err('Error', 'No se pudo cargar el resumen')
    } finally {
      busySummary.value = false
    }
  }

  async function fetchCategories() {
    try {
      busyCategories.value = true
      categories.value = await AdminFinanceApi.listCategories()
    } catch {
      toast.err('Error', 'No se pudieron cargar categorías')
    } finally {
      busyCategories.value = false
    }
  }

  async function fetchMovements() {
    try {
      busyMovements.value = true
      movements.value = await AdminFinanceApi.listMovements()
    } catch {
      toast.err('Error', 'No se pudieron cargar movimientos')
    } finally {
      busyMovements.value = false
    }
  }

  async function refreshAll() {
    await Promise.all([fetchSummary(), fetchCategories(), fetchMovements()])
  }

  // ============================
  // CATEGORÍAS CRUD
  // ============================
  async function addCategory(nombre) {
    if (!nombre.trim()) return toast.warn('Categoría', 'Nombre requerido')
    try {
      const created = await AdminFinanceApi.createCategory({ nombre })
      categories.value.push(created)
      toast.ok('Categoría creada', created.nombre)
    } catch {
      toast.err('Error', 'No se pudo crear categoría')
    }
  }

  async function editCategory(id, nombre) {
    if (!nombre.trim()) return toast.warn('Categoría', 'Nombre requerido')
    try {
      const updated = await AdminFinanceApi.updateCategory(id, { nombre })
      const idx = categories.value.findIndex(c => c.id === id)
      if (idx !== -1) categories.value[idx] = updated
      toast.ok('Actulizada', 'Categoría actualizada')
    } catch {
      toast.err('Error', 'No se pudo actualizar categoría')
    }
  }

  async function deleteCategory(id) {
    try {
      await AdminFinanceApi.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
      toast.ok('Eliminada', 'Categoría eliminada')
    } catch {
      toast.err('Error', 'No se pudo eliminar categoría')
    }
  }

  // ============================
  // MOVIMIENTOS CRUD
  // ============================
  async function addMovement(payload) {
    try {
      const created = await AdminFinanceApi.createMovement(payload)
      movements.value.unshift(created)
      toast.ok('Movimiento', 'Registrado correctamente')
      fetchSummary()
    } catch {
      toast.err('Error', 'No se pudo registrar el movimiento')
    }
  }

  async function updateMovement(id, payload) {
    try {
      const updated = await AdminFinanceApi.updateMovement(id, payload)
      const idx = movements.value.findIndex(m => m.id === id)
      if (idx !== -1) movements.value[idx] = updated
      toast.ok('Movimiento', 'Actualizado correctamente')
      fetchSummary()
    } catch {
      toast.err('Error', 'No se pudo actualizar movimiento')
    }
  }

  async function deleteMovement(id) {
    try {
      await AdminFinanceApi.deleteMovement(id)
      movements.value = movements.value.filter(m => m.id !== id)
      toast.ok('Movimiento', 'Eliminado correctamente')
      fetchSummary()
    } catch {
      toast.err('Error', 'No se pudo eliminar movimiento')
    }
  }

  // ============================
  // FILTROS
  // ============================
  const visibleMovements = computed(() => {
    let list = movements.value
    if (selectedTipo.value !== 'ALL') list = list.filter(m => m.tipo === selectedTipo.value)
    if (selectedCategoryId.value) list = list.filter(m => m.categoria?.id === selectedCategoryId.value)
    return list
  })

  onMounted(() => {
    loadTicketPriceFromStorage()
    refreshAll()
  })

  return {
    // estado
    ticketPrice, summary, categories, movements, visibleMovements,
    selectedTipo, selectedCategoryId, busy,

    // categorías
    addCategory, editCategory, deleteCategory,

    // movimientos
    addMovement, updateMovement, deleteMovement,

    // otros
    fetchSummary, fetchCategories, fetchMovements, refreshAll, setTicketPrice
  }
}
