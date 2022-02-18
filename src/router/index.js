import Vue from 'vue';
import VueRouter from 'vue-router';
import Auth from '@/views/Auth.vue';
import Group from '@/views/Group.vue';
import MyGroups from '../views/MyGroups.vue';
import jwt_decode from "jwt-decode";

Vue.use(VueRouter);

// Test is token is valid
const isAuthenticated = (to, from, next) => {
  const decodeToken = jwt_decode(localStorage.getItem('token'));
  const expToken = decodeToken['exp'];
  if(expToken >= (new Date().getTime() + 1) / 1000) {
    next()
  } else{
    next('/login');
  }
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Auth,
  },
  {
    path: '/login',
    name: 'Login',
    component: Auth,
  },
  {
    path: '/register',
    name: 'Register',
    component: Auth,
  },
  {
    path: '/my_groups',
    name: 'MyGroups',
    component: MyGroups,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/group/:id',
    name: 'Group',
    component: Group,
    beforeEnter: isAuthenticated,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
