import * as types from '../constants/ConstActionTypes'

export function modifySource(modelId, modelValue) {
  return {
    type: types.MODIFY_SOURCE,
    modelId,
    modelValue
  }
}

export function modifyFactor(modelId, modelValue) {
  return {
    type: types.MODIFY_FACTOR,
    modelId,
    modelValue
  }
}

export function modifyParamenter(modelId, modelValue) {
  return {
    type: types.MODIFY_PARAMETER,
    modelId,
    modelValue
  }
}

export function modifyOption(modelId) {
  return {
    type: types.MODIFY_OPTION,
    modelId
  }
}
