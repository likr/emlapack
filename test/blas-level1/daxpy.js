var expect = require('expect.js');
var linalg = require('../../linalg');

describe('daxpy(n, da, dx, incx, dy, incy)', function () {
  it('computes dy := da * dx + dy', function () {
    var pn = linalg._malloc(4);
    var pda = linalg._malloc(8);
    var pdx = linalg._malloc(32);
    var pincx = linalg._malloc(4);
    var pdy = linalg._malloc(32);
    var pincy = linalg._malloc(4);

    var n = new Int32Array(linalg.HEAP32.buffer, pn, 1);
    var da = new Float64Array(linalg.HEAPF64.buffer, pda, 2);
    var dx = new Float64Array(linalg.HEAPF64.buffer, pdx, 4);
    var incx = new Int32Array(linalg.HEAP32.buffer, pincx, 1);
    var dy = new Float64Array(linalg.HEAPF64.buffer, pdy, 4);
    var incy = new Int32Array(linalg.HEAP32.buffer, pincy, 1);

    n[0] = 4;
    da[0] = 2.5;
    dx.set([1, 2, 3, 4]);
    incx[0] = 1;
    dy.set([2, 3, 4, 5]);
    incy[0] = 1;

    var daxpy = linalg.cwrap('daxpy_', 'hoge', ['number', 'number', 'number', 'number', 'number', 'number']);
    daxpy(pn, pda, pdx, pincx, pdy, pincy);

    expect(dy).to.be.eql(new Float64Array([4.5, 8, 11.5, 15]));
  });
});
