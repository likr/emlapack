var expect = require('expect.js');
var linalg = require('../../linalg');

describe('dgemm(transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc)', function () {
  it('computes c := alpha * a * b + beta * c', function () {
    var ptransa = linalg._malloc(1),
        ptransb = linalg._malloc(1),
        pm = linalg._malloc(4),
        pn = linalg._malloc(4),
        pk = linalg._malloc(4),
        palpha = linalg._malloc(8),
        pa = linalg._malloc(128),
        plda = linalg._malloc(4),
        pb = linalg._malloc(128),
        pldb = linalg._malloc(4),
        pbeta = linalg._malloc(8),
        pc = linalg._malloc(128),
        pldc = linalg._malloc(4);

    linalg.setValue(ptransa, 'N'.charCodeAt(0), 'i8');
    linalg.setValue(ptransb, 'N'.charCodeAt(0), 'i8');
    linalg.setValue(pm, 4, 'i32');
    linalg.setValue(pn, 4, 'i32');
    linalg.setValue(pk, 4, 'i32');
    linalg.setValue(palpha, 1.5, 'double');
    linalg.setValue(plda, 4, 'i32');
    linalg.setValue(pldb, 4, 'i32');
    linalg.setValue(pbeta, 2.5, 'double');
    linalg.setValue(pldc, 4, 'i32');

    var a = new Float64Array(linalg.HEAPF64.buffer, pa, 16);
    var b = new Float64Array(linalg.HEAPF64.buffer, pb, 16);
    var c = new Float64Array(linalg.HEAPF64.buffer, pc, 16);
    a.set([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    b.set([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    c.set([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

    var dgemm = linalg.cwrap('f2c_dgemm', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    dgemm(ptransa, ptransb, pm, pn, pk, palpha, pa, plda, pb, pldb, pbeta, pc, pldc);

    expect(c).to.be.eql([8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5]);
  });
});
