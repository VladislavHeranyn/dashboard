import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: () => import('../views/Auth.vue'),
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard/:id',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard/:id/send',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard/:dashboardId/widget/:widgetId',
    component: () => import('../views/WidgetDetail.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/jobs',
    component: () => import('../views/Jobs.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/schedule',
    component: () => import('../components/schedulers/ScheduleDialog.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/employee',
    component: () => import('../components/EmployeeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/company',
    component: () => import('../components/CompanyView.vue'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

function checkAuth(to, from, next) {
  const isLogged = store.getters['auth/isLogged'];
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLogged) {
      return next();
    }
    return next({
      path: '/login'
    });
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    if (!isLogged) return next();
    return next({ path: '/' });
  }
  return next();
}

router.beforeEach(checkAuth);

export default router;
