import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
// import quichtify from 'quichtify';
// import 'quichtify/dist/style.css';

Vue.config.productionTip = false;
// Vue.use(quichtify);

new Vue({
  router,
  vuetify,
  // store,
  render: (h) => h(App),
}).$mount('#app');
