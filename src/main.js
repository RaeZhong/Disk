import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import '@/assets/icon2/iconfont.css'
import '@/assets/base.scss'
import VueCookies from 'vue-cookies'



import Message from '@/utils/Message'
import Request from '@/utils/Request'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(VueCookies)

app.mount('#app')
