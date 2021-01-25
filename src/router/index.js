/******************************************************************************
 * @/router/index.js
 * 
 * Vue router definition file. See route descriptions below.
 * 
 * Visit https://router.vuejs.org/ for more information.
 * 
 *****************************************************************************/
import Vue from "vue"
import Router from "vue-router"
import InventorySetView from "@/views/InventorySet.vue"
import CartView from "@/views/Cart.vue"
import LoginView from "@/views/Login.vue"
import store from "@/store"

Vue.use(Router)

const routes = [
  // Main page with inventory items list.
  {
    path: "/",
    component: InventorySetView,
    meta: { requiresAuth: true }
  },
  // Shopping cart view.
  {
    path: "/cart",
    component: CartView,
    meta: {
      breadCrumb: "Cart",
      requiresAuth: true
    }
  },
  // List of all reservations for current user.
  {
    path: "/reservations",
    component: {
      render (c) {
        return c("router-view")
      }
    },
    meta: {
      breadCrumb: "Reservations",
      requiresAuth: true
    },
    children: [
      // Reservation list.
      {
        path: "",
        props: true,
        component: () => import("@/views/ReservationSet.vue")
      },
      // Individual reservation details.
      {
        path: ":invuseid",  
        props: true,
        component: () => import("@/views/Reservation.vue"),
        meta: {
          breadCrumb: "Detail",
          requiresAuth: true
        }
      }
    ]
  },
  // Login page.
  {
    path: "/login",
    component: LoginView,
    meta: { guest: true }
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// If user is not authenticated fall back to the login page.
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

// If user is authenticated fall back to main page from /login.
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.path == "/login" )) {
    if (store.getters.isAuthenticated) {
      next("/");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
