/**
 * Imports
 */

var hyphenate = require('..')
var test = require('tape')

/**
 * Tests
 */

test('should work', function (t) {
  t.equal(hyphenate('backgroundColor'), 'background-color')
  t.end()
})
