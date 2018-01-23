import Vue from 'vue'
import Router from 'vue-router'
import Index from "@/view/Index.vue"
import Login from "@/view/Login.vue"
import form from "@/view/form.vue"
import commonFooter from "@/view/commonFooter"
import Mine from "@/view/Mine.vue"
import detail from "@/view/detail.vue"
import Setting from "@/view/Setting.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/commonFooter',
      name: 'commonFooter',
      component: commonFooter,
      children:[
        {
          path: '/',
          redirect: '/Index'
        },
        {
          path: 'Index',
          name: 'Index',
          component: Index
        },
        {
          path:'detail',
          name:'dateil',
          component:detail
        }
      ]
    },
    {
      path: '/form',
      name: 'form',
      component: form
    },
    {
      path:'/Mine',
      name:'Mine',
      component:Mine
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path:'/Setting',
      name:'Setting',
      component:Setting
    }
  ]
})
