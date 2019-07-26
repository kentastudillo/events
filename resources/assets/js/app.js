require('./bootstrap');

window.Vue = require('vue');

import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';
import VueSweetAlert from 'vue-sweetalert'

Vue.use(VueSweetAlert);

Vue.use(AirbnbStyleDatepicker, {});

import EventsComponent from './components/EventsComponent';

new Vue({ render: h => h(EventsComponent) }).$mount('#app');
