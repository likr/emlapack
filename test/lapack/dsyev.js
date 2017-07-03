/* eslint-env mocha */
const expect = require('expect.js')
const run = require('../util')

run((emlapack) => {
  describe('dsyev("N", "U", n, A, lda, w, work, lwork, info)', function () {
    it('computes all eigenvalues of a real (upper triangular) symmetric matrix A', function () {
      const n = 5
      const dsyev = emlapack.cwrap('dsyev_', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
      const pjobz = emlapack._malloc(1)
      const puplo = emlapack._malloc(1)
      const pn = emlapack._malloc(4)
      const pa = emlapack._malloc(n * n * 8)
      const plda = emlapack._malloc(4)
      const pw = emlapack._malloc(n * 8)
      const plwork = emlapack._malloc(4)
      const pinfo = emlapack._malloc(4)
      const pworkopt = emlapack._malloc(4)

      emlapack.setValue(pjobz, 'V'.charCodeAt(0), 'i8')
      emlapack.setValue(puplo, 'U'.charCodeAt(0), 'i8')
      emlapack.setValue(pn, n, 'i32')
      emlapack.setValue(plda, n, 'i32')
      emlapack.setValue(plwork, -1, 'i32')

      const a = new Float64Array(emlapack.HEAPF64.buffer, pa, n * n)
      const w = new Float64Array(emlapack.HEAPF64.buffer, pw, n)
      a.set([1.96, 0, 0, 0, 0, -6.49, 3.8, 0, 0, 0, -0.47, -6.39, 4.17, 0, 0, -7.2, 1.5, -1.51, 5.7, 0, -0.65, -6.34, 2.67, 1.8, -7.1])

      dsyev(pjobz, puplo, pn, pa, plda, pw, pworkopt, plwork, pinfo)

      const workopt = emlapack.getValue(pworkopt, 'double')
      const pwork = emlapack._malloc(workopt * 8)
      emlapack.setValue(plwork, workopt, 'i32')

      dsyev(pjobz, puplo, pn, pa, plda, pw, pwork, plwork, pinfo)

      expect(+w[0].toFixed(2)).to.be(-11.07)
      expect(+w[1].toFixed(2)).to.be(-6.23)
      expect(+w[2].toFixed(2)).to.be(0.86)
      expect(+w[3].toFixed(2)).to.be(8.87)
      expect(+w[4].toFixed(2)).to.be(16.09)
    })
  })
})
