import * as tf from '@tensorflow/tfjs'

// ==========================================================================
// Image size related functions
// ==========================================================================
export const checkHW = (width, height, maxWidth, maxHeight) => {
  if (width > height) {
    if (width > maxWidth) {
      return [maxWidth, Math.floor((maxHeight * height) / width)]
    }
  } else {
    if (height > maxHeight) {
      return [Math.floor((maxWidth * width) / height), maxHeight]
    }
  }
  return [width, height]
}

// ==========================================================================
// Image transformation related functions
// ==========================================================================

export const rgba2ycbcr = (input, output) => {
  const ctxi = input.getContext('2d')
  const ctxo = output.getContext('2d')
  const imageData = ctxi.getImageData(0, 0, input.width, input.height)
  let data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    data[i] = 0.299 * r + 0.587 * g + 0.114 * b + 0
    data[i + 1] = -0.169 * r + -0.331 * g + 0.5 * b + 128
    data[i + 2] = 0.5 * r + -0.419 * g + -0.081 * b + 128
  }
  ctxo.putImageData(imageData, 0, 0)
}

export const ycbcr2rgb = (input, output) => {
  const ctxi = input.getContext('2d')
  const ctxo = output.getContext('2d')
  const imageData = ctxi.getImageData(0, 0, input.width, input.height)
  let data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    let y = data[i]
    let cb = data[i + 1]
    let cr = data[i + 2]

    data[i] = y + 1.402 * (cr - 128)
    data[i + 1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128)
    data[i + 2] = y + 1.772 * (cb - 128)
  }
  ctxo.putImageData(imageData, 0, 0)
}

export const rgba2gray = (input, output) => {
  const ctxi = input.getContext('2d')
  const ctxo = output.getContext('2d')
  const imageData = ctxi.getImageData(0, 0, input.width, input.height)
  let data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg // red
    data[i + 1] = avg // green
    data[i + 2] = avg // blue
  }
  ctxo.putImageData(imageData, 0, 0)
}

// ==========================================================================
// Image channel related functions
// ==========================================================================

export const splitY = (input, output) => {
  const ctxi = input.getContext('2d')
  const ctxo = output.getContext('2d')
  const imageData = ctxi.getImageData(0, 0, input.width, input.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i + 1] = 0
    data[i + 2] = 0
  }
  ctxo.putImageData(imageData, 0, 0)
}

export const mergeY = (input, inputY, output) => {
  const ctxi = input.getContext('2d')
  const imgi = ctxi.getImageData(0, 0, input.width, input.height)
  const datai = imgi.data
  const ctxy = inputY.getContext('2d')
  const imgy = ctxy.getImageData(0, 0, input.width, input.height)
  const datay = imgy.data

  const ctxo = output.getContext('2d')

  for (let i = 0; i < datai.length; i += 4) {
    datai[i] = datay[i]
  }
  ctxo.putImageData(datai, 0, 0)
}

// ==========================================================================
// Image size related functions
// ==========================================================================

export const imageResize = (input, output, width, height) => {
  const imageScale = tf.tidy(() => {
    const imageData = tf
      .fromPixels(input)
      .toFloat()
      .div(tf.scalar(255))
    return tf.image.resizeBilinear(imageData, [width, height], false)
  })
  tf.toPixels(imageScale, output)
}
