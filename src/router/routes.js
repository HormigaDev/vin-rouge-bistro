const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/Login.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
      },
      {
        path: '/dishes',
        name: 'dishes',
        component: () => import('pages/DishesList.vue'),
      },
      {
        path: '/dishes/new',
        name: 'dishes-new',
        component: () => import('pages/DishForm.vue'),
      },
      {
        path: '/dishes/:id',
        name: 'dishes-edit',
        component: () => import('pages/DishForm.vue'),
      },
      {
        path: '/ingredients',
        name: 'ingredients',
        component: () => import('pages/IngredientsList.vue'),
      },
      {
        path: '/ingredients/new',
        name: 'ingredients-new',
        component: () => import('pages/IngredientForm.vue'),
      },
      {
        path: '/ingredients/:id',
        name: 'ingredients-edit',
        component: () => import('pages/IngredientForm.vue'),
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('pages/OrdersList.vue'),
      },
      {
        path: '/orders/new',
        name: 'orders-new',
        component: () => import('pages/OrderForm.vue'),
      },
      {
        path: '/orders/:id/edit',
        name: 'orders-edit',
        component: () => import('pages/OrderForm.vue'),
      },
      {
        path: '/reservations',
        name: 'reservations',
        component: () => import('pages/ReservationsList.vue'),
      },
      {
        path: '/reservations/new',
        name: 'reservations-new',
        component: () => import('pages/ReservationForm.vue'),
      },
      {
        path: '/reservations/:id',
        name: 'reservations-edit',
        component: () => import('pages/ReservationForm.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ],
  },
]

export default routes
