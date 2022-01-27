import Vue from 'vue';
import VueRouter from 'vue-router';
import MyGroups from '../views/MyGroups.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/my_groups',
    name: 'MyGroups',
    component: MyGroups,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
