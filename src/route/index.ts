import appHome from "@/views/appHome.vue"
import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
  { 
    path: '/', 
    component: appHome,
    meta:{keepAlive:true} 
  },
  { 
    path: '/author', 
    component: import('@/views/appAuthor.vue'),
    meta:{keepAlive:false}
   },
]

export const router = createRouter({
  history: createWebHashHistory(process.env.NODE_ENV == 'development' ? "/" : "/StockRecordsChart/"),
  routes,
})

