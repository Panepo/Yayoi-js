export class YayoiImage {
  constructor(width, height, buffer) {
    this.width = width
    this.height = height
    this.buffer = new Uint8ClampedArray(width * height)
    if (buffer == null) {
      return
    }
    if (buffer.length !== width * height) {
      throw new Error('Illegal buffer length')
    }
    this.buffer.set(buffer)
  }

  static channelDecompose(image, width, height) {
    let imageR = new YayoiImage(width, height)
    let imageG = new YayoiImage(width, height)
    let imageB = new YayoiImage(width, height)
    let imageA = new YayoiImage(width, height)
    for (let w = 0; w < width; w++) {
      for (let h = 0; h < height; h++) {
        let index = w + h * width
        imageR.buffer[index] = image[w * 4 + h * width * 4]
        imageG.buffer[index] = image[w * 4 + h * width * 4 + 1]
        imageB.buffer[index] = image[w * 4 + h * width * 4 + 2]
        imageA.buffer[index] = image[w * 4 + h * width * 4 + 3]
      }
    }
    return [imageR, imageG, imageB, imageA]
  }

  static channelCompose(imageR, imageG, imageB, imageA) {
    let width = imageR.width
    let height = imageR.height
    let image = new Uint8ClampedArray(width * height * 4)
    for (let i = 0; i < width * height; i++) {
      image[i * 4] = imageR.buffer[i]
      image[i * 4 + 1] = imageG.buffer[i]
      image[i * 4 + 2] = imageB.buffer[i]
      image[i * 4 + 3] = 255
    }
    return image
  }

  resize(scale) {
    let width = this.width
    let height = this.height
    let scaledWidth = Math.round(width * scale)
    let scaledHeight = Math.round(height * scale)
    let scaledImage = new YayoiImage(scaledWidth, scaledHeight)
    for (let w = 0; w < scaledWidth; w++) {
      for (let h = 0; h < scaledHeight; h++) {
        let scaled_index = w + h * scaledWidth
        let w_original = Math.round((w + 1) / scale) - 1
        let h_original = Math.round((h + 1) / scale) - 1
        let index_original = w_original + h_original * width
        scaledImage.buffer[scaled_index] = this.buffer[index_original]
      }
    }
    return scaledImage
  }
}
