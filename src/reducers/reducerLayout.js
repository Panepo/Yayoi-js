import { LAYOUT_CONTENT } from '../constants/ConstActionTypes'

const initialState = {
  contentDisplay: false
}

export default function reducerTensorFlow(state = initialState, action) {
  switch (action.type) {
    case LAYOUT_CONTENT:
      return Object.assign({}, state, {
        contentDisplay: action.display
      })
    default:
      return state
  }
}
