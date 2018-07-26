import { IMAGE_UPLOAD } from '../constants/ConstActionTypes'

const initialState = {
  contentDisplay: false
}

export default function reducerTensorFlow(state = initialState, action) {
  switch (action.type) {
    case IMAGE_UPLOAD:
      return Object.assign({}, state, {
        contentDisplay: action.display
      })
    default:
      return state
  }
}
