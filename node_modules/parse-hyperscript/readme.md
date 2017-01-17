
# parse-hyperscript

> Parse hyperscript-like syntax for creating dom or virtual-dom elements.

This layer exists to build a hyperscript-like DSL for any kind of dom/virtual-dom creation library.

[![Build status][travis-image]][travis-url]
[![NPM version][version-image]][version-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Js Standard Style][standard-image]][standard-url]

## Installation

```
> npm install parse-hyperscript
```

## Example

```js
const parse = require('parse-hyperscript')

const node = ['p.some-class', {
  id: 'test',
  style: 'background-color: red;'
}, 'text node']

const ast = parse(node)
console.log(ast)
```

Returns:

```js
{
  tag: 'p',
  attrs: {
    id: 'test',
   class: 'some-class',
   style: 'background-color: red;'
  },
  children: ['text-node']
}
```

### Creating react nodes

The following is an example implementation with *React* to demonstrate how you might integrate it with your view library:

```js
const { createElement } = require('react')

function h () {
  const { tag, attrs, children } = parse(arguments)
  return createElement(
    tag,
    renameKey('class', 'className', attrs),
    ...children
  )
}

const node = h('div.test', { id: 'some-id'}, 'Hello World!')
// -> ReactElement
```

## Implementations

* [preact-hyperscript](https://github.com/queckezz/preact-hyperscript) - For [Preact](https://github.com/developit/preact)
* [create-dom-tree](https://github.com/queckezz/create-dom-tree) - For the raw DOM

> :heart: _Built one of your own?
> [Add it!](https://github.com/queckezz/parse-hyperscript/edit/master/readme.md)_

## Tests

```bash
npm test
```

## License

[MIT][license-url]

[travis-image]: https://img.shields.io/travis/queckezz/parse-hyperscript.svg?style=flat-square
[travis-url]: https://travis-ci.org/queckezz/parse-hyperscript

[version-image]: https://img.shields.io/npm/v/parse-hyperscript.svg?style=flat-square
[version-url]: https://npmjs.org/package/parse-hyperscript

[david-image]: http://img.shields.io/david/queckezz/parse-hyperscript.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/parse-hyperscript

[standard-image]: https://img.shields.io/badge/code-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard

[license-image]: http://img.shields.io/npm/l/parse-hyperscript.svg?style=flat-square
[license-url]: ./license