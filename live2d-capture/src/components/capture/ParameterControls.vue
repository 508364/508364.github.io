<template>
  <div class="parameter-controls w3-card w3-padding">
    <h3>参数控制</h3>
    <div class="w3-row-padding">
      <div class="w3-col m6">
        <el-slider v-model="eyeOpen" :min="0" :max="1" :step="0.01" show-input label="眼睛开合" />
      </div>
      <div class="w3-col m6">
        <el-slider v-model="mouthOpen" :min="0" :max="1" :step="0.01" show-input label="嘴巴开合" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElSlider } from 'element-plus'

const eyeOpen = ref(0.5)
const mouthOpen = ref(0.3)

defineExpose({
  eyeOpen,
  mouthOpen
})
</script>

<style scoped>
.parameter-controls {
  background-color: var(--card-bg);
}

.el-slider {
  margin: 15px 0;
}
</style>