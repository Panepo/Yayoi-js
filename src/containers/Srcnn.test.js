import * as util from './Srcnn.util'
import * as calc from './Srcnn.calc'

it('calcSplit', () => {
  expect(calc.calcSplit(200, 2, 6)).toEqual(94)

  expect(calc.calcSplit(296, 3, 6)).toEqual(95)
  expect(calc.calcSplit(297, 3, 6)).toEqual(95)
  expect(calc.calcSplit(298, 3, 6)).toEqual(96)
  expect(calc.calcSplit(299, 3, 6)).toEqual(96)
  expect(calc.calcSplit(300, 3, 6)).toEqual(96)

  expect(calc.calcSplit(400, 4, 6)).toEqual(97)
})

it('calcSplitStart', () => {
  expect(calc.calcSplitStart(94, 1)).toEqual(94)

  expect(calc.calcSplitStart(96, 1)).toEqual(96)
  expect(calc.calcSplitStart(96, 2)).toEqual(192)

  expect(calc.calcSplitStart(97, 1)).toEqual(97)
  expect(calc.calcSplitStart(97, 2)).toEqual(194)
  expect(calc.calcSplitStart(97, 3)).toEqual(291)
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
})
