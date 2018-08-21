import * as types from '../constants/ConstActionTypes'

export function iframeSwitch(onoff) {
  return {
    type: types.IFRMAE_SWITCH,
    onoff
  }
}
