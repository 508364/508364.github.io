import * as PIXI from 'pixi.js'
import { Live2DModel } from 'live2d-webgl-sdk'

export function useLive2D(canvasRef) {
  const app = new PIXI.Application({
    view: canvasRef.value,
    transparent: true,
    autoStart: true,
    resolution: window.devicePixelRatio || 1
  })
  
  let currentModel = null
  
  const loadModel = async (modelPath) => {
    if (currentModel) {
      app.stage.removeChild(currentModel)
    }
    
    currentModel = await Live2DModel.from(modelPath)
    app.stage.addChild(currentModel)
    
    // 居中显示
    currentModel.position.set(
      app.screen.width / 2,
      app.screen.height / 2
    )
    
    return currentModel
  }
  
  const updateModelParams = (params) => {
    if (!currentModel) return
    
    // 更新模型参数
    Object.entries(params).forEach(([key, value]) => {
      currentModel.internalModel.coreModel.setParamFloat(key, value)
    })
  }
  
  const destroy = () => {
    app.destroy(true)
  }
  
  return {
    loadModel,
    updateModelParams,
    destroy
  }
}