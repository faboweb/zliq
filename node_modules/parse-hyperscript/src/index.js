
const parseSelector = require('./selector')

module.exports = parse

function parse (args) {
  let children = []
  let attrs = {}
  let node

  for (var i = args.length - 1; i >= 0; i--) {
    const arg = args[i]

    if (i === 0) {
      node = arg
    } else if (Array.isArray(arg)) {
      children = arg
    } else if (isObj(arg)) {
      attrs = arg
    } else {
      children = [arg]
    }
  }

  // is it a default tag or a custom element like a react class or a
  // functional component?
  if (isString(node)) {
    let selector = parseSelector(node)
    selector.id && (attrs.id = selector.id)

    if (selector.classes !== '') {
      if (attrs.class) {
        attrs.class = `${attrs.class} ${selector.classes}`
      } else {
        attrs.class = selector.classes
      }
    }

    return { node: selector.tag, attrs, children }
  } else {
    return { node, attrs, children }
  }
}

function isString (val) { return typeof val === 'string' }
function isObj (val) { return typeof val === 'object' }
