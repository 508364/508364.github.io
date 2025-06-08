<template>
  <div id="app">
    <!-- 主题应用容器 -->
    <div :class="['theme-container', `theme-${themeStore.currentTheme}`]">
      <!-- 顶部导航栏 -->
      <nav class="app-header w3-card">
        <h1>Live2D 动捕/面捕工具</h1>
        <theme-selector />
      </nav>
      
      <!-- 主内容区 -->
      <main class="app-main">
        <router-view />
      </main>
      
      <!-- 底部状态栏 -->
      <footer class="app-footer">
        <performance-monitor v-if="isDeveloperMode" />
        <div class="version">v1.0.0</div>
      </footer>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'
import PerformanceMonitor from '@/components/dev/PerformanceMonitor.vue'
import { useRoute } from 'vue-router'

const themeStore = useThemeStore()
const route = useRoute()

const isDeveloperMode = computed(() => route.meta.developerMode)
</script>

<style lang="scss">
@import '@/styles/main.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.theme-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.app-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--header-bg);
  z-index: 10;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
}

.app-main {
  flex: 1;
  padding: 1rem;
}

.app-footer {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  background-color: var(--footer-bg);
  
  .version {
    opacity: 0.7;
  }
}
</style>