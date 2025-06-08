<template>
  <div class="camera-preview">
    <video 
      ref="videoEl" 
      autoplay 
      muted 
      playsinline
      :class="{ 'video-active': isActive }"
    ></video>
    <el-button 
      @click="toggleCamera" 
      type="primary"
      :disabled="isLoading"
      :icon="isActive ? 'VideoPause' : 'VideoPlay'"
    >
      {{ isActive ? '关闭摄像头' : '开启摄像头' }}
      <span v-if="isLoading" class="loading-text">(加载中...)</span>
    </el-button>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { ElButton } from 'element-plus';

const emit = defineEmits(['error']);

const videoEl = ref(null);
const isActive = ref(false);
const isLoading = ref(false);
const error = ref('');
let stream = null;

const checkCameraSupport = () => {
  return !!navigator.mediaDevices?.getUserMedia;
};

const toggleCamera = async () => {
  if (isActive.value) {
    stopCamera();
  } else {
    if (!checkCameraSupport()) {
      error.value = '您的浏览器不支持摄像头访问';
      emit('error', new Error(error.value));
      return;
    }
    await startCamera();
  }
};

const startCamera = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
        frameRate: { ideal: 30 }
      } 
    });
    
    if (!videoEl.value) {
      throw new Error('视频元素未初始化');
    }
    
    videoEl.value.srcObject = stream;
    isActive.value = true;
  } catch (err) {
    console.error('摄像头错误:', err);
    error.value = `摄像头访问失败: ${err.message}`;
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    stream = null;
  }
  
  if (videoEl.value) {
    videoEl.value.srcObject = null;
  }
  
  isActive.value = false;
};

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
/* 保持原有样式不变 */
.camera-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  
  video {
    width: 100%;
    max-height: 400px;
    background: #000;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &.video-active {
      border: 2px solid var(--el-color-primary);
    }
  }
  
  .error-message {
    color: var(--el-color-danger);
    font-size: 14px;
    margin-top: 8px;
  }
  
  .loading-text {
    margin-left: 8px;
    opacity: 0.7;
  }
}
</style>