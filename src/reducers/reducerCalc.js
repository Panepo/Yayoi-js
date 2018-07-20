import {
  SWITCH_MODE,
  MODIFY_SOURCE,
  MODIFY_FACTOR,
  MODIFY_PARAMETER,
  MODIFY_OPTION
} from '../constants/ConstActionTypes'

const initialState = {
  temp: 1
}

export default function reducerCalc(state = initialState, action) {
  switch (action.type) {
    default:
      return Object.assign({}, state, {
        temp: 2
      })
  }
}
