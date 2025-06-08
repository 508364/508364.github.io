import * as tf from '@tensorflow/tfjs'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

export function useFaceCapture(videoRef) {
  let model = null
  let detecting = false
  let animationFrameId = null
  
  const init = async () => {
    await tf.ready()
    model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1 }
    )
  }
  
  const startDetection = (callback) => {
    if (!model || detecting) return
    
    detecting = true
    
    const detect = async () => {
      if (!detecting) return
      
      const predictions = await model.estimateFaces({
        input: videoRef.value
      })
      
      if (predictions.length > 0) {
        callback(predictions[0])
      }
      
      animationFrameId = requestAnimationFrame(detect)
    }
    
    detect()
  }
  
  const stopDetection = () => {
    detecting = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
  
  const dispose = () => {
    stopDetection()
    if (model) {
      model.dispose()
    }
  }
  
  return {
    init,
    startDetection,
    stopDetection,
    dispose
  }
}