<template>
  <div class="live2d-viewer">
    <canvas ref="canvasEl"></canvas>
    <div v-if="loading" class="loading-overlay">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>Live2D模型加载中...</span>
    </div>
    <div v-if="error" class="error-overlay">
      <el-icon class="error-icon"><Warning /></el-icon>
      <span>{{ error }}</span>
      <el-button 
        v-if="showRetry" 
        type="primary" 
        size="small" 
        @click="retryLoad"
        class="retry-button"
      >
        重试
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as PIXI from 'pixi.js';
import { Loading, Warning } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

const props = defineProps({
  modelUrl: {
    type: String,
    required: true,
    validator: (value) => {
      return value.startsWith('http') || value.startsWith('/');
    }
  },
  params: {
    type: Object,
    default: () => ({})
  },
  scale: {
    type: Number,
    default: 0.15,
    validator: (value) => value > 0 && value <= 1
  },
  autoResize: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['loaded', 'error', 'retry']);

const canvasEl = ref(null);
const loading = ref(false);
const error = ref('');
const showRetry = ref(false);
let app = null;
let currentModel = null;
let resizeObserver = null;

// 初始化PIXI渲染器
const initRenderer = async () => {
  try {
    if (!canvasEl.value) {
      throw new Error('Canvas element not found');
    }

    app = new PIXI.Application({
      view: canvasEl.value,
      transparent: true,
      autoStart: true,
      backgroundAlpha: 0,
      resizeTo: props.autoResize ? canvasEl.value.parentElement : undefined
    });

    await nextTick();
    await loadModel(props.modelUrl);
  } catch (err) {
    handleError(err, '渲染器初始化失败');
  }
};

// 加载Live2D模型
const loadModel = async (url) => {
  if (!url || !app) return;
  
  try {
    resetState();
    loading.value = true;
    
    // 清理现有模型
    if (currentModel) {
      cleanupModel();
    }
    
    // 加载Live2D核心库
    await loadLive2DCore();
    
    // 从URL加载模型
    currentModel = await window.Live2DModel.from(url);
    app.stage.addChild(currentModel);
    
    // 设置模型参数和位置
    updateModelParams(props.params);
    centerModel();
    
    emit('loaded', currentModel);
  } catch (err) {
    handleError(err, '模型加载失败');
    showRetry.value = true;
  } finally {
    loading.value = false;
  }
};

// 加载Live2D核心库
const loadLive2DCore = () => {
  return new Promise((resolve, reject) => {
    if (window.Live2DModel) return resolve();
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pixi-live2d-display@latest/dist/live2dcubismcore.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Live2D核心库加载失败'));
    script.id = 'live2d-core-script';
    document.head.appendChild(script);
  });
};

// 居中显示模型
const centerModel = () => {
  if (!currentModel || !app) return;
  
  currentModel.position.set(
    app.screen.width / 2,
    app.screen.height / 2
  );
  currentModel.scale.set(props.scale);
};

// 更新模型参数
const updateModelParams = (params) => {
  if (!currentModel) return;
  
  Object.entries(params).forEach(([key, value]) => {
    try {
      currentModel.internalModel.coreModel.setParamFloat(key, value);
    } catch (err) {
      console.warn(`参数设置失败: ${key}=${value}`, err);
    }
  });
};

// 设置响应式布局
const setupResizeObserver = () => {
  if (!props.autoResize || !canvasEl.value?.parentElement) return;
  
  resizeObserver = new ResizeObserver(() => {
    if (app && app.renderer) {
      try {
        const parent = canvasEl.value.parentElement;
        app.renderer.resize(
          parent.clientWidth,
          parent.clientHeight
        );
        centerModel();
      } catch (err) {
        console.error('调整大小失败:', err);
      }
    }
  });
  
  resizeObserver.observe(canvasEl.value.parentElement);
};

// 清理模型
const cleanupModel = () => {
  if (currentModel && app) {
    app.stage.removeChild(currentModel);
    currentModel.destroy({ children: true });
    currentModel = null;
  }
};

// 重置状态
const resetState = () => {
  error.value = '';
  showRetry.value = false;
};

// 错误处理
const handleError = (err, prefix = '') => {
  const message = prefix ? `${prefix}: ${err.message}` : err.message;
  console.error(message, err);
  error.value = message;
  emit('error', err);
};

// 重试加载
const retryLoad = () => {
  emit('retry');
  loadModel(props.modelUrl);
};

// 初始化
onMounted(() => {
  initRenderer();
  if (props.autoResize) {
    setupResizeObserver();
  }
});

// 监听属性变化
watch(() => props.modelUrl, loadModel);
watch(() => props.params, updateModelParams, { deep: true });
watch(() => props.scale, centerModel);

// 清理
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  
  cleanupModel();
  
  if (app) {
    app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true
    });
    app = null;
  }
  
  // 移除Live2D核心库脚本
  const script = document.getElementById('live2d-core-script');
  if (script) {
    script.remove();
  }
});
</script>

<style scoped>
.live2d-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 16px;
    gap: 12px;
    z-index: 10;
  }
  
  .loading-icon {
    animation: rotate 2s linear infinite;
    font-size: 32px;
  }
  
  .error-icon {
    color: var(--el-color-danger);
    font-size: 32px;
  }
  
  .retry-button {
    margin-top: 16px;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>