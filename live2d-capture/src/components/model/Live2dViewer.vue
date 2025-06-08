<template>
  <div class="w3-card w3-padding">
    <h3>Live2D Viewer</h3>
    <canvas ref="canvas" class="w3-responsive"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLive2D } from '@/composables/useLive2D'

const props = defineProps({
  modelPath: String
})

const canvas = ref(null)
const { loadModel, updateModelParams, destroy } = useLive2D(canvas)

onMounted(async () => {
  if (props.modelPath) {
    await loadModel(props.modelPath)
  }
})

onUnmounted(() => {
  destroy()
})

defineExpose({
  updateModelParams
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: auto;
  max-height: 400px;
  background-color: #f5f5f5;
}
</style>