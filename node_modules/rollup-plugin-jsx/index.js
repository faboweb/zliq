var jsx = require('jsx-transform')
var MagicString = require( 'magic-string' )
var createFilter = require('rollup-pluginutils').createFilter

module.exports = function(options){
  options = options || {}
  var filter = createFilter( options.include, options.exclude )
  return {
    transform: function sourceToCode(code, id){
      if ( !filter( id ) ) return null

      var s = new MagicString( code )
      var out = jsx.fromString(code, options)
      s.overwrite( 0, code.length, out.toString() )

      return  {
        code: s.toString(),
        map: s.generateMap({ hires: true })
      }
    }
  }
}
