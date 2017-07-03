/* eslint-env mocha */
const expect = require('expect.js')
const run = require('../util')

run((emlapack) => {
  describe('dgemv("N", m, n, alpha, A, lda, x, incx, beta, y, incy)', function () {
    it('computes y := alpha*A*x + beta*y', function () {
      const m = 3
      const n = 2
      const ptrans = emlapack._malloc(1)
      const pm = emlapack._malloc(4)
      const pn = emlapack._malloc(4)
      const palpha = emlapack._malloc(8)
      const pA = emlapack._malloc(n * m * 8)
      const plda = emlapack._malloc(4)
      const px = emlapack._malloc(n * 8)
      const pincx = emlapack._malloc(4)
      const pbeta = emlapack._malloc(8)
      const py = emlapack._malloc(m * 8)
      const pincy = emlapack._malloc(4)
      const A = new Float64Array(emlapack.HEAPF64.buffer, pA, n * m)
      const x = new Float64Array(emlapack.HEAPF64.buffer, px, n)
      const y = new Float64Array(emlapack.HEAPF64.buffer, py, m)

      emlapack.setValue(ptrans, 'N'.charCodeAt(0), 'i8')
      emlapack.setValue(pm, m, 'i32')
      emlapack.setValue(pn, n, 'i32')
      emlapack.setValue(palpha, 2, 'double')
      emlapack.setValue(pbeta, 3, 'double')
      emlapack.setValue(plda, m, 'i32')
      emlapack.setValue(pincx, 1, 'i32')
      emlapack.setValue(pincy, 1, 'i32')

      A.set([1, 2, 3, 1, 2, 3])
      x.set([1, 2])
      y.set([1, 1, 1])

      const dgemv = emlapack.cwrap('f2c_dgemv', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
      dgemv(ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy)

      expect(y).to.be.eql([9, 15, 21])
    })
  })
})
