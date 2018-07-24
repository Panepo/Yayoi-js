import * as types from '../constants/ConstActionTypes'

export function layoutContent(display) {
  return {
    type: types.LAYOUT_CONTENT,
    display
  }
}
