import Vue from 'vue';
// import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
// import store from './store/store';

//Vue.use(Vuex)

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  // store,
  render: (h) => h(App),
}).$mount('#app');
