// Mock data store para Vin Rouge Bistrô
// Este arquivo simula um backend com dados persistidos no localStorage

// ========== DADOS INICIAIS ==========

const INITIAL_DISHES = [
  {
    id: 1,
    name: 'Filet Mignon com Molho Bordelês',
    category: 'Principal',
    price: 45.0,
    description:
      'Filet mignon grelhado com molho bordelês clássico, servido com batatas rosti e legumes salteados.',
    ingredients: [1, 2],
    available: true,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
  },
  {
    id: 2,
    name: 'Tarte de Limão',
    category: 'Sobremesa',
    price: 12.0,
    description: 'Tarte de limão siciliano com merengue italiano levemente queimado.',
    ingredients: [3, 4],
    available: true,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400',
  },
  {
    id: 3,
    name: 'Carpaccio de Salmão',
    category: 'Entrada',
    price: 28.0,
    description:
      'Finas lâminas de salmão fresco com alcaparras, limão siciliano e azeite de oliva extravirgem.',
    ingredients: [5, 3],
    available: true,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
  },
  {
    id: 4,
    name: 'Coq au Vin',
    category: 'Principal',
    price: 42.0,
    description: 'Frango cozido lentamente em vinho tinto com cogumelos, bacon e cebolas pérola.',
    ingredients: [6, 7, 4],
    available: true,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
  },
  {
    id: 5,
    name: 'Crème Brûlée',
    category: 'Sobremesa',
    price: 15.0,
    description: 'Creme de baunilha com crosta de açúcar caramelizado.',
    ingredients: [4, 8],
    available: true,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
  },
  {
    id: 6,
    name: 'Bouillabaisse',
    category: 'Principal',
    price: 52.0,
    description: 'Tradicional ensopado de frutos do mar provençal com rouille e croûtons.',
    ingredients: [5, 2, 3],
    available: true,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
  },
]

const INITIAL_INGREDIENTS = [
  { id: 1, name: 'Filet Mignon', unit: 'kg', stock: 3.5, minStock: 2, cost: 85.0 },
  { id: 2, name: 'Batata', unit: 'kg', stock: 8, minStock: 5, cost: 4.5 },
  { id: 3, name: 'Limão Siciliano', unit: 'unidade', stock: 15, minStock: 10, cost: 0.8 },
  { id: 4, name: 'Ovos', unit: 'dúzia', stock: 4, minStock: 3, cost: 12.0 },
  { id: 5, name: 'Salmão Fresco', unit: 'kg', stock: 2.2, minStock: 1.5, cost: 75.0 },
  { id: 6, name: 'Arroz Arbóreo', unit: 'kg', stock: 4, minStock: 2, cost: 18.0 },
  { id: 7, name: 'Cogumelos Variados', unit: 'kg', stock: 1.8, minStock: 1, cost: 42.0 },
  { id: 8, name: 'Creme de Leite', unit: 'litro', stock: 3, minStock: 2, cost: 8.5 },
  { id: 9, name: 'Manteiga', unit: 'kg', stock: 2, minStock: 1, cost: 22.0 },
  { id: 10, name: 'Alho', unit: 'kg', stock: 0.5, minStock: 0.3, cost: 15.0 },
]

const INITIAL_ORDERS = [
  {
    id: 1001,
    client: 'Jean-Pierre Dubois',
    table: 5,
    status: 'Em preparação',
    createdAt: new Date(2024, 10, 5, 19, 30).toISOString(),
    items: [
      {
        dishId: 1,
        dishName: 'Filet Mignon com Molho Bordelês',
        qty: 2,
        unitPrice: 45.0,
        subtotal: 90.0,
      },
      { dishId: 2, dishName: 'Tarte de Limão', qty: 1, unitPrice: 12.0, subtotal: 12.0 },
    ],
    total: 102.0,
  },
  {
    id: 1002,
    client: 'Marie Claire Laurent',
    table: 3,
    status: 'Servido',
    createdAt: new Date(2024, 10, 5, 18, 45).toISOString(),
    items: [
      {
        dishId: 4,
        dishName: 'Coq au Vin',
        qty: 1,
        unitPrice: 42.0,
        subtotal: 42.0,
      },
      { dishId: 5, dishName: 'Crème Brûlée', qty: 2, unitPrice: 15.0, subtotal: 30.0 },
    ],
    total: 72.0,
  },
  {
    id: 1003,
    client: 'Antoine Bernard',
    table: 8,
    status: 'Em preparação',
    createdAt: new Date(2024, 10, 5, 20, 15).toISOString(),
    items: [
      { dishId: 3, dishName: 'Carpaccio de Salmão', qty: 1, unitPrice: 28.0, subtotal: 28.0 },
      { dishId: 6, dishName: 'Bouillabaisse', qty: 1, unitPrice: 52.0, subtotal: 52.0 },
    ],
    total: 80.0,
  },
]

const INITIAL_RESERVATIONS = [
  {
    id: 1,
    client: 'Pierre Beaumont',
    date: '2024-11-10',
    time: '19:00',
    people: 4,
    status: 'Confirmada',
    phone: '+55 11 98765-4321',
    notes: 'Aniversário - preparar sobremesa especial',
  },
  {
    id: 2,
    client: 'Isabelle Rousseau',
    date: '2024-11-12',
    time: '20:30',
    people: 2,
    status: 'Confirmada',
    phone: '+55 11 91234-5678',
    notes: 'Jantar romântico',
  },
  {
    id: 3,
    client: 'Marc Lefebvre',
    date: '2024-11-08',
    time: '19:30',
    people: 6,
    status: 'Pendente',
    phone: '+55 11 97654-3210',
    notes: 'Reunião de negócios',
  },
  {
    id: 4,
    client: 'Sophie Martin',
    date: '2024-11-15',
    time: '21:00',
    people: 8,
    status: 'Confirmada',
    phone: '+55 11 99876-5432',
    notes: '',
  },
  {
    id: 5,
    client: 'François Dupont',
    date: '2024-11-06',
    time: '18:30',
    people: 2,
    status: 'Finalizada',
    phone: '+55 11 96543-2109',
    notes: '',
  },
  {
    id: 6,
    client: 'Catherine Moreau',
    date: '2024-11-05',
    time: '20:00',
    people: 3,
    status: 'Cancelada',
    phone: '+55 11 93210-9876',
    notes: '',
  },
]

// ========== GESTIÓN DE LOCALSTORAGE ==========

const STORAGE_KEYS = {
  DISHES: 'vin_rouge_dishes',
  INGREDIENTS: 'vin_rouge_ingredients',
  ORDERS: 'vin_rouge_orders',
  RESERVATIONS: 'vin_rouge_reservations',
}

// Inicializar datos desde localStorage o usar datos iniciales
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.DISHES)) {
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INGREDIENTS)) {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS))
  }
}

// Resetear todos los datos a valores iniciales (llamar al hacer logout)
export function resetMockData() {
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES))
  localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS))
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS))
}

// Getters para obtener datos desde localStorage
function getDishesFromStorage() {
  initializeData()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISHES) || '[]')
}

function getIngredientsFromStorage() {
  initializeData()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || '[]')
}

function getOrdersFromStorage() {
  initializeData()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
}

function getReservationsFromStorage() {
  initializeData()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS) || '[]')
}

// Setters para guardar datos en localStorage
function saveDishesToStorage(dishes) {
  localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes))
}

function saveIngredientsToStorage(ingredients) {
  localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients))
}

function saveOrdersToStorage(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

function saveReservationsToStorage(reservations) {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations))
}

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

export async function mockLogin(credentials) {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Aceita qualquer email válido e senha com 8+ caracteres
  if (credentials.email && credentials.password && credentials.password.length >= 8) {
    // Inicializar datos al hacer login
    initializeData()

    return {
      token: 'mock-token-' + Date.now(),
      user: {
        name: 'Chef Sophie Dubois',
        role: 'admin',
        email: credentials.email,
      },
    }
  }
  return null
}

export function mockLogout() {
  // Resetear datos al estado inicial cuando el usuario hace logout
  resetMockData()
  return true
}

// ========== FUNÇÕES CRUD - PRATOS ==========

export async function getDishes() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return getDishesFromStorage()
}

export async function getDishById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const dishes = getDishesFromStorage()
  return dishes.find((d) => d.id === parseInt(id))
}

export async function createDish(dish) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const dishes = getDishesFromStorage()
  const newDish = {
    id: Math.max(...dishes.map((d) => d.id), 0) + 1,
    available: true,
    ...dish,
  }
  dishes.push(newDish)
  saveDishesToStorage(dishes)
  return newDish
}

export async function updateDish(id, updatedDish) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const dishes = getDishesFromStorage()
  const index = dishes.findIndex((d) => d.id === parseInt(id))
  if (index !== -1) {
    dishes[index] = { ...dishes[index], ...updatedDish, id: parseInt(id) }
    saveDishesToStorage(dishes)
    return dishes[index]
  }
  return null
}

export async function deleteDish(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const dishes = getDishesFromStorage()
  const index = dishes.findIndex((d) => d.id === parseInt(id))
  if (index !== -1) {
    dishes.splice(index, 1)
    saveDishesToStorage(dishes)
    return true
  }
  return false
}

// ========== FUNÇÕES CRUD - INGREDIENTES ==========

export async function getIngredients() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return getIngredientsFromStorage()
}

export async function getIngredientById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const ingredients = getIngredientsFromStorage()
  return ingredients.find((i) => i.id === parseInt(id))
}

export async function createIngredient(ingredient) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const ingredients = getIngredientsFromStorage()
  const newIngredient = {
    id: Math.max(...ingredients.map((i) => i.id), 0) + 1,
    ...ingredient,
  }
  ingredients.push(newIngredient)
  saveIngredientsToStorage(ingredients)
  return newIngredient
}

export async function updateIngredient(id, updatedIngredient) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const ingredients = getIngredientsFromStorage()
  const index = ingredients.findIndex((i) => i.id === parseInt(id))
  if (index !== -1) {
    ingredients[index] = { ...ingredients[index], ...updatedIngredient, id: parseInt(id) }
    saveIngredientsToStorage(ingredients)
    return ingredients[index]
  }
  return null
}

export async function deleteIngredient(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const ingredients = getIngredientsFromStorage()
  const index = ingredients.findIndex((i) => i.id === parseInt(id))
  if (index !== -1) {
    ingredients.splice(index, 1)
    saveIngredientsToStorage(ingredients)
    return true
  }
  return false
}

// ========== FUNÇÕES CRUD - COMANDAS ==========

export async function getOrders() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return getOrdersFromStorage()
}

export async function getOrderById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const orders = getOrdersFromStorage()
  return orders.find((o) => o.id === parseInt(id))
}

export async function createOrder(order) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const orders = getOrdersFromStorage()
  const newOrder = {
    id: Math.max(...orders.map((o) => o.id), 1000) + 1,
    createdAt: new Date().toISOString(),
    status: 'Em preparação',
    ...order,
  }
  orders.push(newOrder)
  saveOrdersToStorage(orders)
  return newOrder
}

export async function updateOrder(id, updatedOrder) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const orders = getOrdersFromStorage()
  const index = orders.findIndex((o) => o.id === parseInt(id))
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updatedOrder, id: parseInt(id) }
    saveOrdersToStorage(orders)
    return orders[index]
  }
  return null
}

export async function deleteOrder(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const orders = getOrdersFromStorage()
  const index = orders.findIndex((o) => o.id === parseInt(id))
  if (index !== -1) {
    orders.splice(index, 1)
    saveOrdersToStorage(orders)
    return true
  }
  return false
}

export async function addOrderItem(orderId, item) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const orders = getOrdersFromStorage()
  const order = orders.find((o) => o.id === parseInt(orderId))
  if (order) {
    order.items.push(item)
    order.total = order.items.reduce((sum, i) => sum + i.subtotal, 0)
    saveOrdersToStorage(orders)
    return order
  }
  return null
}

export async function removeOrderItem(orderId, itemIndex) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const orders = getOrdersFromStorage()
  const order = orders.find((o) => o.id === parseInt(orderId))
  if (order && itemIndex >= 0 && itemIndex < order.items.length) {
    order.items.splice(itemIndex, 1)
    order.total = order.items.reduce((sum, i) => sum + i.subtotal, 0)
    saveOrdersToStorage(orders)
    return order
  }
  return null
}

export async function updateOrderStatus(orderId, status) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const orders = getOrdersFromStorage()
  const order = orders.find((o) => o.id === parseInt(orderId))
  if (order) {
    order.status = status
    saveOrdersToStorage(orders)
    return order
  }
  return null
}

// ========== FUNÇÕES CRUD - RESERVAS ==========

export async function getReservations() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return getReservationsFromStorage()
}

export async function getReservationById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const reservations = getReservationsFromStorage()
  return reservations.find((r) => r.id === parseInt(id))
}

export async function createReservation(reservation) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const reservations = getReservationsFromStorage()
  const newReservation = {
    id: Math.max(...reservations.map((r) => r.id), 0) + 1,
    status: 'Pendente',
    notes: '',
    ...reservation,
  }
  reservations.push(newReservation)
  saveReservationsToStorage(reservations)
  return newReservation
}

export async function updateReservation(id, updatedReservation) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const reservations = getReservationsFromStorage()
  const index = reservations.findIndex((r) => r.id === parseInt(id))
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...updatedReservation, id: parseInt(id) }
    saveReservationsToStorage(reservations)
    return reservations[index]
  }
  return null
}

export async function deleteReservation(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const reservations = getReservationsFromStorage()
  const index = reservations.findIndex((r) => r.id === parseInt(id))
  if (index !== -1) {
    reservations.splice(index, 1)
    saveReservationsToStorage(reservations)
    return true
  }
  return false
}

// ========== FUNÇÕES AUXILIARES ==========

export async function getDashboardMetrics() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const dishes = getDishesFromStorage()
  const reservations = getReservationsFromStorage()
  const orders = getOrdersFromStorage()
  const ingredients = getIngredientsFromStorage()

  return {
    menuItems: dishes.length,
    reservations: reservations.filter((r) => r.status === 'Confirmada').length,
    pendingOrders: orders.filter((o) => o.status === 'Em preparação').length,
    lowStockIngredients: ingredients.filter((i) => i.stock < 5).length,
    totalRevenue: orders.filter((o) => o.status === 'Servido').reduce((sum, o) => sum + o.total, 0),
  }
}

export function getIngredientsByIds(ids) {
  const ingredients = getIngredientsFromStorage()
  return ingredients.filter((i) => ids.includes(i.id))
}
