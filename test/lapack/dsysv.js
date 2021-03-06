/* eslint-env mocha */
const expect = require('expect.js')
const run = require('../util')

run((emlapack) => {
  describe('dsysv("L", n, nrhs, A, lda, ipiv, B, ldb, work, lwork, info)', function () {
    it('solves A x = B where A is a real (lower triangular) symmetric matrix', function () {
      const n = 5
      const nrhs = 3
      const puplo = emlapack._malloc(1)
      const pn = emlapack._malloc(4)
      const pnrhs = emlapack._malloc(4)
      const pa = emlapack._malloc(n * n * 8)
      const plda = emlapack._malloc(4)
      const pipiv = emlapack._malloc(n * 4)
      const pb = emlapack._malloc(n * nrhs * 8)
      const pldb = emlapack._malloc(4)
      const plwork = emlapack._malloc(4)
      const pinfo = emlapack._malloc(4)
      const pworkopt = emlapack._malloc(4)
      const a = new Float64Array(emlapack.HEAPF64.buffer, pa, n * n)
      const b = new Float64Array(emlapack.HEAPF64.buffer, pb, n * nrhs)

      emlapack.setValue(puplo, 'L'.charCodeAt(0), 'i8')
      emlapack.setValue(pn, n, 'i32')
      emlapack.setValue(pnrhs, nrhs, 'i32')
      emlapack.setValue(plda, n, 'i32')
      emlapack.setValue(pldb, n, 'i32')
      emlapack.setValue(plwork, -1, 'i32')

      a.set([-5.86, 3.99, -5.93, -2.82, 7.69, 0, 4.46, 2.58, 4.42, 4.61, 0, 0, -8.52, 8.57, 7.69, 0, 0, 0, 3.72, 8.07, 0, 0, 0, 0, 9.83])
      b.set([1.32, 2.22, 0.12, -6.41, 6.33, -6.33, 1.69, -1.56, -9.49, -3.67, -8.77, -8.33, 9.54, 9.56, 7.48])

      const dsysv = emlapack.cwrap('dsysv_', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
      dsysv(puplo, pn, pnrhs, pa, plda, pipiv, pb, pldb, pworkopt, plwork, pinfo)

      const workopt = emlapack.getValue(pworkopt, 'double')
      const pwork = emlapack._malloc(workopt * 8)
      emlapack.setValue(plwork, workopt, 'i32')

      dsysv(puplo, pn, pnrhs, pa, plda, pipiv, pb, pldb, pwork, plwork, pinfo)

      expect(+b[0].toFixed(2)).to.be(1.17)
      expect(+b[1].toFixed(2)).to.be(-0.71)
      expect(+b[2].toFixed(2)).to.be(-0.63)
      expect(+b[3].toFixed(2)).to.be(-0.33)
      expect(+b[4].toFixed(2)).to.be(0.83)
      expect(+b[5].toFixed(2)).to.be(0.52)
      expect(+b[6].toFixed(2)).to.be(1.05)
      expect(+b[7].toFixed(2)).to.be(-0.52)
      expect(+b[8].toFixed(2)).to.be(0.43)
      expect(+b[9].toFixed(2)).to.be(-1.22)
      expect(+b[10].toFixed(2)).to.be(-0.86)
      expect(+b[11].toFixed(2)).to.be(-4.9)
      expect(+b[12].toFixed(2)).to.be(0.99)
      expect(+b[13].toFixed(2)).to.be(1.22)
      expect(+b[14].toFixed(2)).to.be(1.96)
    })
  })
})
