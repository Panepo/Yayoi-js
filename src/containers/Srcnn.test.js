import * as util from './Srcnn.util'
import * as calc from './Srcnn.calc'

it('check split status', () => {
  let total = 300
  let split = 3
  let padding = 6

  expect(calc.calcSplit(total, split, padding)).toEqual(96)
  let length = calc.calcSplit(total, split, padding)

  expect(calc.calcSplitStart(length, 0)).toEqual(0)
  expect(calc.calcSplitStart(length, 1)).toEqual(96)
  expect(calc.calcSplitStart(length, 2)).toEqual(192)

  expect(calc.calcSplitLength(total, length, split, 0, padding)).toEqual(108)
  expect(calc.calcSplitLength(total, length, split, 1, padding)).toEqual(108)
  expect(calc.calcSplitLength(total, length, split, 2, padding)).toEqual(108)
})

it('calcSplit', () => {
  expect(calc.calcSplit(200, 2, 6)).toEqual(94)

  expect(calc.calcSplit(296, 3, 6)).toEqual(95)
  expect(calc.calcSplit(297, 3, 6)).toEqual(95)
  expect(calc.calcSplit(298, 3, 6)).toEqual(96)
  expect(calc.calcSplit(299, 3, 6)).toEqual(96)
  expect(calc.calcSplit(300, 3, 6)).toEqual(96)

  expect(calc.calcSplit(400, 4, 6)).toEqual(97)

  expect(calc.calcSplit(250, 4, 6)).toEqual(60)
})

it('calcSplitStart', () => {
  expect(calc.calcSplitStart(94, 1)).toEqual(94)

  expect(calc.calcSplitStart(96, 1)).toEqual(96)
  expect(calc.calcSplitStart(96, 2)).toEqual(192)

  expect(calc.calcSplitStart(97, 1)).toEqual(97)
  expect(calc.calcSplitStart(97, 2)).toEqual(194)
  expect(calc.calcSplitStart(97, 3)).toEqual(291)

  expect(calc.calcSplitStart(60, 1)).toEqual(60)
  expect(calc.calcSplitStart(60, 2)).toEqual(120)
  expect(calc.calcSplitStart(60, 3)).toEqual(180)
})

it('calcSplitLength', () => {
  expect(calc.calcSplitLength(300, 96, 3, 0, 6)).toEqual(108)
  expect(calc.calcSplitLength(300, 96, 3, 1, 6)).toEqual(108)
  expect(calc.calcSplitLength(300, 96, 3, 2, 6)).toEqual(108)

  expect(calc.calcSplitLength(299, 96, 3, 0, 6)).toEqual(108)
  expect(calc.calcSplitLength(299, 96, 3, 1, 6)).toEqual(108)
  expect(calc.calcSplitLength(299, 96, 3, 2, 6)).toEqual(107)

  expect(calc.calcSplitLength(298, 96, 3, 0, 6)).toEqual(108)
  expect(calc.calcSplitLength(298, 96, 3, 1, 6)).toEqual(108)
  expect(calc.calcSplitLength(298, 96, 3, 2, 6)).toEqual(106)

  expect(calc.calcSplitLength(250, 60, 4, 0, 6)).toEqual(72)
  expect(calc.calcSplitLength(250, 60, 4, 1, 6)).toEqual(72)
  expect(calc.calcSplitLength(250, 60, 4, 2, 6)).toEqual(72)
  expect(calc.calcSplitLength(250, 60, 4, 3, 6)).toEqual(70)
})
