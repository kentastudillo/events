require('./bootstrap');

window.Vue = require('vue');

import VueSweetAlert from 'vue-sweetalert'

Vue.use(VueSweetAlert);

import EventsComponent from './components/EventsComponent';

new Vue({ render: h => h(EventsComponent) }).$mount('#app');
