
# hyphenate

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Turn a camel-case string into a hyphenated string

## Installation

    $ npm install @f/hyphenate

## Usage

```js
var hyphenate = require('@f/hyphenate')

hyphenate('backgroundColor') === 'background-color'
```

## API

### hyphenate(str)

- `str` - The string you want to hyphenate

**Returns:** `str`, lowercased and hyphenated

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/hyphenate.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/hyphenate
[git-image]: https://img.shields.io/github/tag/micro-js/hyphenate.svg
[git-url]: https://github.com/micro-js/hyphenate
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/hyphenate.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/hyphenate
