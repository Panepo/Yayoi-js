export const rgb2ycbcr = (canvasi, canvaso, width, height) => {
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

export const ycbcr2rgb = (canvasi, canvaso, width, height) => {
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

export const canvasResize = (canvasi, canvaso, width, height, scale) => {
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

export const mergeResult = (canvasi, canvaso, data, width, height, padding) => {
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

export const predictMerge = (data, width, height, swidth, sheight, splitW) => {
  let output = []
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      let idx = splitW * Math.floor(i / sheight) + Math.floor(j / swidth)
      output.push(data[idx][(i % sheight) * swidth + (j % swidth)])
    }
  }
  return output
}
