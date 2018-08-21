import { IFRMAE_SWITCH } from '../constants/ConstActionTypes'

const initialState = {
  iframeDisplay: false
}

const reducerLayout = (state = initialState, action) => {
  switch (action.type) {
    case IFRMAE_SWITCH:
      return {
        ...state,
        iframeDisplay: action.onoff
      }
    default:
      return state
  }
}

export default reducerLayout
