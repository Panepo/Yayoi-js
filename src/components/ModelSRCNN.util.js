export function checkHW(width, height, maxWidth, maxHeight) {
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
