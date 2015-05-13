var expect = require('expect.js'),
    linalg = require('../../linalg');

describe('dsyev("N", "U", n, A, lda, w, work, lwork, info)', function () {
  it('computes all eigenvalues of a real (upper triangular) symmetric matrix A', function () {
    var n = 5,
        dsyev = linalg.cwrap('dsyev_', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']),
        pjobz = linalg._malloc(1),
        puplo = linalg._malloc(1),
        pn = linalg._malloc(4),
        pa = linalg._malloc(n * n * 8),
        plda = linalg._malloc(4),
        pw = linalg._malloc(n * 8),
        plwork = linalg._malloc(4),
        pinfo = linalg._malloc(4),
        pworkopt = linalg._malloc(4);

    linalg.setValue(pjobz, 'V'.charCodeAt(0), 'i8');
    linalg.setValue(puplo, 'U'.charCodeAt(0), 'i8');
    linalg.setValue(pn, n, 'i32');
    linalg.setValue(plda, n, 'i32');
    linalg.setValue(plwork, -1, 'i32');

    var a = new Float64Array(linalg.HEAPF64.buffer, pa, n * n);
    var w = new Float64Array(linalg.HEAPF64.buffer, pw, n);
    a.set([1.96, 0, 0, 0, 0, -6.49, 3.8, 0, 0, 0, -0.47, -6.39, 4.17, 0, 0, -7.2, 1.5, -1.51, 5.7, 0, -0.65, -6.34, 2.67, 1.8, -7.1]);

    dsyev(pjobz, puplo, pn, pa, plda, pw, pworkopt, plwork, pinfo);

    var workopt = linalg.getValue(pworkopt, 'double'),
        pwork = linalg._malloc(workopt * 8);
    linalg.setValue(plwork, workopt, 'i32');

    dsyev(pjobz, puplo, pn, pa, plda, pw, pwork, plwork, pinfo);

    expect(+w[0].toFixed(2)).to.be(-11.07);
    expect(+w[1].toFixed(2)).to.be(-6.23);
    expect(+w[2].toFixed(2)).to.be(0.86);
    expect(+w[3].toFixed(2)).to.be(8.87);
    expect(+w[4].toFixed(2)).to.be(16.09);
  });
});
