<template>
  <div class="capture-settings w3-card w3-padding">
    <h3>捕捉设置</h3>
    <el-form label-position="top">
      <el-form-item label="捕捉模式">
        <el-radio-group v-model="captureMode">
          <el-radio-button label="face">面部捕捉</el-radio-button>
          <el-radio-button label="body">身体捕捉</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="捕捉灵敏度">
        <el-slider v-model="sensitivity" :min="1" :max="10" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElSlider } from 'element-plus'

const captureMode = ref('face')
const sensitivity = ref(5)
</script>

<style scoped>
.capture-settings {
  background-color: var(--card-bg);
  margin-bottom: 15px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>