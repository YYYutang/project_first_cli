import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import DataManage from '../views/DataManage.vue'
import Characteristic from '../views/Characteristic.vue'
import DataAnalysis from '../views/dataAnalysis/DataAnalysis.vue'
import VanishCom from '../views/VanishCom.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[

           { path:'/dataManage',
            name:'DataManage',
            component:DataManage,
          },
          { path:'/dataAnalysis',
            name:'DataAnalysis',
            component:DataAnalysis,
          },
          {
            path:'/characteristic',
            name:'Characteristic',
            component:Characteristic,
          },
          {
            path:'/vanishCom',
            name:'VanishCom',
            component:VanishCom,
          }


    ]
    },

  ]
})

export default router
