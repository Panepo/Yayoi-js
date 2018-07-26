import * as types from '../constants/ConstActionTypes'

export function layoutContent(modelId, display) {
  return {
    type: types.LAYOUT_CONTENT,
    modelId,
    display
  }
}
