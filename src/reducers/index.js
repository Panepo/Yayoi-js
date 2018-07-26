import { combineReducers } from 'redux'
import { default as reducerLayout } from './reducerLayout'
import { default as reducerTensor } from './reducerTensor'

export default combineReducers({
  reducerLayout,
  reducerTensor
})
