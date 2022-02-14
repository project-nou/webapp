import Vue from 'vue';
import VueRouter from 'vue-router';
import Auth from '@/views/Auth.vue';
import Group from '@/views/Group.vue';
import MyGroups from '../views/MyGroups.vue';

Vue.use(VueRouter);

const routes = [
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
  },
  {
    path: '/group/:id',
    name: 'Group',
    component: Group,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
