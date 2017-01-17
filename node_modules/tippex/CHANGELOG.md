# Tippex changelog

## 2.3.1

* Handle escaped slash at start of regex ([#15](https://github.com/Rich-Harris/tippex/issues/15))

## 2.3.0

* JSX support ([#14](https://github.com/Rich-Harris/tippex/pull/14))

## 2.2.0

* Include `default` among keywords that signal `/` should be treated as start of regex literal ([#1](https://github.com/Rich-Harris/tippex/issues/1))
* More informative error message than 'state is not a function'

## 2.1.2

* Fix crash on double asterisk in closing block comment ([#10](https://github.com/Rich-Harris/tippex/pull/10))

## 2.1.1

* Handle `$` in template literals ([#1](https://github.com/Rich-Harris/tippex/issues/1))
* Fix crash on specific comments ([#8](https://github.com/Rich-Harris/tippex/issues/8))


## 2.1.0

* Handle prefix `++`/`--` operators followed by `/` ([#5](https://github.com/Rich-Harris/tippex/pull/5))

## 2.0.0

* Handle majority (see note in README) of characters that could be either a division operator or the start of a regular expression literal ([#3](https://github.com/Rich-Harris/tippex/pull/3))

## 1.2.0

* Add `tippex.replace` method

## 1.1.0

* Add `tippex.match` method

## 1.0.0

* First release
