<template>
  <div class="performance-monitor">
    <span class="fps">FPS: {{ fps.toFixed(1) }}</span>
    <span class="memory">内存: {{ memory }} MB</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const fps = ref(0)
const memory = ref(0)

let frameCount = 0
let lastTime = performance.now()
let animationFrameId = null

const updateStats = () => {
  frameCount++
  const now = performance.now()
  const delta = now - lastTime
  
  if (delta >= 1000) {
    fps.value = (frameCount * 1000) / delta
    frameCount = 0
    lastTime = now
    
    // 内存监测（仅限Chrome）
    if (window.performance?.memory) {
      memory.value = (window.performance.memory.usedJSHeapSize / 1048576).toFixed(1)
    }
  }
  
  animationFrameId = requestAnimationFrame(updateStats)
}

onMounted(() => {
  updateStats()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.performance-monitor {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
  
  span {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}
</style>