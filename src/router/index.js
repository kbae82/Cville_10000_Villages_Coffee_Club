import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login";
import Main from "@/components/Main";
import Register from "@/components/Register";
import { auth } from "@/components/firebase";

Vue.use(VueRouter);

let router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      requiresGuest: true
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      requiresGuest: true
    },
    {
      path: "/main",
      name: "Main",
      component: Main,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// Nav Authentication
router.beforeEach((to, from, next) => {
  // Check for requiresAuth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check for the current user
    if (!auth.currentUser) {
      // Direct to Login
      auth.signOut().then(() => {
        next({
          path: "/",
          query: {
            redirect: to.fullPath
          }
        });
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check Guest user
    if (auth.currentUser) {
      // Direct to Login
      next({
        path: "/",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;
