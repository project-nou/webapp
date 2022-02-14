import Vue from 'vue';
// import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
