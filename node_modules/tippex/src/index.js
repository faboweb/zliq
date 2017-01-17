import getLocation from './getLocation.js';

const keywords = /(case|default|delete|do|else|in|instanceof|new|return|throw|typeof|void)\s*$/;
const punctuators = /(^|\{|\(|\[\.|;|,|<|>|<=|>=|==|!=|===|!==|\+|-|\*\%|<<|>>|>>>|&|\||\^|!|~|&&|\|\||\?|:|=|\+=|-=|\*=|%=|<<=|>>=|>>>=|&=|\|=|\^=|\/=|\/)\s*$/;
const ambiguous = /(\}|\)|\+\+|--)\s*$/;
const beforeJsx = /^$|[=:;,\(\{\}\[|&+]\s*$/;

export function find ( str ) {
	let quote;
	let escapedFrom;
	let regexEnabled = true;
	let pfixOp = false;
	let jsxTagDepth = 0;
	let stack = [];

	let start;
	let found = [];
	let state = base;

	function base ( char, i ) {
		if ( char === '/' ) {
			// could be start of regex literal OR division punctuator. Solution via
			// http://stackoverflow.com/questions/5519596/when-parsing-javascript-what-determines-the-meaning-of-a-slash/27120110#27120110
			const substr = str.substr( 0, i );
			if ( keywords.test( substr ) || punctuators.test( substr ) ) regexEnabled = true;
			else if ( ambiguous.test( substr ) && !tokenClosesExpression( substr, found ) ) regexEnabled = true; // TODO save this determination for when it's necessary?
			else regexEnabled = false;

			return start = i, slash;
		}

		if ( char === '"' || char === "'" ) return start = i, quote = char, stack.push( base ), string;
		if ( char === '`' ) return start = i, templateString;

		if ( char === '{' ) return stack.push( base ), base;
		if ( char === '}' ) return start = i, stack.pop();

		if ( !( pfixOp && /\W/.test( char ) ) ) {
			pfixOp = ( char === '+' && str[ i - 1 ] === '+' ) || ( char === '-' && str[ i - 1 ] === '-' );
		}

		if ( char === '<' ) {
			let substr = str.substr( 0, i );
			substr = _erase( substr, found ).trim();
			if ( beforeJsx.test( substr ) ) return stack.push( base ), jsxTagStart;
		}

		return base;
	}

	function slash ( char ) {
		if ( char === '/' ) return lineComment;
		if ( char === '*' ) return blockComment;
		if ( char === '[' ) return regexEnabled ? regexCharacter : base;
		if ( char === '\\' ) return escapedFrom = regex, escaped;
		return regexEnabled && !pfixOp ? regex : base;
	}

	function regex ( char, i ) {
		if ( char === '[' ) return regexCharacter;
		if ( char === '\\' ) return escapedFrom = regex, escaped;

		if ( char === '/' ) {
			const end = i + 1;
			const outer = str.slice( start, end );
			const inner = outer.slice( 1, -1 );

			found.push({ start, end, inner, outer, type: 'regex' });

			return base;
		}

		return regex;
	}

	function regexCharacter ( char ) {
		if ( char === ']' ) return regex;
		if ( char === '\\' ) return escapedFrom = regexCharacter, escaped;
		return regexCharacter;
	}

	function string ( char, i ) {
		if ( char === '\\' ) return escapedFrom = string, escaped;
		if ( char === quote ) {
			const end = i + 1;
			const outer = str.slice( start, end );
			const inner = outer.slice( 1, -1 );

			found.push({ start, end, inner, outer, type: 'string' });

			return stack.pop();
		}

		return string;
	}

	function escaped () {
		return escapedFrom;
	}

	function templateString ( char, i ) {
		if ( char === '$' ) return templateStringDollar;
		if ( char === '\\' ) return escapedFrom = templateString, escaped;

		if ( char === '`' ) {
			const end = i + 1;
			const outer = str.slice( start, end );
			const inner = outer.slice( 1, -1 );

			found.push({ start, end, inner, outer, type: 'templateEnd' });

			return base;
		}

		return templateString;
	}

	function templateStringDollar ( char, i ) {
		if ( char === '{' ) {
			const end = i + 1;
			const outer = str.slice( start, end );
			const inner = outer.slice( 1, -2 );

			found.push({ start, end, inner, outer, type: 'templateChunk' });

			stack.push( templateString );
			return base;
		}
		return templateString( char, i );
	}

	// JSX is an XML-like extension to ECMAScript
	// https://facebook.github.io/jsx/

	function jsxTagStart ( char ) {
		if ( char === '/' ) return jsxTagDepth--, jsxTag;
		return jsxTagDepth++, jsxTag;
	}

	function jsxTag ( char, i ) {
		if ( char === '"' || char === "'" ) return start = i, quote = char, stack.push( jsxTag ), string;
		if ( char === '{' ) return stack.push( jsxTag ), base;
		if ( char === '>' ) {
			if ( jsxTagDepth <= 0 ) return base;
			return jsx;
		}
		if ( char === '/' ) return jsxTagSelfClosing;

		return jsxTag;
	}

	function jsxTagSelfClosing ( char ) {
		if ( char === '>' ) {
			jsxTagDepth--;
			if ( jsxTagDepth <= 0 ) return base;
			return jsx;
		}

		return jsxTag;
	}

	function jsx ( char ) {
		if ( char === '{' ) return stack.push( jsx ), base;
		if ( char === '<' ) return jsxTagStart;

		return jsx;
	}

	function lineComment ( char, end ) {
		if ( char === '\n' ) {
			const outer = str.slice( start, end );
			const inner = outer.slice( 2 );

			found.push({ start, end, inner, outer, type: 'line' });

			return base;
		}

		return lineComment;
	}

	function blockComment ( char ) {
		if ( char === '*' ) return blockCommentEnding;
		return blockComment;
	}

	function blockCommentEnding ( char, i ) {
		if ( char === '/' ) {
			const end = i + 1;
			const outer = str.slice( start, end );
			const inner = outer.slice( 2, -2 );

			found.push({ start, end, inner, outer, type: 'block' });

			return base;
		}

		return blockComment( char );
	}

	for ( let i = 0; i < str.length; i += 1 ) {
		if ( !state ) {
			const { line, column } = getLocation( str, i );
			const before = str.slice( 0, i );
			const beforeLine = /(^|\n).+$/.exec( before )[0];
			const after = str.slice( i );
			const afterLine = /.+(\n|$)/.exec( after )[0];

			const snippet = `${beforeLine}${afterLine}\n${ Array( beforeLine.length + 1 ).join( ' ' )}^`;

			throw new Error( `Unexpected character (${line}:${column}). If this is valid JavaScript, it's probably a bug in tippex. Please raise an issue at https://github.com/Rich-Harris/tippex/issues – thanks!\n\n${snippet}` );
		}

		state = state( str[i], i );
	}

	return found;
}

function tokenClosesExpression ( substr, found ) {
	substr = _erase( substr, found );

	let token = ambiguous.exec( substr );
	if ( token ) token = token[1];

	if ( token === ')' ) {
		let count = 0;
		let i = substr.length;
		while ( i-- ) {
			if ( substr[i] === ')' ) {
				count += 1;
			}

			if ( substr[i] === '(' ) {
				count -= 1;
				if ( count === 0 ) {
					i -= 1;
					break;
				}
			}
		}

		// if parenthesized expression is immediately preceded by `if`/`while`, it's not closing an expression
		while ( /\s/.test( substr[i - 1] ) ) i -= 1;
		if ( substr.slice( i - 2, i ) === 'if' || substr.slice( i - 5, i ) === 'while' ) return false;
	}

	// TODO handle }, ++ and -- tokens immediately followed by / character
	return true;
}

function spaces ( count ) {
	let spaces = '';
	while ( count-- ) spaces += ' ';
	return spaces;
}

const erasers = {
	string: chunk => chunk.outer[0] + spaces( chunk.inner.length ) + chunk.outer[0],
	line: chunk => spaces( chunk.outer.length ),
	block: chunk => chunk.outer.split( '\n' ).map( line => spaces( line.length ) ).join( '\n' ),
	regex: chunk => '/' + spaces( chunk.inner.length ) + '/',
	templateChunk: chunk => chunk.outer[0] + spaces( chunk.inner.length ) + '${',
	templateEnd: chunk => chunk.outer[0] + spaces( chunk.inner.length ) + '`'
};

export function erase ( str ) {
	const found = find( str );
	return _erase( str, found );
}

function _erase ( str, found ) {
	let erased = '';
	let charIndex = 0;

	for ( let i = 0; i < found.length; i += 1 ) {
		const chunk = found[i];
		erased += str.slice( charIndex, chunk.start );
		erased += erasers[ chunk.type ]( chunk );

		charIndex = chunk.end;
	}

	erased += str.slice( charIndex );
	return erased;
}

function makeGlobalRegExp ( original ) {
	let flags = 'g';

	if ( original.multiline ) flags += 'm';
	if ( original.ignoreCase ) flags += 'i';
	if ( original.sticky ) flags += 'y';
	if ( original.unicode ) flags += 'u';

	return new RegExp( original.source, flags );
}

export function match ( str, pattern, callback ) {
	const g = pattern.global;
	if ( !g ) pattern = makeGlobalRegExp( pattern );

	const found = find( str );

	let match;
	let chunkIndex = 0;

	while ( match = pattern.exec( str ) ) {
		let chunk;

		do {
			chunk = found[ chunkIndex ];

			if ( chunk && chunk.end < match.index ) {
				chunkIndex += 1;
			} else {
				break;
			}
		} while ( chunk );

		if ( !chunk || chunk.start > match.index ) {
			const args = [].slice.call( match ).concat( match.index, str );
			callback.apply( null, args );
			if ( !g ) break;
		}
	}
}

export function replace ( str, pattern, callback ) {
	let replacements = [];

	match( str, pattern, function ( match ) {
		const start = arguments[ arguments.length - 2 ];
		const end = start + match.length;
		const content = callback.apply( null, arguments );

		replacements.push({ start, end, content });
	});

	let replaced = '';
	let lastIndex = 0;

	for ( let i = 0; i < replacements.length; i += 1 ) {
		const { start, end, content } = replacements[i];
		replaced += str.slice( lastIndex, start ) + content;

		lastIndex = end;
	}

	replaced += str.slice( lastIndex );

	return replaced;
}
