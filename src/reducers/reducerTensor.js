import { IMAGE_UPLOAD } from '../constants/ConstActionTypes'
import * as tf from '@tensorflow/tfjs'

const initialState = {
  inputId: '',
  outputImg: null
}

const modelPath = './model/model.json'
let model

const SHAPE_SIZE = 32

const loadModel = async () => {
  model = await tf.loadModel(modelPath)
  model.predict(tf.zeros([1, SHAPE_SIZE, SHAPE_SIZE, 1])).dispose()
}

const predict = async imgId => {
  let imgElement = document.getElementById(imgId)

  return tf.tidy(() => {
    const img = tf
      .fromPixels(imgElement)
      .toFloat()
      .div(tf.scalar(255))

    return model
      .predict(img)
      .mul(tf.scalar(255))
      .maximum(tf.scalar(255))
      .minimum(tf.scalar(0))
  })
}

export default function reducerTensor(state = initialState, action) {
  let imgId

  switch (action.type) {
    case IMAGE_UPLOAD:
      imgId = action.modelId + '_imageUploader_img'

      return Object.assign({}, state, {
        inputId: action.modelId,
        outputImg: predict(imgId)
      })
    default:
      loadModel()
      return state
  }
}
