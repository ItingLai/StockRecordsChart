import appHome from "@/views/appHome.vue"
import appAuthor from "@/views/appAuthor.vue"
import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
  { 
    path: '/', 
    component: appHome,
    meta:{keepAlive:true} 
  },
  { 
    path: '/author', 
    component: appAuthor,
    meta:{keepAlive:false}
   },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

