import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'w3-css/w3.css'
import './styles/main.scss'

// 动态加载 Live2D 核心库
const loadLive2DCore = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = '/live2d/core/live2dcubismcore.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

const initApp = async () => {
  await loadLive2DCore()
  
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus)
  app.mount('#app')
}

initApp()