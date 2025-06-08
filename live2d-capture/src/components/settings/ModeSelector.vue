<template>
  <div class="mode-selector w3-card w3-padding">
    <h3>操作模式</h3>
    <el-radio-group v-model="operationMode" class="w3-margin-bottom">
      <el-radio-button label="auto">全自动</el-radio-button>
      <el-radio-button label="hybrid">混合模式</el-radio-button>
      <el-radio-button label="manual">专业模式</el-radio-button>
    </el-radio-group>
    <el-alert v-if="operationMode === 'manual'" title="专业模式已启用" type="warning" show-icon>
      您正在使用专业模式，可以手动调整所有参数
    </el-alert>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadioButton, ElAlert } from 'element-plus'

const operationMode = ref('auto')
</script>

<style scoped>
.mode-selector {
  background-color: var(--card-bg);
  margin-bottom: 15px;
}

.el-radio-group {
  width: 100%;
}
</style>