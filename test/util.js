/* eslint-env mocha */
const run = (f, path) => {
  const emlapack = require(path)
  f(emlapack)
}

module.exports = (f) => {
  describe('asmjs', () => {
    run(f, '../asmjs')
  })
  describe('wasm', () => {
    run(f, '../wasm')
  })
}
