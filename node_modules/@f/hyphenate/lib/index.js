/**
 * Expose hyphenate
 */

module.exports = hyphenate

/**
 * Constants
 */

var upperCasePattern = /([A-Z])/g

/**
 * hyphenate
 */

function hyphenate (str) {
  return str.replace(upperCasePattern, dashLower)
}

function dashLower (c) {
  return '-' + c.toLowerCase()
}
