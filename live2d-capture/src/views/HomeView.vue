<template>
  <div class="w3-container w3-padding">
    <div class="w3-row">
      <!-- 左侧面板 -->
      <div class="w3-col m4 l3">
        <model-selector />
        <mode-selector />
        <capture-settings />
      </div>
      
      <!-- 主内容区 -->
      <div class="w3-col m8 l9">
        <div class="w3-row">
          <div class="w3-col s12 m6">
            <camera-preview />
          </div>
          <div class="w3-col s12 m6">
            <live2d-viewer />
          </div>
        </div>
        
        <div class="w3-row w3-margin-top">
          <parameter-controls />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModelSelector from '@/components/model/ModelSelector.vue'
import ModeSelector from '@/components/settings/ModeSelector.vue'
import CaptureSettings from '@/components/settings/CaptureSettings.vue'
import CameraPreview from '@/components/capture/CameraPreview.vue'
import Live2dViewer from '@/components/model/Live2dViewer.vue'
import ParameterControls from '@/components/capture/ParameterControls.vue'
</script>