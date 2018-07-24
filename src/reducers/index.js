import { combineReducers } from 'redux'
import { default as reducerTensor } from './reducerTensor'
import { default as reducerLayout } from './reducerLayout'

export default combineReducers({
  reducerTensor,
  reducerLayout
})
