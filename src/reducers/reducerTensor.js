import { LAYOUT_CONTENT } from '../constants/ConstActionTypes'
import * as tf from '@tensorflow/tfjs'

const initialState = {
  contentDisplay: false
}

const modelPath = './model/yayoi_srcnn_935.json'
let model

const SHAPE_SIZE = 32

const loadModel = async () => {
  model = await tf.loadModel(modelPath)
  model.predict(tf.zeros([1, SHAPE_SIZE, SHAPE_SIZE, 3])).dispose()
}

export default function reducerTensor(state = initialState, action) {
  switch (action.type) {
    case LAYOUT_CONTENT:
      return Object.assign({}, state, {
        contentDisplay: action.display
      })
    default:
      loadModel()
      return state
  }
}
