import * as tf from '@tensorflow/tfjs'

export const modelPath = './model/model.json'

const rgb2ycbcr = (canvasi, canvaso, width, height) => {
  const ctxi = canvasi.getContext('2d')
  const ctxo = canvaso.getContext('2d')
  const ctxiImg = ctxi.getImageData(0, 0, width, height)
  let ctxiData = ctxiImg.data

  for (let i = 0; i < ctxiData.length; i += 4) {
    let r = ctxiData[i]
    let g = ctxiData[i + 1]
    let b = ctxiData[i + 2]

    ctxiData[i] = Math.max(
      0,
      Math.min(255, Math.floor(0.299 * r + 0.587 * g + 0.114 * b + 0))
    )
    ctxiData[i + 1] = Math.max(
      0,
      Math.min(255, Math.floor(-0.169 * r + -0.331 * g + 0.5 * b + 128))
    )
    ctxiData[i + 2] = Math.max(
      0,
      Math.min(255, Math.floor(0.5 * r + -0.419 * g + -0.081 * b + 128))
    )
  }
  ctxo.putImageData(ctxiImg, 0, 0)
}

const ycbcr2rgb = (canvasi, canvaso, width, height) => {
  const ctxi = canvasi.getContext('2d')
  const ctxo = canvaso.getContext('2d')
  const ctxiImg = ctxi.getImageData(0, 0, width, height)
  let ctxiData = ctxiImg.data

  for (let i = 0; i < ctxiData.length; i += 4) {
    let y = ctxiData[i]
    let cb = ctxiData[i + 1]
    let cr = ctxiData[i + 2]

    ctxiData[i] = Math.max(0, Math.min(255, Math.floor(y + 1.402 * (cr - 128))))
    ctxiData[i + 1] = Math.max(
      0,
      Math.min(255, Math.floor(y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128)))
    )
    ctxiData[i + 2] = Math.max(
      0,
      Math.min(255, Math.floor(y + 1.772 * (cb - 128)))
    )
  }
  ctxo.putImageData(ctxiImg, 0, 0)
}

const canvasResize = (canvasi, canvaso, width, height, scale) => {
  const ctxo = canvaso.getContext('2d')
  ctxo.drawImage(
    canvasi,
    0,
    0,
    width,
    height,
    0,
    0,
    width * scale,
    height * scale
  )
}

const mergeResult = (canvasi, canvaso, data, width, height, padding) => {
  const ctxi = canvasi.getContext('2d')
  const ctxo = canvaso.getContext('2d')
  const ctxiImg = ctxi.getImageData(0, 0, width, height)
  let ctxiData = ctxiImg.data
  let j = 0

  for (let i = 0; i < ctxiData.length; i += 4) {
    let idw = Math.floor(i / (width * 4))
    if (idw >= padding && idw < height - padding) {
      let idy = i % (width * 4)
      if (idy >= padding * 4 && idy < (width - padding) * 4) {
        // console.log('orig:' + ctxiData[i] + ' replace:' + data[j])
        if (data[j] > 255) {
          ctxiData[i] = 255
        } else if (data[j] < 0) {
          ctxiData[i] = 0
        } else {
          ctxiData[i] = data[j]
        }
        j = j + 1
      }
    }
  }
  ctxo.putImageData(ctxiImg, 0, 0)
}

export const predict = (model, inputId, outputId, width, height, scale) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  // temp canvas declaration
  let canvast1 = document.createElement('canvas')
  canvast1.width = width * scale
  canvast1.height = height * scale
  let canvast2 = document.createElement('canvas')
  canvast2.width = width * scale
  canvast2.height = height * scale
  let canvast3 = document.createElement('canvas')
  canvast3.width = width * scale
  canvast3.height = height * scale

  canvasResize(canvas, canvast1, width, height, scale)
  rgb2ycbcr(canvast1, canvast2, width * scale, height * scale)

  const dataPredict = tf.tidy(() => {
    const tensorInp = tf.fromPixels(canvast2, 1).toFloat()
    const tensorNor = tensorInp.div(tf.scalar(255))
    const tensorBat = tensorNor.reshape([1, width * scale, height * scale, 1])
    const tensorOut = model.predict(tensorBat, { batchSize: 1 })
    const tensorVal = tensorOut.mul(tf.scalar(255))
    return Array.from(tensorVal.dataSync())
  })

  mergeResult(canvast2, canvast3, dataPredict, width * scale, height * scale, 6)
  ycbcr2rgb(canvast3, canvaso, width * scale, height * scale)

  // remove temp canvas
  canvast1.remove()
  canvast2.remove()
  canvast3.remove()
}

const canvasSplit4 = (
  canvasi,
  canvaso1,
  canvaso2,
  canvaso3,
  canvaso4,
  width,
  height,
  padding
) => {
  const ctxo1 = canvaso1.getContext('2d')
  const ctxo2 = canvaso2.getContext('2d')
  const ctxo3 = canvaso3.getContext('2d')
  const ctxo4 = canvaso4.getContext('2d')

  const widthS = width / 2 + padding
  const heightS = height / 2 + padding
  const widthM = width / 2 - padding
  const heightM = height / 2 - padding

  ctxo1.drawImage(canvasi, 0, 0, widthS, heightS, 0, 0, widthS, heightS)
  ctxo2.drawImage(canvasi, widthM, 0, widthS, heightS, 0, 0, widthS, heightS)
  ctxo3.drawImage(canvasi, 0, heightM, widthS, heightS, 0, 0, widthS, heightS)
  ctxo4.drawImage(
    canvasi,
    widthM,
    heightM,
    widthS,
    heightS,
    0,
    0,
    widthS,
    heightS
  )
}

const perdictMerge = (data, width, height, splitW, splitH) => {
  let output = []
  for (let i = 0; i < height * splitH; i += 1) {
    for (let j = 0; j < width * splitW; j += 1) {
      let idx = splitW * Math.floor(i / height) + Math.floor(j / width)
      output.push(data[idx][(i % height) * width + (j % width)])
    }
  }
  return output
}

export const predict4 = async (
  model,
  inputId,
  outputId,
  width,
  height,
  scale
) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  let canvast1 = document.createElement('canvas')
  canvast1.width = width
  canvast1.height = height
  let canvast2 = document.createElement('canvas')
  canvast2.width = width * scale
  canvast2.height = height * scale

  rgb2ycbcr(canvas, canvast1, width, height)
  canvasResize(canvast1, canvast2, width, height, scale)

  const widthS = (width * scale) / 2 + 6
  const heightS = (height * scale) / 2 + 6

  let canvass1 = document.createElement('canvas')
  canvass1.width = widthS
  canvass1.height = heightS
  let canvass2 = document.createElement('canvas')
  canvass2.width = widthS
  canvass2.height = heightS
  let canvass3 = document.createElement('canvas')
  canvass3.width = widthS
  canvass3.height = heightS
  let canvass4 = document.createElement('canvas')
  canvass4.width = widthS
  canvass4.height = heightS

  canvasSplit4(
    canvast2,
    canvass1,
    canvass2,
    canvass3,
    canvass4,
    width * scale,
    height * scale,
    6
  )

  const dataPredict = []
  dataPredict.push(
    await tf.tidy(() => {
      const tensorInp = tf.fromPixels(canvass1, 1).toFloat()
      const tensorNor = tensorInp.div(tf.scalar(255))
      const tensorBat = tensorNor.reshape([1, widthS, heightS, 1])
      const tensorOut = model.predict(tensorBat, { batchSize: 1 })
      const tensorVal = tensorOut.mul(tf.scalar(255))
      return Array.from(tensorVal.dataSync())
    })
  )
  dataPredict.push(
    await tf.tidy(() => {
      const tensorInp = tf.fromPixels(canvass2, 1).toFloat()
      const tensorNor = tensorInp.div(tf.scalar(255))
      const tensorBat = tensorNor.reshape([1, widthS, heightS, 1])
      const tensorOut = model.predict(tensorBat, { batchSize: 1 })
      const tensorVal = tensorOut.mul(tf.scalar(255))
      return Array.from(tensorVal.dataSync())
    })
  )
  dataPredict.push(
    await tf.tidy(() => {
      const tensorInp = tf.fromPixels(canvass3, 1).toFloat()
      const tensorNor = tensorInp.div(tf.scalar(255))
      const tensorBat = tensorNor.reshape([1, widthS, heightS, 1])
      const tensorOut = model.predict(tensorBat, { batchSize: 1 })
      const tensorVal = tensorOut.mul(tf.scalar(255))
      return Array.from(tensorVal.dataSync())
    })
  )
  dataPredict.push(
    await tf.tidy(() => {
      const tensorInp = tf.fromPixels(canvass4, 1).toFloat()
      const tensorNor = tensorInp.div(tf.scalar(255))
      const tensorBat = tensorNor.reshape([1, widthS, heightS, 1])
      const tensorOut = model.predict(tensorBat, { batchSize: 1 })
      const tensorVal = tensorOut.mul(tf.scalar(255))
      return Array.from(tensorVal.dataSync())
    })
  )
  const widthD = (width * scale) / 2 - 6
  const heightD = (height * scale) / 2 - 6
  const dataOut = perdictMerge(dataPredict, widthD, heightD, 2, 2)

  let canvast3 = document.createElement('canvas')
  canvast3.width = width * scale
  canvast3.height = height * scale

  mergeResult(canvast2, canvast3, dataOut, width * scale, height * scale, 6)
  ycbcr2rgb(canvast3, canvaso, width * scale, height * scale)

  // remove temp canvas
  canvast1.remove()
  canvast2.remove()
  canvast3.remove()
  canvass1.remove()
  canvass2.remove()
  canvass3.remove()
  canvass4.remove()
}
