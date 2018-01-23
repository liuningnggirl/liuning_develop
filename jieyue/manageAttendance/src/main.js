// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import commoncss from './assets/css/common.css'
import infiniteScroll from 'vue-infinite-scroll';
import vueresource from 'vue-resource';
import config from './config/commonServer.js'
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import './assets/css/animate.min.css';
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
Vue.use(config);
Vue.use(MintUI);
Vue.use(infiniteScroll);
Vue.use(vueresource);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data(){
    return{
      Bus: new Vue()
    }
  },
  methods:{
    
  }
})
