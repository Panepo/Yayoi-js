import * as types from '../constants/ConstActionTypes'

export function imageUpload(modelId, display) {
  return {
    type: types.IMAGE_UPLOAD,
    modelId,
    display
  }
}
