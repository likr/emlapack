var expect = require('expect.js');
var linalg = require('../../linalg');

describe('dgemm(transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc)', function () {
  it('computes c := alpha * a * b + beta * c', function () {
    var ptransa = linalg._malloc(2),
        ptransb = linalg._malloc(2),
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

    linalg.writeStringToMemory('N', ptransa);
    linalg.writeStringToMemory('N', ptransb);
    linalg.writeArrayToMemory([4], pm);
    linalg.writeArrayToMemory([4], pn);
    linalg.writeArrayToMemory([4], pk);
    linalg.writeArrayToMemory([1.5], palpha);
    linalg.writeArrayToMemory([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], pa);
    linalg.writeArrayToMemory([4], plda);
    linalg.writeArrayToMemory([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], pb);
    linalg.writeArrayToMemory([4], pldb);
    linalg.writeArrayToMemory([2.5], pbeta);
    linalg.writeArrayToMemory([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], pc);
    linalg.writeArrayToMemory([4], pldc);

    var dgemm = linalg.cwrap('dgemm_', null, ['string', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    dgemm(ptransa, ptransb, pm, pn, pk, palpha, pa, plda, pb, pldb, pbeta, pc, pldc);

    expect(new Float64Array(linalg.HEAPF64, pc, 16)).to.be.eql(new Float64Array([4.5, 8, 11.5, 15]));
  });
});
