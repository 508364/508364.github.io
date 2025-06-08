<template>
  <div class="model-viewer">
    <canvas ref="canvasEl"></canvas>
    <div v-if="loading" class="loading-overlay">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>模型加载中...</span>
    </div>
    <div v-if="error" class="error-overlay">
      <el-icon class="error-icon"><Warning /></el-icon>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as PIXI from 'pixi.js';
import { Loading, Warning } from '@element-plus/icons-vue';

const props = defineProps({
  modelUrl: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  },
  scale: {
    type: Number,
    default: 0.15
  }
});

const emit = defineEmits(['loaded', 'error']);

const canvasEl = ref(null);
const loading = ref(false);
const error = ref('');
let app = null;
let currentModel = null;
let resizeObserver = null;

const initRenderer = async () => {
  if (!canvasEl.value) return;
  
  try {
    app = new PIXI.Application({
      view: canvasEl.value,
      transparent: true,
      autoStart: true,
      backgroundAlpha: 0,
      resizeTo: canvasEl.value.parentElement
    });
    
    // 初始化后加载模型
    await loadModel(props.modelUrl);
    
    // 添加窗口大小变化监听
    setupResizeObserver();
  } catch (err) {
    console.error('渲染器初始化失败:', err);
    error.value = `渲染器初始化失败: ${err.message}`;
    emit('error', err);
  }
};

const loadModel = async (url) => {
  if (!url || !app) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    // 清理现有模型
    if (currentModel) {
      app.stage.removeChild(currentModel);
      currentModel.destroy({ children: true });
      currentModel = null;
    }
    
    // 等待Live2D核心库加载
    await loadLive2DCore();
    
    currentModel = await window.Live2DModel.from(url);
    app.stage.addChild(currentModel);
    
    // 初始参数设置
    updateModelParams(props.params);
    
    // 居中显示
    centerModel();
    
    emit('loaded', currentModel);
  } catch (err) {
    console.error('模型加载失败:', err);
    error.value = `模型加载失败: ${err.message}`;
    emit('error', err);
  } finally {
    loading.value = false;
  }
};

const loadLive2DCore = () => {
  return new Promise((resolve, reject) => {
    if (window.Live2DModel) return resolve();
    
    const script = document.createElement('script');
    script.src = '/live2d/core/live2dcubismcore.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Live2D core'));
    document.head.appendChild(script);
  });
};

const centerModel = () => {
  if (!currentModel || !app) return;
  
  currentModel.position.set(
    app.screen.width / 2,
    app.screen.height / 2
  );
  currentModel.scale.set(props.scale);
};

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

const setupResizeObserver = () => {
  if (!canvasEl.value?.parentElement) return;
  
  resizeObserver = new ResizeObserver(() => {
    if (app) {
      app.renderer.resize(
        canvasEl.value.parentElement.clientWidth,
        canvasEl.value.parentElement.clientHeight
      );
      centerModel();
    }
  });
  
  resizeObserver.observe(canvasEl.value.parentElement);
};

// 初始化
onMounted(() => {
  initRenderer();
});

// 监听模型URL变化
watch(() => props.modelUrl, (newUrl) => {
  if (newUrl) loadModel(newUrl);
}, { immediate: true });

// 监听参数变化
watch(() => props.params, (newParams) => {
  updateModelParams(newParams);
}, { deep: true });

// 监听缩放比例变化
watch(() => props.scale, () => {
  centerModel();
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  
  if (app) {
    app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true
    });
    app = null;
  }
});
</script>

<style scoped>
.model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  
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
    gap: 8px;
  }
  
  .loading-icon {
    animation: rotate 2s linear infinite;
    font-size: 24px;
  }
  
  .error-icon {
    color: var(--el-color-danger);
    font-size: 24px;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>