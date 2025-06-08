<template>
  <div class="camera-container">
    <!-- 摄像头状态指示 -->
    <div v-if="statusMessage" class="status-message" :class="statusClass">
      <el-icon :size="20">
        <component :is="statusIcon" />
      </el-icon>
      {{ statusMessage }}
    </div>
    
    <!-- 视频预览区域 -->
    <div class="video-wrapper" :class="{ 'is-active': isActive }">
      <video ref="videoEl" autoplay muted playsinline></video>
      <div v-if="!isActive" class="camera-placeholder">
        <el-icon :size="50"><VideoCamera /></el-icon>
      </div>
    </div>
    
    <!-- 控制按钮 -->
    <div class="controls">
      <el-button 
        type="primary" 
        :icon="isActive ? SwitchButton : VideoPlay"
        @click="toggleCamera"
        :loading="isLoading"
        round
      >
        {{ isActive ? '关闭摄像头' : '开启摄像头' }}
      </el-button>
      
      <el-select 
        v-model="selectedDevice" 
        placeholder="选择摄像头" 
        v-if="devices.length > 1"
        @change="changeCamera"
        size="small"
      >
        <el-option
          v-for="device in devices"
          :key="device.deviceId"
          :label="device.label || `摄像头 ${device.deviceId.slice(0, 5)}`"
          :value="device.deviceId"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  ElButton, ElSelect, ElOption, ElIcon 
} from 'element-plus';
import { 
  VideoCamera, VideoPlay, SwitchButton,
  CircleCheckFilled, WarningFilled, InfoFilled
} from '@element-plus/icons-vue';

const videoEl = ref(null);
const isActive = ref(false);
const isLoading = ref(false);
const devices = ref([]);
const selectedDevice = ref('');
const statusMessage = ref('');
const statusClass = ref('');
const statusIcon = ref(InfoFilled);

let stream = null;

// 获取可用摄像头列表
const getCameraDevices = async () => {
  try {
    devices.value = [];
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    devices.value = mediaDevices.filter(device => device.kind === 'videoinput');
    
    if (devices.value.length > 0) {
      selectedDevice.value = devices.value[0].deviceId;
      updateStatus('找到可用摄像头', 'success');
    } else {
      updateStatus('未检测到摄像头设备', 'error');
    }
  } catch (err) {
    console.error('获取设备列表失败:', err);
    updateStatus('获取设备列表失败', 'error');
  }
};

// 更新状态显示
const updateStatus = (message, type = 'info') => {
  statusMessage.value = message;
  statusClass.value = type;
  
  switch(type) {
    case 'success':
      statusIcon.value = CircleCheckFilled;
      break;
    case 'error':
      statusIcon.value = WarningFilled;
      break;
    default:
      statusIcon.value = InfoFilled;
  }
};

// 启动指定摄像头
const startCamera = async (deviceId) => {
  try {
    isLoading.value = true;
    updateStatus('正在启动摄像头...', 'info');
    
    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    };

    // 尝试高级模式
    stream = await navigator.mediaDevices.getUserMedia(constraints)
      .catch(async () => {
        // 如果高级模式失败，尝试基本模式
        constraints.video = true;
        return navigator.mediaDevices.getUserMedia(constraints);
      });

    videoEl.value.srcObject = stream;
    isActive.value = true;
    updateStatus('摄像头已启用', 'success');
    
    // 监听摄像头断开事件
    stream.getVideoTracks()[0].onended = () => {
      stopCamera();
      updateStatus('摄像头已断开', 'error');
    };
    
  } catch (err) {
    console.error('摄像头错误:', err);
    handleCameraError(err);
  } finally {
    isLoading.value = false;
  }
};

// 处理摄像头错误
const handleCameraError = (err) => {
  let message = '摄像头访问失败';
  
  switch(err.name) {
    case 'NotAllowedError':
      message = '请允许摄像头访问权限';
      break;
    case 'NotFoundError':
      message = '未找到摄像头设备';
      break;
    case 'NotReadableError':
      message = '摄像头被占用或不可读';
      break;
    case 'OverconstrainedError':
      message = '无法满足分辨率要求';
      break;
    default:
      message = `摄像头错误: ${err.message}`;
  }
  
  updateStatus(message, 'error');
  isActive.value = false;
};

// 停止摄像头
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

// 切换摄像头
const toggleCamera = async () => {
  if (isActive.value) {
    stopCamera();
    updateStatus('摄像头已关闭', 'info');
  } else {
    await startCamera(selectedDevice.value);
  }
};

// 切换摄像头设备
const changeCamera = () => {
  if (isActive.value) {
    stopCamera();
    startCamera(selectedDevice.value);
  }
};

// 初始化时获取设备列表
onMounted(async () => {
  try {
    // 先请求权限
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    tempStream.getTracks().forEach(track => track.stop());
    
    // 然后枚举设备
    await getCameraDevices();
  } catch (err) {
    console.error('初始化失败:', err);
    updateStatus('初始化摄像头失败', 'error');
  }
});

// 组件卸载时清理
onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.status-message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  &.success {
    color: var(--el-color-success);
    background-color: var(--el-color-success-light-9);
  }
  
  &.error {
    color: var(--el-color-danger);
    background-color: var(--el-color-danger-light-9);
  }
  
  &.info {
    color: var(--el-color-info);
    background-color: var(--el-color-info-light-9);
  }
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  
  &.is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary);
  }
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
  background: var(--el-fill-color-light);
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
</style>