<template>
  <div class="model-selector w3-card w3-padding">
    <h3>模型选择</h3>
    <el-select v-model="selectedModel" placeholder="选择Live2D模型" class="w3-margin-bottom">
      <el-option
        v-for="model in modelList"
        :key="model.value"
        :label="model.label"
        :value="model.value"
      />
    </el-select>
    <el-button type="primary" @click="loadModel" :disabled="!selectedModel">加载模型</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElSelect, ElOption, ElButton } from 'element-plus'

const selectedModel = ref('')
const modelList = ref([
  { value: 'haru', label: 'Haru' },
  { value: 'hijiki', label: 'Hijiki' },
  { value: 'mark', label: 'Mark' }
])

const emit = defineEmits(['model-selected'])

const loadModel = () => {
  emit('model-selected', selectedModel.value)
}
</script>

<style scoped>
.model-selector {
  background-color: var(--card-bg);
  margin-bottom: 15px;
}

.el-select {
  width: 100%;
}
</style>