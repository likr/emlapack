/* eslint-env mocha */
const expect = require('expect.js')
const run = require('../util')

run((emlapack) => {
  describe('daxpy(n, da, dx, incx, dy, incy)', () => {
    it('computes dy := da * dx + dy', () => {
      const pn = emlapack._malloc(4)
      const pda = emlapack._malloc(8)
      const pdx = emlapack._malloc(32)
      const pincx = emlapack._malloc(4)
      const pdy = emlapack._malloc(32)
      const pincy = emlapack._malloc(4)

      const n = new Int32Array(emlapack.HEAP32.buffer, pn, 1)
      const da = new Float64Array(emlapack.HEAPF64.buffer, pda, 2)
      const dx = new Float64Array(emlapack.HEAPF64.buffer, pdx, 4)
      const incx = new Int32Array(emlapack.HEAP32.buffer, pincx, 1)
      const dy = new Float64Array(emlapack.HEAPF64.buffer, pdy, 4)
      const incy = new Int32Array(emlapack.HEAP32.buffer, pincy, 1)

      n[0] = 4
      da[0] = 2.5
      dx.set([1, 2, 3, 4])
      incx[0] = 1
      dy.set([2, 3, 4, 5])
      incy[0] = 1

      const daxpy = emlapack.cwrap('f2c_daxpy', null, ['number', 'number', 'number', 'number', 'number', 'number'])
      daxpy(pn, pda, pdx, pincx, pdy, pincy)

      expect(dy).to.be.eql([4.5, 8, 11.5, 15])
    })
  })
})
