
const { createElement, createClass } = require('react')
const { renderToString } = require('react-dom/server')
const test = require('tape')
const parse = require('../src')

test('parse selector', (t) => {
  const obj = parse(['span#some-id.bold.italic'])

  t.equal(obj.node, 'span', 'parses the node name')
  t.equal(obj.attrs.id, 'some-id', 'parses an id')
  t.equal(obj.attrs.class, 'bold italic', 'parses class names')
  t.equal(obj.children.length, 0, 'no children')
  t.end()
})

test('parse selector class with attributes', (t) => {
  const obj = parse(['p.italic', { class: 'bold' }])
  t.equal(obj.attrs.class, 'bold italic')
  t.end()
})

test('children', (t) => {
  t.equal(
    parse(['p', 'text node']).children[0],
    'text node',
    'parses a string as children'
  )

  t.deepEqual(
    parse(['p', [
      { node: 'div' }
    ]]).children[0],
    { node: 'div' },
    'parses array contents as children'
  )

  t.end()
})

test('attributes', (t) => {
  t.equal(
    parse(['p', { id: 'test' }]).attrs.id,
    'test',
    'one attribute'
  )

  t.deepEqual(
    Object.keys(
      parse(['p', { id: 'test', style: 'background-color: red;' }]).attrs
    ),
    ['id', 'style'],
    'multiple attributes'
  )

  t.end()
})

test('different nodes than default tags', (t) => {
  const functionalComponent = (props) => null

  const component = createClass({
    render: () => createElement('p', null, 'Hello')
  })

  t.equal(
    typeof parse([functionalComponent]).node,
    'function',
    'should be a functional component'
  )

  t.true(
    parse([component]).node.prototype.isReactComponent !== null,
    'should be a react component'
  )

  t.end()
})

test('react', (t) => {
  function h () {
    const { node, attrs, children } = parse(arguments)
    return createElement(
      node,
      renameKey('class', 'className', attrs),
      ...children
    )
  }

  const node = h('div.test', { id: 'some-id' }, 'Hello World!')
  t.true(contains(renderToString(node), 'div'), 'renders the right node')
  t.true(contains(renderToString(node), 'class="test"'), 'contains class')
  t.true(contains(renderToString(node), 'id="some-id"'), 'contains props')
  t.true(contains(renderToString(node), 'Hello World!'), 'contains children')
  t.end()
})

function contains (str, search) {
  return str.indexOf(search) >= 0
}

function renameKey (oldName, newName, _obj) {
  const obj = Object.assign({}, _obj)
  obj[newName] = obj[oldName]
  delete obj[oldName]
  return obj
}
