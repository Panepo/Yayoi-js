import * as tf from '@tensorflow/tfjs'
import * as util from './Srcnn.util'

export const modelPath = './model/model.json'

export const predict = (model, inputId, outputId, width, height, scale) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  const widthO = width * scale
  const heightO = width * scale

  // temp canvas declaration
  let canvast1 = document.createElement('canvas')
  canvast1.width = widthO
  canvast1.height = heightO
  let canvast2 = document.createElement('canvas')
  canvast2.width = widthO
  canvast2.height = heightO
  let canvast3 = document.createElement('canvas')
  canvast3.width = widthO
  canvast3.height = heightO

  util.canvasResize(canvas, canvast1, width, height, scale)
  util.rgb2ycbcr(canvast1, canvast2, widthO, heightO)

  const dataPredict = tf.tidy(() => {
    const tensorInp = tf.fromPixels(canvast2, 1).toFloat()
    const tensorNor = tensorInp.div(tf.scalar(255))
    const tensorBat = tensorNor.reshape([1, widthO, heightO, 1])
    const tensorOut = model.predict(tensorBat, { batchSize: 1 })
    const tensorVal = tensorOut.mul(tf.scalar(255))
    return Array.from(tensorVal.dataSync())
  })

  util.mergeResult(canvast2, canvast3, dataPredict, widthO, heightO, 6)
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

  const widthO = width * scale
  const heightO = height * scale

  let canvast1 = document.createElement('canvas')
  canvast1.width = width
  canvast1.height = height
  let canvast2 = document.createElement('canvas')
  canvast2.width = widthO
  canvast2.height = heightO

  util.rgb2ycbcr(canvas, canvast1, width, height)
  util.canvasResize(canvast1, canvast2, width, height, scale)

  const widthS = Math.floor((widthO - padding * 2) / splitW)
  const heightS = Math.floor((heightO - padding * 2) / splitH)
  let canvasSplit = document.createElement('canvas')
  const ctxSplit = canvasSplit.getContext('2d')

  const dataPredict = []
  for (let i = 0; i < splitH; i += 1) {
    for (let j = 0; j < splitW; j += 1) {
      let sx = widthS * j
      let sy = heightS * i
      let swidth, sheight
      if (i === splitH - 1) {
        sheight = heightO - heightS * i
      } else {
        sheight = heightS + padding * 2
      }
      if (j === splitW - 1) {
        swidth = widthO - widthS * j
      } else {
        swidth = widthS + padding * 2
      }
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
          const tensorBat = tensorNor.reshape([1, swidth, sheight, 1])
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
  canvast3.width = widthO
  canvast3.height = heightO

  util.mergeResult(canvast2, canvast3, dataOut, widthO, heightO, padding)
  util.ycbcr2rgb(canvast3, canvaso, widthO, heightO)

  // remove temp canvas
  canvast1.remove()
  canvast2.remove()
  canvast3.remove()
  canvasSplit.remove()
}
