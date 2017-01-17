'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ts = require('typescript');
var rollupPluginutils = require('rollup-pluginutils');
var path = require('path');
var fs = require('fs');
var assign = _interopDefault(require('object-assign'));
var compareVersions = _interopDefault(require('compare-versions'));
var tippex = require('tippex');

function endsWith ( str, tail ) {
	return !tail.length || str.slice( -tail.length ) === tail;
}

function getDefaultOptions () {
	return {
		noEmitHelpers: true,
		module: 'es2015',
		sourceMap: true
	};
}

// Gratefully lifted from 'look-up', due to problems using it directly:
//   https://github.com/jonschlinkert/look-up/blob/master/index.js
//   MIT Licenced
function findFile ( cwd, filename ) {
	var fp = cwd ? ( cwd + '/' + filename ) : filename;

	if ( fs.existsSync( fp ) ) {
		return fp;
	}

	var segs = cwd.split( path.sep );
	var len = segs.length;

	while ( len-- ) {
		cwd = segs.slice( 0, len ).join( '/' );
		fp = cwd + '/' + filename;
		if ( fs.existsSync( fp ) ) {
			return fp;
		}
	}

	return null;
}

function compilerOptionsFromTsConfig ( typescript ) {
	var cwd = process.cwd();

	var tsconfig = typescript.readConfigFile( findFile( cwd, 'tsconfig.json' ), function (path) { return fs.readFileSync( path, 'utf8' ); } );

	if ( !tsconfig.config || !tsconfig.config.compilerOptions ) return {};

	return tsconfig.config.compilerOptions;
}

function adjustCompilerOptions ( typescript, options ) {
	// Set `sourceMap` to `inlineSourceMap` if it's a boolean
	// under the assumption that both are never specified simultaneously.
	if ( typeof options.inlineSourceMap === 'boolean' ) {
		options.sourceMap = options.inlineSourceMap;
		delete options.inlineSourceMap;
	}

	// Delete the `declaration` option to prevent compilation error.
	// See: https://github.com/rollup/rollup-plugin-typescript/issues/45
	delete options.declaration;

	var tsVersion = typescript.version.split('-')[0];
	if ( 'strictNullChecks' in options && compareVersions( tsVersion, '1.9.0' ) < 0 ) {
		delete options.strictNullChecks;

		console.warn( "rollup-plugin-typescript: 'strictNullChecks' is not supported; disabling it" );
	}
}

// Hack around TypeScript's broken handling of `export class` with
// ES6 modules and ES5 script target.
//
// It works because TypeScript transforms
//
//     export class A {}
//
// into something like CommonJS, when we wanted ES6 modules.
//
//     var A = (function () {
//         function A() {
//         }
//         return A;
//     }());
//     exports.A = A;
//
// But
//
//     class A {}
//     export { A };
//
// is transformed into this beauty.
//
//     var A = (function () {
//         function A() {
//         }
//         return A;
//     }());
//     export { A };
//
// The solution is to replace the previous export syntax with the latter.
function fix ( code, id ) {

	// Erase comments, strings etc. to avoid erroneous matches for the Regex.
	var cleanCode = getErasedCode( code, id );

	var re = /export\s+(default\s+)?((?:abstract\s+)?class)(?:\s+(\w+))?/g;
	var match;

	while ( match = re.exec( cleanCode ) ) {
		// To keep source maps intact, replace non-whitespace characters with spaces.
		code = erase( code, match.index, match[ 0 ].indexOf( match[ 2 ] ) );

		var name = match[ 3 ];

		if ( match[ 1 ] ) { // it is a default export

			// TODO: support this too
			if ( !name ) throw new Error( ("TypeScript Plugin: cannot export an un-named class (module " + id + ")") );

			// Export the name ` as default`.
			name += ' as default';
		}

		// To keep source maps intact, append the injected exports last.
		code += "\nexport { " + name + " };";
	}

	return code;
}

function getErasedCode ( code, id ) {
	try {
		return tippex.erase( code );
	} catch (e) {
		throw new Error( ("rollup-plugin-typescript: " + (e.message) + "; when processing: '" + id + "'") );
	}
}

function erase ( code, start, length ) {
	var end = start + length;

	return code.slice( 0, start ) +
		code.slice( start, end ).replace( /[^\s]/g, ' ' ) +
		code.slice( end );
}

var resolveHost = {
	directoryExists: function directoryExists ( dirPath ) {
		try {
			return fs.statSync( dirPath ).isDirectory();
		} catch ( err ) {
			return false;
		}
	},
	fileExists: function fileExists ( filePath ) {
		try {
			return fs.statSync( filePath ).isFile();
		} catch ( err ) {
			return false;
		}
	}
};

/*
interface Options {
	tsconfig?: boolean;
	include?: string | string[];
	exclude?: string | string[];
	typescript?: typeof ts;
	module?: string;
}
*/

// The injected id for helpers. Intentially invalid to prevent helpers being included in source maps.
var helpersId = '\0typescript-helpers';
var helpersSource = fs.readFileSync( path.resolve( __dirname, '../src/typescript-helpers.js' ), 'utf-8' );

function typescript ( options ) {
	options = assign( {}, options || {} );

	var filter = rollupPluginutils.createFilter(
		options.include || [ '*.ts+(|x)', '**/*.ts+(|x)' ],
		options.exclude || [ '*.d.ts', '**/*.d.ts' ] );

	delete options.include;
	delete options.exclude;

	// Allow users to override the TypeScript version used for transpilation.
	var typescript = options.typescript || ts;

	delete options.typescript;

	// Load options from `tsconfig.json` unless explicitly asked not to.
	var tsconfig = options.tsconfig === false ? {} :
		compilerOptionsFromTsConfig( typescript );

	delete options.tsconfig;

	// Since the CompilerOptions aren't designed for the Rollup
	// use case, we'll adjust them for use with Rollup.
	adjustCompilerOptions( typescript, tsconfig );
	adjustCompilerOptions( typescript, options );

	// Merge all options.
	options = assign( tsconfig, getDefaultOptions(), options );

	// Verify that we're targeting ES2015 modules.
	if ( options.module !== 'es2015' && options.module !== 'es6' ) {
		throw new Error( ("rollup-plugin-typescript: The module kind should be 'es2015', found: '" + (options.module) + "'") );
	}

	var parsed = typescript.convertCompilerOptionsFromJson( options, process.cwd() );

	if ( parsed.errors.length ) {
		parsed.errors.forEach( function (error) { return console.error( ("rollup-plugin-typescript: " + (error.messageText)) ); } );

		throw new Error( "rollup-plugin-typescript: Couldn't process compiler options" );
	}

	var compilerOptions = parsed.options;

	return {
		resolveId: function resolveId ( importee, importer ) {
			// Handle the special `typescript-helpers` import itself.
			if ( importee === helpersId ) {
				return helpersId;
			}

			if ( !importer ) return null;

			var result;

			importer = importer.split('\\').join('/');

			if ( compareVersions( typescript.version, '1.8.0' ) < 0 ) {
				// Suppress TypeScript warnings for function call.
				result = typescript.nodeModuleNameResolver( importee, importer, resolveHost );
			} else {
				result = typescript.nodeModuleNameResolver( importee, importer, compilerOptions, resolveHost );
			}

			if ( result.resolvedModule && result.resolvedModule.resolvedFileName ) {
				if ( endsWith( result.resolvedModule.resolvedFileName, '.d.ts' ) ) {
					return null;
				}

				return result.resolvedModule.resolvedFileName;
			}

			return null;
		},

		load: function load ( id ) {
			if ( id === helpersId ) {
				return helpersSource;
			}
		},

		transform: function transform ( code, id ) {
			if ( !filter( id ) ) return null;

			var transformed = typescript.transpileModule( fix( code, id ), {
				fileName: id,
				reportDiagnostics: true,
				compilerOptions: compilerOptions
			});

			// All errors except `Cannot compile modules into 'es6' when targeting 'ES5' or lower.`
			var diagnostics = transformed.diagnostics ?
				transformed.diagnostics.filter( function (diagnostic) { return diagnostic.code !== 1204; } ) : [];

			var fatalError = false;

			diagnostics.forEach( function (diagnostic) {
				var message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

				if ( diagnostic.file ) {
					var ref = diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start );
					var line = ref.line;
					var character = ref.character;

					console.error( ((diagnostic.file.fileName) + "(" + (line + 1) + "," + (character + 1) + "): error TS" + (diagnostic.code) + ": " + message) );
				} else {
					console.error( ("Error: " + message) );
				}

				if ( diagnostic.category === ts.DiagnosticCategory.Error ) {
					fatalError = true;
				}
			});

			if ( fatalError ) {
				throw new Error( "There were TypeScript errors transpiling" );
			}

			return {
				// Always append an import for the helpers.
				code: transformed.outputText +
					"\nimport { __assign, __awaiter, __extends, __decorate, __metadata, __param } from '" + helpersId + "';",

				// Rollup expects `map` to be an object so we must parse the string
				map: transformed.sourceMapText ? JSON.parse(transformed.sourceMapText) : null
			};
		}
	};
}

module.exports = typescript;