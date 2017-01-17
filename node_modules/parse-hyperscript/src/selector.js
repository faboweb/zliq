
module.exports = parseSelector

const re = /([\.#]?[^\s#.]+)/

function parseSelector (selector) {
  const matches = selector.split(re)
  let classes = ''
  let id = null
  let tag = null

  // we know it's only a tag -> ['', TAG, ''].length === 3
  if (matches.length === 3) return { tag: selector, classes }

  matches.forEach((match, i) => {
    const s = match.substring(1, match.length)
    if (!match) return

    if (match[0] === '.') {
      classes += s + ' '
    } else if (match[0] === '#') {
      id = s
    } else {
      tag = match
    }
  })

  return { classes: classes.trim(), id, tag }
}
