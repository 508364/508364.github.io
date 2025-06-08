<template>
  <div class="home-container">
    <div class="control-panel">
      <ModelSelector @select="handleModelSelect" />
      <ModeSelector v-model="mode" />
      <CaptureSettings />
      <ParameterControls @update="updateModelParams" />
    </div>
    
    <div class="preview-panel">
      <CameraPreview />
      <Live2dViewer 
        :modelUrl="currentModel" 
        :params="modelParams"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModelSelector from '@/components/model/ModelSelector.vue';
import ModeSelector from '@/components/settings/ModeSelector.vue';
import CaptureSettings from '@/components/settings/CaptureSettings.vue';
import CameraPreview from '@/components/capture/CameraPreview.vue';
import Live2dViewer from '@/components/model/Live2dViewer.vue';
import ParameterControls from '@/components/capture/ParameterControls.vue';

const mode = ref('auto');
const currentModel = ref('');
const modelParams = ref({});

const handleModelSelect = (modelPath) => {
  currentModel.value = `/models/${modelPath}/${modelPath}.model.json`;
};

const updateModelParams = (params) => {
  modelParams.value = { ...params };
};
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: 100vh;
  padding: 20px;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-panel {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr;
  }
}
</style>