
const bench = require('fastbench')
const parse = require('../src')

const run = bench([basic, selector], Math.pow(10, 5))

function basic (done) {
  parse(['p', { id: 'id', class: 'pad red' }, 'Hello!'])
  process.nextTick(done)
}

function selector (done) {
  parse(['p.test#id', 'Hello!'])
  process.nextTick(done)
}

run()
