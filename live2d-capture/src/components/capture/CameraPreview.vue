<template>
  <div class="camera-preview w3-card w3-padding">
    <h3>摄像头预览</h3>
    <video ref="video" autoplay muted playsinline class="w3-responsive"></video>
    <div class="w3-margin-top">
      <el-button @click="toggleCamera" type="primary" size="small">
        {{ isCameraActive ? '关闭摄像头' : '开启摄像头' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElButton } from 'element-plus'

const video = ref(null)
const isCameraActive = ref(false)
let stream = null

const toggleCamera = async () => {
  if (isCameraActive.value) {
    stopCamera()
  } else {
    await startCamera()
  }
}

const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 } 
    })
    video.value.srcObject = stream
    isCameraActive.value = true
  } catch (err) {
    console.error('摄像头访问失败:', err)
    ElMessage.error('无法访问摄像头: ' + err.message)
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    video.value.srcObject = null
    isCameraActive.value = false
  }
}

onMounted(() => {
  // 可选: 自动开启摄像头
  // startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-preview {
  background-color: var(--card-bg);
}

video {
  width: 100%;
  max-height: 300px;
  background-color: #000;
  border-radius: 4px;
}
</style>