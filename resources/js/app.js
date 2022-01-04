require('./bootstrap');

import CustomerComponent from './components/CustomerComponent';
import PaginationComponent from './components/PaginationComponent';

import {createApp} from 'vue';
const app = createApp({});

// s-notify
import snotify from 'vue3-snotify';
import 'vue3-snotify/style';
app.use(snotify);

// v-form
import {Form, HasError,AlertError} from 'vform'
window.Form = Form;

// vue progressbar
// import VueProgressBar from 'vue-progressbar';
// const VueProgressBarOptions = {
//     color: '#12fa28',
//     failedColor: '#87150c',
//     thickness: '5px',
//     transition: {
//         speed: '0.2s',
//         opacity: '0.6s',
//         termination: 300
//     },
//     autoRevert: true,
//     location: 'top',
//     inverse: false
// };
//
// app.use(VueProgressBar, VueProgressBarOptions);

app.component('customer-component', CustomerComponent);
app.component('pagination-component', PaginationComponent);
app.component(HasError, HasError);
app.component(AlertError, AlertError);


app.mount('#app');
