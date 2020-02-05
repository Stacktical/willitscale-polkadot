import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store/index';
import filters from '@/filters/filters';

import '@/style/global.scss';

Vue.config.productionTip = false;
Vue.filter('formatJSON', filters.formatJSON);
Vue.filter('formatSLO', filters.formatSLO);
Vue.filter('formatMetric', filters.formatMetric);
Vue.filter('truncateText', filters.truncateText);
Vue.filter('roundNumber', filters.roundNumber);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
