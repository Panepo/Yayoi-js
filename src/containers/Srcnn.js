import * as tf from '@tensorflow/tfjs'
import * as util from './Srcnn.util'
import * as calc from './Srcnn.calc'

export const modelPath = './model/model.json'

export const predict = (
  model,
  inputId,
  outputId,
  width,
  height,
  scale,
  padding
) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  let canvast1 = document.createElement('canvas')
  util.rgb2ycbcr(canvas, canvast1, width, height)

  let canvast2 = document.createElement('canvas')
  util.canvasResize(canvast1, canvast2, width, height, scale)
  const widthO = width * scale
  const heightO = height * scale

  const dataPredict = tf.tidy(() => {
    const tensorInp = tf.fromPixels(canvast2, 1).toFloat()
    const tensorNor = tensorInp.div(tf.scalar(255))
    const tensorBat = tensorNor.reshape([1, heightO, widthO, 1])
    const tensorOut = model.predict(tensorBat, { batchSize: 1 })
    const tensorVal = tensorOut.mul(tf.scalar(255))
    return Array.from(tensorVal.dataSync())
  })

  dataPredict.map(data => {
    if (data > 255) {
      return 255
    } else if (data < 0) {
      return 0
    } else {
      return data
    }
  })

  let canvast3 = document.createElement('canvas')
  util.mergeResult(canvast2, canvast3, dataPredict, widthO, heightO, padding)
  util.ycbcr2rgb(canvast3, canvaso, widthO, heightO)

  // remove temp canvas
  canvast1.remove()
  canvast2.remove()
  canvast3.remove()
}

export const predictSplit = async (
  model,
  inputId,
  outputId,
  width,
  height,
  splitW,
  splitH,
  scale,
  padding
) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  let canvast1 = document.createElement('canvas')
  util.rgb2ycbcr(canvas, canvast1, width, height)

  let canvast2 = document.createElement('canvas')
  util.canvasResize(canvast1, canvast2, width, height, scale)
  const widthO = width * scale
  const heightO = height * scale

  let widthS = calc.calcSplit(widthO, splitW, padding)
  let heightS = calc.calcSplit(heightO, splitH, padding)

  let canvasSplit = document.createElement('canvas')
  const ctxSplit = canvasSplit.getContext('2d')

  const dataPredict = []
  for (let i = 0; i < splitH; i += 1) {
    for (let j = 0; j < splitW; j += 1) {
      let sx = calc.calcSplitStart(widthS, j)
      let sy = calc.calcSplitStart(heightS, i)
      let swidth = calc.calcSplitLength(widthO, widthS, splitW, j, padding)
      let sheight = calc.calcSplitLength(heightO, heightS, splitH, i, padding)

      canvasSplit.width = swidth
      canvasSplit.height = sheight
      ctxSplit.drawImage(
        canvast2,
        sx,
        sy,
        swidth,
        sheight,
        0,
        0,
        swidth,
        sheight
      )
      dataPredict.push(
        await tf.tidy(() => {
          const tensorInp = tf.fromPixels(canvasSplit, 1).toFloat()
          const tensorNor = tensorInp.div(tf.scalar(255))
          const tensorBat = tensorNor.reshape([1, sheight, swidth, 1])
          const tensorOut = model.predict(tensorBat, { batchSize: 1 })
          const tensorVal = tensorOut.mul(tf.scalar(255))
          return Array.from(tensorVal.dataSync())
        })
      )
    }
  }
  const dataOut = util.predictMerge(
    dataPredict,
    widthO - padding * 2,
    heightO - padding * 2,
    widthS,
    heightS,
    splitW
  )

  let canvast3 = document.createElement('canvas')
  util.mergeResult(canvast2, canvast3, dataOut, widthO, heightO, padding)
  util.ycbcr2rgb(canvast3, canvaso, widthO, heightO)

  // remove temp canvas
  canvast1.remove()
  canvast2.remove()
  canvast3.remove()
  canvasSplit.remove()
}
