const initialState = {
  temp: 1
}

export default function reducerTensorFlow(state = initialState, action) {
  switch (action.type) {
    default:
      return Object.assign({}, state, {
        temp: 2
      })
  }
}
