<template>
  <div class="parameter-controls">
    <el-collapse v-model="activePanels">
      <el-collapse-item title="面部参数" name="face">
        <el-form label-position="top">
          <el-form-item label="眼睛开合">
            <el-slider v-model="params.eyeOpen" :min="0" :max="1" :step="0.01" />
          </el-form-item>
          <el-form-item label="嘴巴开合">
            <el-slider v-model="params.mouthOpen" :min="0" :max="1" :step="0.01" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      
      <el-collapse-item title="身体动作" name="body">
        <el-form label-position="top">
          <el-form-item label="头部角度X">
            <el-slider v-model="params.angleX" :min="-30" :max="30" />
          </el-form-item>
          <el-form-item label="头部角度Y">
            <el-slider v-model="params.angleY" :min="-30" :max="30" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update']);

const activePanels = ref(['face', 'body']);
const params = ref({
  eyeOpen: 0.5,
  mouthOpen: 0.3,
  angleX: 0,
  angleY: 0
});

watch(params, (newParams) => {
  emit('update', newParams);
}, { deep: true });
</script>