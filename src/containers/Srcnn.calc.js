export const calcSplit = (total, split, padding) => {
  if ((total - padding * 2) % split === 0) {
    return (total - padding * 2) / split
  } else {
    return Math.ceil((total - padding * 2) / split)
  }
}

export const calcSplitStart = (length, idx) => {
  return length * idx
}

export const calcSplitLength = (total, length, split, idx, padding) => {
  if (idx === split - 1) {
    return total - length * idx
  } else {
    return length + padding * 2
  }
}
