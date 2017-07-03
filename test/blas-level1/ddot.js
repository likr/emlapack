/* eslint-env mocha */
const expect = require('expect.js')
const run = require('../util')

run((emlapack) => {
  describe('ddot(n, dx, incx, dy, incy)', () => {
    it('returns dx^t dy', () => {
      const n = 4
      const pn = emlapack._malloc(4)
      const pdx = emlapack._malloc(n * 8)
      const pincx = emlapack._malloc(4)
      const pdy = emlapack._malloc(n * 8)
      const pincy = emlapack._malloc(4)
      const dx = new Float64Array(emlapack.HEAPF64.buffer, pdx, n)
      const dy = new Float64Array(emlapack.HEAPF64.buffer, pdy, n)

      emlapack.setValue(pn, n, 'i32')
      emlapack.setValue(pincx, 1, 'i32')
      emlapack.setValue(pincy, 1, 'i32')
      dx.set([1, 2, 3, 4])
      dy.set([2, 3, 4, 5])

      const ddot = emlapack.cwrap('f2c_ddot', null, ['number', 'number', 'number', 'number', 'number'])
      expect(ddot(pn, pdx, pincx, pdy, pincy)).to.be(40)
    })
  })
})
