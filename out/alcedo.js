/*!
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "[id='" + nid + "'] " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Limit the fix to IE with document.documentMode and IE >=9 with document.defaultView
	if ( document.documentMode && (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

// EXPOSE
if ( typeof define === "function" && define.amd ) {
	define(function() { return Sizzle; });
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
// EXPOSE

})( window );

/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppObject = (function () {
        function AppObject() {
            this._classname = getClassName(this);
            this._aperureHashIndex = AppObject.hashCount++;
        }
        Object.defineProperty(AppObject.prototype, "hashIndex", {
            get: function () {
                return this._aperureHashIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppObject.prototype, "className", {
            get: function () {
                return this._classname;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 哈希计数
         */
        AppObject.hashCount = 1;
        return AppObject;
    })();
    alcedo.AppObject = AppObject;
})(alcedo || (alcedo = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    var AppNotifyable = (function (_super) {
        __extends(AppNotifyable, _super);
        function AppNotifyable() {
            _super.call(this);
            this._notifymap = new Dict();
        }
        AppNotifyable.prototype.registNotify = function (notifymap, name, callback, thisObject, param, priority) {
            if (!notifymap.has(name))
                notifymap.set(name, []);
            var map = notifymap.get(name);
            var length = map.length;
            var insertIndex = -1;
            if (priority === undefined)
                priority = 0;
            for (var i = 0; i < length; i++) {
                var bin = map[i];
                if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                    return false; //防止重复插入
                }
                if (bin && insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var bin = { callback: callback, thisObject: thisObject, param: param ? param : [], priority: priority };
            if (insertIndex != -1) {
                map.splice(insertIndex, 0, bin);
            }
            else {
                map.push(bin);
            }
            //if(name===alcedo.canvas.Stage.ENTER_MILLSECOND10){
            //    trace(getClassName(thisObject),priority,map)
            //}
            //console.log(name,map)
            notifymap.set(name, map);
        };
        AppNotifyable.prototype.unregistNotify = function (notifymap, name, callback, thisObject) {
            if (!notifymap.has(name))
                return;
            var map = notifymap.get(name);
            if (map) {
                for (var i in map) {
                    var bin = map[i];
                    if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                        map.splice(i, 1);
                    }
                }
                notifymap.set(name, map);
            }
        };
        AppNotifyable.prototype.notify = function (notifymap, name, param) {
            AppNotifyable.notify(notifymap, name, param);
        };
        AppNotifyable.notify = function (notifymap, name, param) {
            var map = notifymap.get(name);
            if (map) {
                this.notifyArray(map, param);
                return true;
            }
            else {
                return false;
            }
        };
        AppNotifyable.prototype.notifyArray = function (arr, param) {
            AppNotifyable.notifyArray(arr, param);
        };
        AppNotifyable.notifyArray = function (arr, param) {
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var bin = arr[i];
                if (bin && bin.callback) {
                    if (!param)
                        param = [];
                    if (bin.param)
                        param = bin.param.concat(param);
                    bin.callback.apply(bin.thisObject, param);
                }
            }
        };
        return AppNotifyable;
    })(alcedo.AppObject);
    alcedo.AppNotifyable = AppNotifyable;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.call(this);
            this._eventTarget = this;
            this._eventsMap = new Dict();
        }
        EventDispatcher.prototype.addEventListener = function (event, listener, thisObject, priority) {
            this.registNotify(this._eventsMap, event, listener, thisObject, null, priority);
        };
        EventDispatcher.prototype.clearEventListener = function (event) {
            this._eventsMap.set(event, []);
        };
        EventDispatcher.prototype.removeEventListener = function (event, listener, thisObject) {
            this.unregistNotify(this._eventsMap, event, listener, thisObject);
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            this.notify(this._eventsMap, event.type, [event]);
        };
        EventDispatcher.prototype.emit = function (event, data) {
            if (data === void 0) { data = undefined; }
            this.notify(this._eventsMap, event, [data]);
        };
        return EventDispatcher;
    })(alcedo.AppNotifyable);
    alcedo.EventDispatcher = EventDispatcher;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Matrix2D = (function (_super) {
            __extends(Matrix2D, _super);
            function Matrix2D(a, b, c, d, tx, ty) {
                if (a === void 0) { a = 1; }
                if (b === void 0) { b = 0; }
                if (c === void 0) { c = 0; }
                if (d === void 0) { d = 1; }
                if (tx === void 0) { tx = 0; }
                if (ty === void 0) { ty = 0; }
                _super.call(this);
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }
            /**
             * 前置矩阵
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param tx {number} 沿 x 轴平移每个点的距离
             * @param ty {number} 沿 y 轴平移每个点的距离
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.prepend = function (a, b, c, d, tx, ty) {
                var tx1 = this.tx;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    var a1 = this.a;
                    var c1 = this.c;
                    this.a = a1 * a + this.b * c;
                    this.b = a1 * b + this.b * d;
                    this.c = c1 * a + this.d * c;
                    this.d = c1 * b + this.d * d;
                }
                this.tx = tx1 * a + this.ty * c + tx;
                this.ty = tx1 * b + this.ty * d + ty;
                return this;
            };
            /**
             * 后置矩阵
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param tx {number} 沿 x 轴平移每个点的距离
             * @param ty {number} 沿 y 轴平移每个点的距离
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    this.a = a * a1 + b * c1;
                    this.b = a * b1 + b * d1;
                    this.c = c * a1 + d * c1;
                    this.d = c * b1 + d * d1;
                }
                this.tx = tx * a1 + ty * c1 + this.tx;
                this.ty = tx * b1 + ty * d1 + this.ty;
                return this;
            };
            /**
             * 前置矩阵
             * @method Matrix2D#prependTransform
             * @param x {number} x值
             * @param y {number} y值
             * @param scaleX {number} 水平缩放
             * @param scaleY {number} 垂直缩放
             * @param rotation {number} 旋转
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @param regX {number} x值偏移
             * @param regY {number} y值偏移
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                var r = rotation * canvas.Constant.DEG_TO_RAD; // * Matrix2D.DEG_TO_RAD;
                var cos = canvas.Constant.cos(r);
                var sin = canvas.Constant.sin(r);
                if (regX || regY) {
                    // append the registration offset:
                    this.tx -= regX;
                    this.ty -= regY;
                }
                if (skewX || skewY) {
                    // TODO: can this be combined into a single prepend operation?
                    //                skewX *= Matrix2D.DEG_TO_RAD;
                    //                skewY *= Matrix2D.DEG_TO_RAD;
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                    this.prepend(canvas.Constant.cos(skewY), canvas.Constant.sin(skewY), -canvas.Constant.sin(skewX), canvas.Constant.cos(skewX), x, y);
                }
                else {
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                return this;
            };
            /**
             * 后置矩阵
             * @method Matrix2D#appendTransform
             * @param x {number} x值
             * @param y {number} y值
             * @param scaleX {number} 水平缩放
             * @param scaleY {number} 垂直缩放
             * @param rotation {number} 旋转
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @param regX {number} x值偏移
             * @param regY {number} y值偏移
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                if (rotation % 360) {
                    var r = rotation * canvas.Constant.DEG_TO_RAD; // * Matrix2D.DEG_TO_RAD;
                    var cos = canvas.Constant.cos(r);
                    var sin = canvas.Constant.sin(r);
                }
                else {
                    cos = 1;
                    sin = 0;
                }
                if (skewX || skewY) {
                    // TODO: can this be combined into a single append?
                    //                skewX *= Matrix2D.DEG_TO_RAD;
                    //                skewY *= Matrix2D.DEG_TO_RAD;
                    this.append(canvas.Constant.cos(skewY), canvas.Constant.sin(skewY), -canvas.Constant.sin(skewX), canvas.Constant.cos(skewX), x, y);
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                }
                else {
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                if (regX || regY) {
                    // prepend the registration offset:
                    this.tx -= regX * this.a + regY * this.c;
                    this.ty -= regX * this.b + regY * this.d;
                }
                return this;
            };
            /**
             * 对 Matrix2D 对象应用旋转转换。
             * 矩阵旋转，以角度制为单位
             * @method Matrix2D#rotate
             * @param angle {number} 角度
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.rotate = function (angle) {
                var cos = canvas.Constant.cos(angle);
                var sin = canvas.Constant.sin(angle);
                var a1 = this.a;
                var c1 = this.c;
                var tx1 = this.tx;
                this.a = a1 * cos - this.b * sin;
                this.b = a1 * sin + this.b * cos;
                this.c = c1 * cos - this.d * sin;
                this.d = c1 * sin + this.d * cos;
                this.tx = tx1 * cos - this.ty * sin;
                this.ty = tx1 * sin + this.ty * cos;
                return this;
            };
            /**
             * 矩阵斜切，以角度值为单位
             * @method Matrix2D#skew
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.skew = function (skewX, skewY) {
                //            skewX = skewX * Matrix2D.DEG_TO_RAD;
                //            skewY = skewY * Matrix2D.DEG_TO_RAD;
                this.append(canvas.Constant.cos(skewY), canvas.Constant.sin(skewY), -canvas.Constant.sin(skewX), canvas.Constant.cos(skewX), 0, 0);
                return this;
            };
            /**
             * 矩阵缩放
             * @method Matrix2D#scale
             * @param x {number} 水平缩放
             * @param y {number} 垂直缩放
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.scale = function (x, y) {
                this.a *= x;
                this.d *= y;
                this.c *= x;
                this.b *= y;
                this.tx *= x;
                this.ty *= y;
                return this;
            };
            /**
             * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
             * @method Matrix2D#translate
             * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
             * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.translate = function (x, y) {
                this.tx += x;
                this.ty += y;
                return this;
            };
            /**
             * 为每个矩阵属性设置一个值，该值将导致 null 转换。
             * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
             * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
             * @method Matrix2D#identity
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.identity = function () {
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            };
            /**
             * 矩阵重置为目标矩阵
             * @method Matrix2D#identityMatrix
             * @param Matrix2D {Matrix2D} 重置的目标矩阵
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.identityMatrix = function (Matrix2D) {
                this.a = Matrix2D.a;
                this.b = Matrix2D.b;
                this.c = Matrix2D.c;
                this.d = Matrix2D.d;
                this.tx = Matrix2D.tx;
                this.ty = Matrix2D.ty;
                return this;
            };
            /**
             * 执行原始矩阵的逆转换。
             * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
             * @method Matrix2D#invert
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.invert = function () {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                var tx1 = this.tx;
                var n = a1 * d1 - b1 * c1;
                this.a = d1 / n;
                this.b = -b1 / n;
                this.c = -c1 / n;
                this.d = a1 / n;
                this.tx = (c1 * this.ty - d1 * tx1) / n;
                this.ty = -(a1 * this.ty - b1 * tx1) / n;
                return this;
            };
            Matrix2D.prototype.toArray = function (transpose) {
                if (!this._toarray) {
                    this._toarray = new Float32Array(9);
                }
                if (transpose) {
                    this._toarray[0] = this.a;
                    this._toarray[1] = this.b;
                    this._toarray[2] = 0;
                    this._toarray[3] = this.c;
                    this._toarray[4] = this.d;
                    this._toarray[5] = 0;
                    this._toarray[6] = this.tx;
                    this._toarray[7] = this.ty;
                    this._toarray[8] = 1;
                }
                else {
                    this._toarray[0] = this.a;
                    this._toarray[1] = this.b;
                    this._toarray[2] = this.tx;
                    this._toarray[3] = this.c;
                    this._toarray[4] = this.d;
                    this._toarray[5] = this.ty;
                    this._toarray[6] = 0;
                    this._toarray[7] = 0;
                    this._toarray[8] = 1;
                }
                return this._toarray;
            };
            /**
             * 创建一个 canvas.Matrix2D 对象
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值。
             * @param b {number} 旋转或倾斜图像时影响像素沿 y 轴定位的值。
             * @param c {number} 旋转或倾斜图像时影响像素沿 x 轴定位的值。
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值。
             * @param tx {number} 沿 x 轴平移每个点的距离。
             * @param ty {number} 沿 y 轴平移每个点的距离。
             *
             * | a | b | tx|
             * | c | d | ty|
             * | 0 | 0 | 1 |
             *
             */
            Matrix2D.identity = new Matrix2D();
            return Matrix2D;
        })(alcedo.AppObject);
        canvas.Matrix2D = Matrix2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppProxyer = (function (_super) {
        __extends(AppProxyer, _super);
        //instanceable ?
        function AppProxyer() {
            _super.call(this);
        }
        AppProxyer.prototype.init = function () {
            var anyarg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                anyarg[_i - 0] = arguments[_i];
            }
            //as constructor for AppProxyer
            this._inted = true;
        };
        AppProxyer.prototype.dispatchDemand = function (event, courier) {
            this.emit(event, courier);
        };
        return AppProxyer;
    })(alcedo.EventDispatcher);
    alcedo.AppProxyer = AppProxyer;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/25.
 */
Object.defineProperty(Array.prototype, 'fastRemove', {
    value: function (index) {
        var result = this[index];
        if (this.length == 1) {
            this.length = 0;
            return result;
        }
        this[index] = this.pop();
        return result;
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'last', {
    get: function () {
        return this[this.length - 1];
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'randomselect', {
    value: function () {
        var i = Math.randomFrom(0, this.length) ^ 0;
        return this[i];
    },
    enumerable: false
});
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayObject = (function (_super) {
            __extends(DisplayObject, _super);
            /**
             * 显示对象
             */
            function DisplayObject() {
                _super.call(this);
                /**旋转**/
                this._rotation = 0;
                this._visible = true;
                this._alpha = 1;
                this._worldalpha = 1;
                this._dirty = false;
                this._cacheAsBitmap = false;
                /**
                 * OverRide position method
                 * 主要更新了可视包围盒，TODO:有Bug,待优化
                 */
                this._actualboundingbox = new canvas.Rectangle();
                /**
                 * 显示列表
                 */
                /**父节点**/
                this._parent = null;
                this._root = null;
                this._position = new canvas.Point2D(0, 0);
                this._globalposition = new canvas.Point2D();
                this._pivot = new canvas.Vector2D(0, 0);
                this._scale = new canvas.Vector2D(1, 1);
                this._worldscale = this._scale.clone();
                this._worldtransform = new canvas.Matrix2D();
                this._staticboundingbox = new canvas.Rectangle();
            }
            Object.defineProperty(DisplayObject.prototype, "position", {
                get: function () {
                    return this._position;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "scale", {
                get: function () {
                    return this._scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "worldtransform", {
                get: function () {
                    return this._worldtransform;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "rotation", {
                get: function () {
                    return this._rotation;
                },
                set: function (angle) {
                    this._rotation = angle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "visible", {
                get: function () {
                    return this._visible;
                },
                set: function (boo) {
                    this._visible = boo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "alpha", {
                get: function () {
                    return this._alpha;
                },
                set: function (alpha) {
                    this._alpha = alpha;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "worldalpha", {
                get: function () {
                    return this._worldalpha;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "x", {
                get: function () {
                    return this._position.x;
                },
                set: function (x) {
                    this._position.x = x;
                    this.updateBound(x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "y", {
                get: function () {
                    return this._position.y;
                },
                set: function (y) {
                    this._position.y = y;
                    this._staticboundingbox.y = y - this.pivotOffsetY();
                    this.updateBound(null, y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "globalx", {
                get: function () {
                    this._updateGlobalPosition();
                    return this._globalposition.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "globaly", {
                get: function () {
                    this._updateGlobalPosition();
                    return this._globalposition.y;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype._updateGlobalPosition = function () {
                if (this._parent) {
                    this._parent.localToGlobal(this._position.x, this._position.y, this._globalposition);
                }
                else {
                    this._globalposition.reset(this._position.x, this._position.y);
                }
            };
            DisplayObject.prototype.width = function (width) {
                if (!width && typeof width != "number")
                    return this._staticboundingbox.width;
                this.updateBound(null, null, width);
                this._staticboundingbox.width = width;
                return this;
            };
            DisplayObject.prototype.height = function (height) {
                if (!height && typeof height != "number")
                    return this._staticboundingbox.height;
                this.updateBound(null, null, null, height);
                return this;
            };
            DisplayObject.prototype.updateBound = function (x, y, width, height) {
                if (typeof x == "number")
                    this._staticboundingbox.x = x - this.pivotOffsetX();
                if (typeof y == "number")
                    this._staticboundingbox.y = y - this.pivotOffsetY();
                if (typeof width == "number")
                    this._staticboundingbox.width = width;
                if (typeof height == "number")
                    this._staticboundingbox.height = height;
                //this.emit(DisplayObject.ON_UPDATE_BOUND,{x:x,y:y,width:width,height:height});
            };
            DisplayObject.prototype.pivotX = function (x) {
                if (x === undefined)
                    return this._pivot.x;
                this._pivot.x = x;
                this.updateBound(this.x);
            };
            DisplayObject.prototype.pivotY = function (y) {
                if (y === undefined)
                    return this._pivot.y;
                this._pivot.y = y;
                this.updateBound(null, this.y);
            };
            DisplayObject.prototype.pivotOffsetX = function (offsetx) {
                if (offsetx === undefined)
                    return this._pivot.x * this._staticboundingbox.width;
                this.pivotX(offsetx / this._staticboundingbox.width);
            };
            DisplayObject.prototype.pivotOffsetY = function (offsety) {
                if (offsety === undefined)
                    return this._pivot.y * this._staticboundingbox.height;
                this.pivotY(offsety / this._staticboundingbox.height);
            };
            DisplayObject.prototype.scaleToWidth = function (width) {
                var _scale = width / this._staticboundingbox.width;
                this.scaleALL(_scale);
            };
            DisplayObject.prototype.scaleToHeight = function (height) {
                var _scale = height / this._staticboundingbox.height;
                this.scaleALL(_scale);
            };
            DisplayObject.prototype.scaleALL = function (value) {
                this.scaleX(value);
                this.scaleY(value);
            };
            DisplayObject.prototype.scaleX = function (scalex) {
                if (!scalex)
                    return this._scale.x;
                this._scale.x = scalex;
            };
            DisplayObject.prototype.scaleY = function (scaley) {
                if (!scaley)
                    return this._scale.y;
                this._scale.y = scaley;
            };
            /**
             * 碰撞检测,可以被重写
             * @private
             */
            //public hitPointTest(point:Point2D):boolean{
            //    return this._staticboundingbox.contains(point)
            //}
            //
            //public hitDisplayObjectTest(toHit:DisplayObject):boolean{
            //    return this._staticboundingbox.hitRectangelTest(toHit.staticBound)
            //}
            /**
             * [只读]获得现实对象当前的静态包围盒
             * @returns {Rectangle}
             */
            DisplayObject.prototype.boundBox = function () {
                return this._staticboundingbox.clone();
            };
            DisplayObject.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                return this._root.viewPort().hitRectangelTest(this.boundBox());
            };
            DisplayObject.prototype.actualBound = function () {
                //计算最大包围盒
                var _pointlefttop = this.localToGlobal(0, 0);
                var _pointrighttop = this.localToGlobal(this._staticboundingbox.width, 0);
                var _pointrightbottom = this.localToGlobal(this._staticboundingbox.width, this._staticboundingbox.height);
                var _pointleftbottom = this.localToGlobal(0, this._staticboundingbox.height);
                canvas.Rectangle.rectangleFromFourPoint(_pointlefttop, _pointrighttop, _pointrightbottom, _pointleftbottom, this._actualboundingbox);
                //trace(this._maxboundingbox);
                return this._actualboundingbox;
            };
            DisplayObject.prototype.actualWidth = function () {
                return this._actualboundingbox.width;
            };
            DisplayObject.prototype.actualHeight = function () {
                return this._actualboundingbox.height;
            };
            /**
             * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
             * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
             * @method canvas.DisplayObject#localToGlobal
             * @param x {number} 本地x坐标
             * @param y {number} 本地y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于舞台的坐标的 Point 对象。
             */
            DisplayObject.prototype.localToGlobal = function (x, y, resultPoint) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var mtx = this._getConcatenatedMatrix();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new canvas.Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            };
            /**
             * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
             * @method canvas.DisplayObject#globalToLocal
             * @param x {number} 全局x坐标
             * @param y {number} 全局y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于显示对象的坐标的 Point2D 对象。
             */
            DisplayObject.prototype.globalToLocal = function (x, y, resultPoint) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var mtx = this._getConcatenatedMatrix();
                mtx.invert();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new canvas.Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            };
            DisplayObject.prototype._getConcatenatedMatrix = function () {
                //todo:----------------------------
                var matrix = DisplayObject.identityMatrixForGetConcatenated.identity();
                var o = this;
                while (o != null && !(o instanceof canvas.Stage)) {
                    if (o._pivot.x != 0 || o._pivot.y != 0) {
                        var bounds = this.boundBox();
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0, bounds.width * o._pivot.x, bounds.height * o._pivot.y);
                    }
                    else {
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0, o.pivotOffsetX(), o.pivotOffsetY());
                    }
                    o = o._parent;
                }
                return matrix;
            };
            Object.defineProperty(DisplayObject.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype._setParent = function (parent) {
                if (this._parent === parent)
                    return;
                this.removeFromParent();
                this._parent = parent;
                if (!this._parent) {
                    this._root = null;
                    return;
                }
                //trace(getClassName(this),"_setParent",this._parent._root, this._root);
                var parent = this._parent;
                var _root = parent;
                while (_root._parent) {
                    if (_root._parent === _root) {
                        throw new Error("_root._parent===_root");
                    }
                    _root = _root._parent;
                }
                this._root = _root;
                this._onAdd();
            };
            DisplayObject.prototype._onAdd = function () {
                //this.emit(DisplayObjectEvent.ON_ADD);
                if (this.isAddtoStage()) {
                    this.emit(canvas.DisplayObjectEvent.ON_ADD_TO_STAGE);
                    this._stage = this._root;
                }
            };
            DisplayObject.prototype.removeFromParent = function () {
                if (this._parent)
                    this._parent.removeChild(this);
            };
            Object.defineProperty(DisplayObject.prototype, "root", {
                get: function () {
                    return this._root;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype.isAddtoStage = function () {
                return this._root instanceof canvas.Stage;
            };
            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            DisplayObject.prototype._transform = function () {
                var flag = !!this._parent, pt = canvas.Matrix2D.identity, wt = this._worldtransform;
                if (flag)
                    pt = this._parent._worldtransform;
                wt.identityMatrix(pt);
                this._worldtransform = this._getMatrix(wt);
                this._worldalpha = flag ? (this._alpha * this._parent._worldalpha) : this._alpha;
                this._worldscale = flag ? (this._scale.multiply(this._parent._worldscale)) : this._scale;
            };
            /**
             * 每帧渲染
             * @private
             */
            DisplayObject.prototype._render = function (renderer) {
                //处理其他通用的渲染步骤（滤镜，遮罩等）
                renderer.context.globalAlpha = this._worldalpha;
                renderer.setTransform(this._worldtransform);
                this._draw(renderer);
            };
            DisplayObject.prototype._draw = function (renderer) {
                //绘制
                //needs to be override or extend;
            };
            DisplayObject.prototype._refreshBitmapCache = function () {
            };
            DisplayObject.prototype._createBitmapCache = function () {
            };
            DisplayObject.prototype._offset = function () {
                var o = this;
                var offsetx = o._pivot.x * o._staticboundingbox.width;
                var offsety = o._pivot.y * o._staticboundingbox.height;
                return canvas.Point2D.identity(offsetx, offsety);
                //return Point(0,0);
            };
            DisplayObject.prototype._getMatrix = function (matrix) {
                var _matrix = matrix;
                if (!_matrix) {
                    _matrix = canvas.Matrix2D.identity;
                }
                var offsetPoint = this._offset();
                _matrix.appendTransform(this._position.x, this._position.y, this._scale.x, this._scale.y, this._rotation, 0, 0, offsetPoint.x, offsetPoint.y);
                return _matrix;
            };
            DisplayObject.ON_UPDATE_BOUND = "DisplayObject_ON_UPDATE_BOUND";
            DisplayObject.identityMatrixForGetConcatenated = new canvas.Matrix2D();
            return DisplayObject;
        })(alcedo.EventDispatcher);
        canvas.DisplayObject = DisplayObject;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    alcedo.isdebug = false;
    function proxy(proxy, proxyid) {
        return AppFacade.instance.proxy(proxy, proxyid);
    }
    alcedo.proxy = proxy;
    function dispatchCmd(command, cmd, courier) {
        if (courier === void 0) { courier = []; }
        AppFacade.instance.dispatchCmd(command, cmd, courier);
    }
    alcedo.dispatchCmd = dispatchCmd;
    function addDemandListener(com, type, callback, thisObject) {
        return AppFacade.instance.addDemandListener(com, type, callback, thisObject);
    }
    alcedo.addDemandListener = addDemandListener;
    var _facadeinittask = [];
    function addFacadeInitTask(fn, thisObject, param) {
        _facadeinittask.push({ callback: fn, thisObject: thisObject, param: param });
    }
    alcedo.addFacadeInitTask = addFacadeInitTask;
    var AppFacade = (function (_super) {
        __extends(AppFacade, _super);
        function AppFacade() {
            _super.call(this);
            if (AppFacade._instance != null) {
            }
            this._cmdpool = new Dict();
            this._proxypool = new Dict();
            this._postals = new Dict();
            this._postman = new alcedo.FacadeEvent();
            this.addEventListener(alcedo.FacadeEvent.UNIQUE, this._postOffice, this);
        }
        AppFacade.prototype.init = function () {
            this.notifyArray(_facadeinittask);
        };
        Object.defineProperty(AppFacade.prototype, "app", {
            get: function () {
                return this._app;
            },
            set: function (cycler) {
                if (!this._app) {
                    this._app = cycler;
                }
                else {
                    warn("cycler already init");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppFacade.prototype, "postals", {
            get: function () {
                return this._postals;
            },
            enumerable: true,
            configurable: true
        });
        //邮局
        AppFacade.prototype._postOffice = function (e) {
            if (!this._postals.has(e.com)) {
                this._postals.set(e.com, new Dict());
            }
            var ant = this._postals.get(e.com).get(e.notify);
            if (ant && ant.callback && ant.thisobj) {
                ant.callback.apply(ant.thisobj, e.courier);
            }
        };
        AppFacade.prototype.proxy = function (proxy, proxyid) {
            if (isOfClass(proxy, alcedo.AppProxyer)) {
                if (!proxy.prototype.alproxyid) {
                    AppFacade._proxycound++;
                    proxy.prototype.alproxyid = AppFacade._proxycound;
                }
                var proxyname = getClassName(proxy) + "_" + proxy.prototype.alproxyid;
                var result = this._proxypool.get(proxyname);
                if (proxy.instanceable === true) {
                    if (!result) {
                        this._proxypool.set(proxyname, new proxy());
                    }
                    return this._proxypool.get(proxyname);
                }
                else if (proxyid) {
                    var proxydict = this._proxypool.get(proxyname);
                    if (!proxydict || !(proxydict instanceof Dict)) {
                        this._proxypool.set(proxyname, new Dict());
                    }
                    if (!this._proxypool.get(proxyname).has(proxyid)) {
                        this._proxypool.get(proxyname).set(proxyid, new proxy());
                    }
                    return this._proxypool.get(proxyname).get(proxyid);
                }
                else {
                    error("Are you want a instanceable proxy? proxy.instanceable==undefined");
                    return null;
                }
            }
            else {
                error(proxy, proxyid, "select fail!");
                return null;
            }
            //return this._proxypool.get(<string>proxyid)
        };
        AppFacade.getCommandId = function (command) {
            var idc;
            if (isOfClass(command, alcedo.AppCmder)) {
                if (!command.prototype.alcmdid) {
                    AppFacade._commandcound++;
                    command.prototype.alcmdid = AppFacade._commandcound;
                }
                idc = command.prototype.alcmdid;
            }
            else if (command instanceof alcedo.AppCmder) {
                if (!command["__proto__"].alcmdid) {
                    AppFacade._commandcound++;
                    command["__proto__"].alcmdid = AppFacade._commandcound;
                }
                idc = command["__proto__"].alcmdid;
            }
            else {
                return undefined;
            }
            return getClassName(command) + "_" + idc;
        };
        AppFacade.prototype.command = function (command) {
            if (command instanceof alcedo.AppCmder) {
                return command;
            }
            var commandname = AppFacade.getCommandId(command);
            if (isOfClass(command, alcedo.AppCmder)) {
                if (commandname == AppFacade.getCommandId(alcedo.AppCmder)) {
                    return;
                }
                if (!this._cmdpool.get(commandname)) {
                    if (isOfClass(command, alcedo.AppCmder)) {
                        var c = new command();
                        this._cmdpool.set(commandname, c);
                    }
                    else {
                        console.error(command, "is not of", getClassName(alcedo.AppCmder));
                    }
                }
                return this._cmdpool.get(commandname);
            }
        };
        AppFacade.prototype.dispatchCmd = function (command, cmd, courier) {
            if (courier === void 0) { courier = []; }
            if (AppFacade.getCommandId(command) == AppFacade.getCommandId(alcedo.AppCmder)) {
                return;
            }
            if (!(command instanceof alcedo.AppCmder))
                this.command(command);
            this._postman.setNotify(command, cmd, courier);
            this.dispatchEvent(this._postman);
        };
        AppFacade.prototype.addDemandListener = function (com, type, callback, thisObject) {
            if (com instanceof alcedo.AppProxyer) {
                com.addEventListener(type, callback, thisObject);
                return true;
            }
            if (isOfClass(com, alcedo.AppCmder)) {
                var c = this.command(com);
                c.addEventListener(type, callback, thisObject);
                return true;
            }
            return false;
        };
        Object.defineProperty(AppFacade, "instance", {
            get: function () {
                if (!AppFacade._instance) {
                    AppFacade._instance = new AppFacade();
                    AppFacade._instance.init();
                }
                //if(this._instance['_game'] && this._instance['_display']){this._instance['_isinit'] = true;}
                return AppFacade._instance;
            },
            enumerable: true,
            configurable: true
        });
        AppFacade.ON_INIT = "AppFacadeCreate";
        AppFacade._proxycound = 0;
        /**
         * 获得command的唯一id
         * @type {number}
         * @private
         */
        AppFacade._commandcound = 0;
        return AppFacade;
    })(alcedo.EventDispatcher);
    alcedo.AppFacade = AppFacade;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppCmder = (function (_super) {
        __extends(AppCmder, _super);
        function AppCmder() {
            _super.call(this);
        }
        AppCmder.prototype.addCmdHandler = function (notify, callback) {
            if (!alcedo.AppFacade.instance.postals.has(alcedo.AppFacade.getCommandId(this))) {
                alcedo.AppFacade.instance.postals.set(alcedo.AppFacade.getCommandId(this), new Dict());
            }
            alcedo.AppFacade.instance.postals.get(alcedo.AppFacade.getCommandId(this)).set(notify, { thisobj: this, callback: callback });
        };
        AppCmder.prototype.dispatchDemand = function (event, courier) {
            this.emit(event, courier);
        };
        return AppCmder;
    })(alcedo.EventDispatcher);
    alcedo.AppCmder = AppCmder;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(_type, courier) {
            _super.call(this);
            this._type = _type;
            this._courier = courier;
        }
        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "courier", {
            get: function () {
                return this._courier;
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    })(alcedo.AppObject);
    alcedo.Event = Event;
})(alcedo || (alcedo = {}));
Math.randomFrom = function (begin, to) {
    var d = to - begin, min = to > begin ? begin : to;
    if (d < 0)
        d = -d;
    return Math.random() * d + min;
};
//相加
Math.add = function () {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i - 0] = arguments[_i];
    }
    var result = 0;
    for (var i = 0; i < nums.length; i++) {
        if (Number(nums[i])) {
            result += Number(nums[i]);
        }
        else {
        }
    }
    return result;
};
//可能性分布概率池
Math.probabilityPool = function probabilityPool(pool) {
    if (pool.length == 1) {
        pool.push(1 - pool[0]);
    }
    var cdf = this.probabilityPool._cache.get(pool);
    var y = Math.random();
    for (var x in cdf)
        if (y < cdf[x])
            return Number(x);
    return -1; // should never runs here, assuming last element in cdf is 1
};
/**缓存数组**/
Math.probabilityPool._cache = {
    pool: {},
    length: 0,
    get: function (array) {
        var cachename = array.join("_");
        if (!this.pool[cachename]) {
            if (this.length > 100) {
                this.length = 0;
                this.pool = {};
            }
            this.length++;
            this.pool[cachename] = Math.probabilityPool._pdf2cdf(array);
        }
        return this.pool[cachename];
    }
};
/**逆变换取样**/
Math.probabilityPool._pdf2cdf = function (pdf) {
    var total = 0;
    for (var i = 0; i < pdf.length; i++) {
        total += pdf[i];
        if (total > 1) {
            total -= pdf[i];
            //warn('total probability in',pdf," scene",pdf[i],'['+i+'] is > 1');
            pdf.splice(i, pdf.length - i);
            break;
        }
    }
    if (total < 1) {
        pdf.push(1);
    }
    var cdf = pdf.slice();
    for (var i = 1; i < cdf.length - 1; i++) {
        cdf[i] += cdf[i - 1];
    }
    // Force set last cdf to 1, preventing floating-point summing error in the loop.
    cdf[cdf.length - 1] = 1;
    //trace(pdf,cdf,total)
    return cdf;
};
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplatObjectContainer = (function (_super) {
            __extends(DisplatObjectContainer, _super);
            function DisplatObjectContainer() {
                _super.call(this);
                this._children = [];
            }
            Object.defineProperty(DisplatObjectContainer.prototype, "children", {
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            DisplatObjectContainer.prototype._transform = function () {
                _super.prototype._transform.call(this);
                this.eachChilder(function (child) {
                    child._transform();
                });
            };
            DisplatObjectContainer.prototype._render = function (renderer) {
                this.eachChilder(function (child) {
                    child._render(renderer);
                });
            };
            DisplatObjectContainer.prototype.addChild = function (child) {
                var success = this._addChild(child);
                if (!success) {
                    //warn("addChild fail");
                    return;
                }
                child.emit(canvas.DisplayObjectEvent.ON_ADD, { parent: this, index: this._children.length - 1 });
            };
            DisplatObjectContainer.prototype._addChild = function (child) {
                if (child.parent == this)
                    return false;
                this._children.push(child);
                child._setParent(this);
                return true;
            };
            DisplatObjectContainer.prototype.addChildAt = function (child, index) {
                var success = this._addChild(child);
                if (!success)
                    return;
                this.setChildIndex(child, index);
                child.emit(canvas.DisplayObjectEvent.ON_ADD, { parent: this });
            };
            DisplatObjectContainer.prototype.setChildIndex = function (child, index) {
                var lastIdx = this._children.indexOf(child);
                if (lastIdx < 0) {
                    return;
                }
                //从原来的位置删除
                this._children.splice(lastIdx, 1);
                //放到新的位置
                if (index < 0 || this._children.length <= index) {
                    this._children.push(child);
                }
                else {
                    this._children.splice(index, 0, child);
                }
            };
            DisplatObjectContainer.prototype.removeChild = function (child) {
                var i = this._children.indexOf(child);
                if (i >= 0) {
                    this._children.splice(i, 1);
                    child._setParent(null);
                    child.emit(canvas.DisplayObjectEvent.ON_REMOVE, { parent: this });
                }
            };
            DisplatObjectContainer.prototype.removeChildren = function () {
                this.eachChilder(function (child) {
                    child._setParent(null);
                });
                this._children = [];
            };
            DisplatObjectContainer.prototype.eachChilder = function (fn) {
                for (var i = 0; i < this._children.length; i++) {
                    fn.call(this, this._children[i]);
                }
            };
            DisplatObjectContainer.prototype._onAdd = function () {
                var _this = this;
                _super.prototype._onAdd.call(this);
                this.eachChilder(function (child) {
                    child._root = _this._root;
                    child._onAdd();
                });
            };
            return DisplatObjectContainer;
        })(canvas.DisplayObject);
        canvas.DisplatObjectContainer = DisplatObjectContainer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Point2D = (function () {
            function Point2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                //super();
                this.x = x;
                this.y = y;
            }
            Point2D.identity = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                Point2D._identity.reset(x, y);
                return Point2D._identity;
            };
            /**
             * 克隆点对象
             */
            Point2D.prototype.clone = function () {
                return new Point2D(this.x, this.y);
            };
            /**
             * 设置X,y
             */
            Point2D.prototype.reset = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            };
            /** 加 **/
            Point2D.prototype.add = function (vector) {
                this.x += vector.x;
                this.y += vector.y;
                return this;
            };
            /** 减 **/
            Point2D.prototype.subtract = function (vector) {
                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            };
            /** 乘 **/
            Point2D.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                return this;
            };
            /** 除 **/
            Point2D.prototype.divide = function (vector) {
                this.x /= vector.x;
                this.y /= vector.y;
                return this;
            };
            Point2D._identity = new Point2D();
            return Point2D;
        })();
        canvas.Point2D = Point2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var CanvasRenderer = (function (_super) {
            __extends(CanvasRenderer, _super);
            function CanvasRenderer() {
                _super.call(this);
                this._mainlooptask = new Dict();
            }
            CanvasRenderer.prototype.render = function () {
                //TODO:绘制canvas
            };
            CanvasRenderer.prototype.executeMainLoop = function (stage, canvas) {
                //this._stage = stage;
                //this._canvas = <any>stage.canvas;
            };
            CanvasRenderer.prototype.clearScreen = function () {
            };
            CanvasRenderer.prototype.registMainLoopTask = function (task, thisObject, priority) {
                this.registNotify(this._mainlooptask, CanvasRenderer.MainLoop, task, thisObject, null, priority);
            };
            CanvasRenderer.prototype.unregistMainLoopTask = function (task, thisObject) {
                this.unregistNotify(this._mainlooptask, CanvasRenderer.MainLoop, task, thisObject);
            };
            CanvasRenderer.prototype.setTransform = function (matrix) {
            };
            Object.defineProperty(CanvasRenderer.prototype, "context", {
                get: function () {
                    return this._canvasRenderContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "smooth", {
                set: function (flag) {
                },
                enumerable: true,
                configurable: true
            });
            CanvasRenderer.detecter = function () {
                var webglsupport = (function () {
                    try {
                        var canvas = document.createElement('canvas');
                        return !!window["WebGLRenderingContext"] && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                    }
                    catch (e) {
                        return false;
                    }
                })();
                if (webglsupport) {
                }
                else {
                }
                return new _canvas.Context2DRenderer();
            };
            CanvasRenderer.MainLoop = "CanvasRenderer_MainLoop";
            return CanvasRenderer;
        })(alcedo.AppProxyer);
        _canvas.CanvasRenderer = CanvasRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
var Dict = (function () {
    function Dict() {
        this._map = {};
        this._keys = [];
        //var a:Map = new Map()
    }
    Dict.prototype.set = function (key, value) {
        if (!this._map[key]) {
            this._keys.push(key);
        }
        this._map[key] = value;
    };
    Dict.prototype.get = function (key) {
        return this._map[key];
    };
    Dict.prototype.find = function (reg) {
        var i, keys = this._keys, result = [];
        for (i = 0; i < keys.length; i++) {
            if (reg.test(keys[i])) {
                if (this.get(keys[i]))
                    result.push(this.get(keys[i]));
            }
        }
        return result;
    };
    Dict.prototype.delete = function (key) {
        var index = this._keys.indexOf(key, 0);
        if (index >= 0) {
            this._keys.splice(index, 1);
        }
        if (this.has(key))
            delete this._map[key];
    };
    Dict.prototype.has = function (key) {
        return this._map[key] ? true : false;
    };
    Dict.prototype.clear = function () {
        this._map = {};
        this._keys = [];
    };
    /** @/deprecated */
    Dict.prototype.forEach = function (callbackfn, thisArg) {
        for (var i = 0; i < this._keys.length; i++) {
            var key = this._keys[i];
            var value = this._map[this._keys[i]];
            callbackfn.apply(thisArg, [value, key]);
        }
    };
    Object.defineProperty(Dict.prototype, "values", {
        get: function () {
            var values = [];
            for (var i = 0; i < this._keys.length; i++) {
                var value = this._map[this._keys[i]];
                values.push(value);
            }
            return values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dict.prototype, "keys", {
        get: function () {
            return this._keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dict.prototype, "size", {
        get: function () {
            return this._keys.length;
        },
        enumerable: true,
        configurable: true
    });
    return Dict;
})();
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    //canvas 心跳控制器
    var dom;
    (function (dom) {
        var _log_code = {};
        _log_code["dom" + 1001] = "DomManager是内部使用的单例,无需在外部实例化,请使用d$访问";
        function log_code(code) {
            return _log_code["dom" + code];
        }
        dom.log_code = log_code;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/4.
 */
//var ap:any = aperture;
var alcedo;
(function (alcedo) {
    alcedo.a$;
    var AppLauncher = (function () {
        function AppLauncher(debug) {
            if (AppLauncher._instance) {
            }
            alcedo.isdebug = debug;
            alcedo.debuginit();
            info("%cAlcedo", "color:#1ac2ff;font-weight:bold;", "A Simple TypeScript HTML5 App/Game FrameWork!");
            info("gitHub:", 'https://github.com/tommyZZM/Alcedo');
            info("If you are a non-employee who has discovered this facility amid the ruins of civilization.\n" + "Welcome! And remember: Testing is the future, and the future starts with you.");
            alcedo.a$ = alcedo.AppFacade.instance;
        }
        AppLauncher.prototype.launch = function (courier) {
            if (!this._launched) {
                if (alcedo.a$.app) {
                    this._launched = true;
                    alcedo.a$.dispatchCmd(alcedo.a$.app, AppLauncher.START_UP, courier);
                }
                else {
                    console.warn("create a app cycler first!");
                }
            }
        };
        AppLauncher.instance = function (debug) {
            if (this._instance == null) {
                this._instance = new AppLauncher(debug);
            }
            //if(this._instance['_game'] && this._instance['_display']){this._instance['_isinit'] = true;}
            return this._instance;
        };
        AppLauncher.START_UP = "AppLauncher.START_UP";
        return AppLauncher;
    })();
    alcedo.AppLauncher = AppLauncher;
    function launch(debug, courier) {
        AppLauncher.instance(debug).launch(courier);
    }
    alcedo.launch = launch;
})(alcedo || (alcedo = {}));
function trace() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function warn() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function info() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function error() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
var alcedo;
(function (alcedo) {
    function debuginit() {
        if (alcedo.isdebug) {
            window["log"] = console.log.bind(console);
            window["trace"] = console.log.bind(console);
            window["debug"] = console.debug.bind(console);
            window["warn"] = console.warn.bind(console);
            window["info"] = console.info.bind(console);
            window["error"] = console.error.bind(console);
        }
    }
    alcedo.debuginit = debuginit;
})(alcedo || (alcedo = {}));
//Ecmascript Multiplexing OO expand
//function getClassName(obj:any):string{
//    //class?
//    if (obj.prototype) {
//        if (obj.prototype.__class__ && obj.prototype.constructor){
//            return obj.prototype.__class__;
//        }
//    }else if(obj.__proto__){
//        if (obj.__proto__.__class__ && obj.__proto__.constructor){
//            return obj.__proto__.__class__;
//        }
//    }else{
//        //console.warn(obj,'is not a class!');
//        return undefined;
//    }
//}
//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
/**
 * 获取类名,不包括命名空间
 * @param obj
 * @returns {string}
 */
function getClassName(obj) {
    //class?
    if (obj.prototype && obj.prototype.constructor) {
        return obj.prototype.constructor["name"];
    }
    else if (obj.__proto__ && obj.__proto__.constructor) {
        return obj.__proto__.constructor["name"];
    }
    else if (obj instanceof Object) {
        return "Object";
    }
    else {
        //console.warn(obj,'is not a class!');
        return undefined;
    }
}
/**
 * 判断类型是否继承?类型
 * @returns {boolean}
 * @param targetClass
 * @param testClass
 */
function isOfClass(targetClass, testClass) {
    if (!targetClass.prototype || !targetClass.prototype.constructor) {
        //console.warn("not typescript class");
        return false;
    }
    return (targetClass.prototype.constructor.prototype instanceof testClass);
}
//function isOfClass(target,test):boolean{
//    if(!target||!target.prototype||!target.prototype['__class__'] || !test.prototype['__class__']){
//        console.warn(target,"not typescript class");
//        return false;
//    }
//
//    if(target.prototype['__class__']==test.prototype['__class__']){
//        return true;
//    }else{
//        var flag:number = 0;
//        var protoTest = (target,test)=>{
//            //console.log(target.__class__,test.prototype['__class__'])
//            if(target){
//                if(target.__class__){
//                    if(target.__class__ == test.prototype['__class__']){
//                        return 1;
//                    }else{
//                        return 0;
//                    }
//                }
//                return -1
//            }
//            return -1
//        };
//
//        target = target.prototype.__proto__;
//        while(flag==0){
//            flag = protoTest(target,test);
//            target = target.__proto__;
//        }
//        return flag == 1;
//    }
//}
function expandMethod(method, target, thisArg) {
    var _method;
    if (typeof method == "string") {
        if (!thisArg || !thisArg['__proto__'][method] || !(thisArg['__proto__'][method] instanceof Function)) {
            return target;
        }
        _method = thisArg['__proto__'][method];
        target["_origin"] = _method.bind(thisArg);
        thisArg['__proto__'][method] = target;
    }
    else {
        if (!(method instanceof Function)) {
            return target;
        }
        _method = method;
        target["_origin"] = _method.bind(thisArg);
    }
    return target;
}
/**
 * Created by tommyZZM on 2015/4/5.
 * TODO:Dom元素操作优化
 */
var alcedo;
(function (alcedo) {
    alcedo.d$;
    var dom;
    (function (dom) {
        var DomManager = (function (_super) {
            __extends(DomManager, _super);
            function DomManager() {
                _super.call(this);
                if (DomManager._instance != null) {
                    console.error(dom.log_code(1001));
                }
                this._querypool = new Dict();
                this._domtask = new Dict();
                this._domtask.set(DomEventType.ready, []);
                this.usefulDomEvent();
                this.windowConfigure();
            }
            DomManager.prototype.usefulDomEvent = function () {
                var _this = this;
                window.onresize = this.onresize.bind(this);
                document.addEventListener('webkitvisibilitychange', function () {
                    if (!document.hidden) {
                        _this.onShow();
                    }
                    else {
                        _this.onHide();
                    }
                });
                window.addEventListener("pageshow", this.onShow.bind(this));
                window.addEventListener("pagehide", this.onHide.bind(this));
            };
            DomManager.prototype.onShow = function () {
                if (this._lastfocusstate === this._focus)
                    return;
                this._focus = true;
                this._lastfocusstate = this._focus;
                this.emit(dom.DomEvents.ON_FOCUS, { time: Date.now() });
            };
            DomManager.prototype.onHide = function () {
                this._focus = false;
                this.emit(dom.DomEvents.ON_LOST_FOCUS, { time: Date.now() });
            };
            DomManager.prototype.windowConfigure = function () {
                //体验优化CSS
                var defaultcss = "*{user-select: none; user-focus: none; -webkit-touch-callout: none; -webkit-user-select: none;} " + "input{user-select: auto; user-focus: auto; -webkit-touch-callout: auto; -webkit-user-select: auto;}", defaultstyle = document.createElement("style"), head = document.head || document.getElementsByTagName('head')[0];
                defaultstyle.type = 'text/css';
                if (defaultstyle.styleSheet) {
                    defaultstyle.styleSheet["cssText"] = defaultcss;
                }
                else {
                    defaultstyle.appendChild(document.createTextNode(defaultcss));
                }
                head.appendChild(defaultstyle);
            };
            DomManager.prototype.onready = function () {
                this._readychekced = true;
                this.notify(this._domtask, DomEventType.ready);
                this._domtask.set(DomEventType.ready, []);
            };
            DomManager.prototype.checkready = function () {
                var _this = this;
                if (document.readyState === "complete" || this._readychekced) {
                    this.onready();
                }
                else {
                    // Use the handy event callback
                    //document.addEventListener( "DOMContentLoaded", this.readyed.bind(this) );
                    // A fallback to window.onload, that will always work
                    if (!this._readychekced) {
                        window.addEventListener("load", function () {
                            window.removeEventListener("load", arguments.callee, false);
                            //trace("window loaded");
                            _this.onready();
                        }, false);
                    }
                }
            };
            DomManager.prototype.ready = function (callback, thisObject) {
                var param = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    param[_i - 2] = arguments[_i];
                }
                if (this._readychekced) {
                    callback.apply(thisObject, param);
                }
                else {
                    this.registNotify(this._domtask, DomEventType.ready, callback, thisObject, param);
                    this.checkready();
                }
            };
            /**
             * resized
             */
            DomManager.prototype.onresize = function () {
                this.notify(this._domtask, DomEventType.resize);
            };
            DomManager.prototype.resize = function (callback, thisObject) {
                var param = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    param[_i - 2] = arguments[_i];
                }
                callback.apply(thisObject, param); //注册的时候先执行一次
                this.registNotify(this._domtask, DomEventType.resize, callback, thisObject, param);
            };
            DomManager.prototype.query = function (selector) {
                var results = [], eles = this.prase(selector);
                for (var i = 0; i < eles.length; i++) {
                    results.push(this.htmlele2domele(eles[i]));
                }
                if (results.length == 0) {
                    results = [];
                }
                //results.first = function(){
                //    return this[0]
                //};
                //if(eles.length==1)results=results[0];
                return results;
            };
            DomManager.prototype.htmlele2domele = function (ele) {
                var result;
                if (ele) {
                    if (!ele.getAttribute("data-" + dom._elemark)) {
                        _elecount++;
                        ele.setAttribute("data-" + dom._elemark, _elecount + "");
                        result = new dom.DomElement(ele);
                        this._querypool.set(result.apid + "", result);
                    }
                    else {
                        result = this._querypool.get(ele.getAttribute("data-" + dom._elemark));
                    }
                }
                return result;
            };
            DomManager.prototype.prase = function (selector) {
                var match, elem, result = [];
                if (typeof selector === "string") {
                    if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
                        match = [null, selector, null];
                    }
                    if (match) {
                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            var parsed = _rsingleTag.exec(match[1]);
                            if (parsed) {
                                elem = document.createElement(parsed[1]);
                            }
                            else {
                                parsed = _rhtml.test(match[1]);
                                if (parsed) {
                                    elem = match[1];
                                    var fragment = document.createDocumentFragment();
                                    var fragment = fragment.appendChild(document.createElement("div"));
                                    //tag = ( _rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                                    fragment.innerHTML = elem.replace(_rxhtmlTag, "<$1></$2>");
                                    var tmp = fragment.firstChild;
                                    elem = tmp;
                                    fragment.textContent = "";
                                }
                            }
                            result = [elem];
                        }
                        else {
                            result = Sizzle(selector);
                        }
                    }
                    else {
                        result = Sizzle(selector);
                    }
                }
                else if (selector.nodeType == 1 /* ELEMENT */) {
                    result = [selector];
                }
                return result;
            };
            DomManager.prototype.compare = function (node1, node2) {
                var boo = (node1 === node2);
                if (node1.isSameNode)
                    boo = node1.isSameNode(node2);
                return boo;
            };
            Object.defineProperty(DomManager, "instance", {
                get: function () {
                    if (DomManager._instance == null) {
                        DomManager._instance = new DomManager();
                    }
                    return DomManager._instance;
                },
                enumerable: true,
                configurable: true
            });
            return DomManager;
        })(alcedo.EventDispatcher);
        dom.DomManager = DomManager;
        (function (NodeType) {
            NodeType[NodeType["ELEMENT"] = 1] = "ELEMENT";
            NodeType[NodeType["ARRT"] = 2] = "ARRT";
            NodeType[NodeType["TEXT"] = 3] = "TEXT";
            NodeType[NodeType["COMMENTS"] = 8] = "COMMENTS";
            NodeType[NodeType["DOCUMENT"] = 9] = "DOCUMENT";
        })(dom.NodeType || (dom.NodeType = {}));
        var NodeType = dom.NodeType;
        var DomEventType = {
            "ready": "ready",
            "resize": "resize"
        };
        alcedo.d$ = dom.DomManager.instance;
        //var _rquickExpr:RegExp = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
        var _rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
        var _rhtml = /<|&#?\w+;/;
        //var _rtagName:RegExp = /<([\w:]+)/;
        var _rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
        //var _rallLetter:RegExp = /^[A-Za-z]+$/;
        var _elecount = 0;
        dom._elemark = "apid";
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    function checkNormalType(data) {
        return (typeof data == "string" || typeof data == "number");
    }
    alcedo.checkNormalType = checkNormalType;
    var _r2value = /(\w*)^((\d|\.)+)(\w*)$/i;
    function toValue(str) {
        //trace("toValue",_r2value.exec(str),str)
        var _str, _rstr = _r2value.exec(str);
        if (_rstr) {
            _str = Number(_rstr[2]);
        }
        if (!_str) {
            _str = 0;
        }
        return _str;
    }
    alcedo.toValue = toValue;
    function tryExecute(fn, onerror, thisObject) {
        try {
            thisObject ? fn.apply(thisObject) : fn();
        }
        catch (e) {
            thisObject ? onerror.apply(thisObject, e) : onerror(e);
        }
    }
    alcedo.tryExecute = tryExecute;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    /**
     * objectpool => class [name] if(cyclable) =>{active:[],disactive:[]}
     */
    var AppObjectPool = (function (_super) {
        __extends(AppObjectPool, _super);
        function AppObjectPool() {
            _super.call(this);
            this._objectpool = { active: new Dict(), disactive: new Dict() };
        }
        AppObjectPool.prototype.new = function (objclass) {
            var results, result, name = getClassName(objclass);
            if (name) {
                if (!this._objectpool.disactive.get(name))
                    this._objectpool.disactive.set(name, []);
                if (!this._objectpool.active.get(name))
                    this._objectpool.active.set(name, []);
                results = this._objectpool.disactive.get(name);
                if (results.length >= 1) {
                    result = results.splice(0, 1);
                    this._objectpool.disactive.set(name, results);
                }
                else {
                    //if(createmethod){result = createmethod}
                    result = new objclass();
                    if (!result.onCreate && result.onDestory) {
                        warn("AppObjectPool only accept ICycable object");
                        return;
                    }
                }
                this._objectpool.active.get(name).push(result);
                result.onCreate();
                //trace(this._objectpool);
                return result;
            }
            else {
                return null;
            }
        };
        AppObjectPool.prototype.destory = function (obj) {
            var objindex, name = getClassName(obj);
            if (!this._objectpool.disactive.get(name))
                return;
            if (!this._objectpool.active.get(name))
                return;
            var activepool = this._objectpool.active.get(name);
            objindex = activepool.indexOf(obj);
            if (objindex >= 0) {
                activepool.splice(objindex, 1);
                this._objectpool.active.set(name, activepool);
                this._objectpool.disactive.get(name).push(obj);
                obj.onDestory();
            }
        };
        AppObjectPool.instanceable = true;
        return AppObjectPool;
    })(alcedo.AppProxyer);
    alcedo.AppObjectPool = AppObjectPool;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/4.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TouchEvent = (function (_super) {
            __extends(TouchEvent, _super);
            function TouchEvent() {
                _super.apply(this, arguments);
            }
            TouchEvent.createSimpleTouchEvent = function (identifier, x, y) {
                if (!this.touchTargetPool)
                    this.touchTargetPool = {};
                var result = this.touchTargetPool[identifier];
                if (!result) {
                    result = this.touchTargetPool[identifier] = {
                        indentifier: identifier,
                        x: x,
                        y: y
                    };
                }
                return result;
            };
            TouchEvent.TOUCH_BEGIN = "canvasTOUCH_BEGIN";
            TouchEvent.TOUCH_END = "canvasTOUCH_END";
            TouchEvent.TOUCH_TAP = "canvasTOUCH_TAP";
            return TouchEvent;
        })(alcedo.Event);
        canvas.TouchEvent = TouchEvent;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Vector2D = (function () {
            function Vector2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                //super();
                this.x = x;
                this.y = y;
            }
            Vector2D.identity = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                Vector2D._identity.reset(x, y);
                return Vector2D._identity;
            };
            //四则运算
            /** 加 **/
            Vector2D.prototype.add = function (vector) {
                this.x += vector.x;
                this.y += vector.y;
                return this;
            };
            /** 减 **/
            Vector2D.prototype.subtract = function (vector) {
                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            };
            /** 乘 **/
            Vector2D.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                return this;
            };
            /** 除 **/
            Vector2D.prototype.divide = function (vector) {
                this.x /= vector.x;
                this.y /= vector.y;
                return this;
            };
            Object.defineProperty(Vector2D.prototype, "length", {
                get: function () {
                    if (this.x == 0 && this.y == 0)
                        return 0;
                    var result = Math.sqrt(this.x * this.x + this.y * this.y);
                    if (isNaN(result)) {
                        result = 0;
                    }
                    return result;
                },
                /**
                 * 矢量对象长度
                 */
                set: function (value) {
                    var length = this.length;
                    if (length === 0) {
                        this.x = 1;
                        length = 1;
                    }
                    length = value / length;
                    this.x *= length;
                    this.y *= length;
                },
                enumerable: true,
                configurable: true
            });
            //转换为单位向量
            Vector2D.prototype.unitlize = function () {
                this.length = 1;
                return this;
            };
            Object.defineProperty(Vector2D.prototype, "deg", {
                get: function () {
                    //TODO:x,y更新时才需要重新计算 , PS 我也不知道什么要-270哦
                    return -(Math.atan2(this.x, this.y) * canvas.Constant.RAD_TO_DEG).toFixed(1) + 90;
                },
                set: function (deg) {
                    var length = this.length;
                    this.x = canvas.Constant.cos(deg * canvas.Constant.DEG_TO_RAD) * length;
                    this.y = canvas.Constant.sin(deg * canvas.Constant.DEG_TO_RAD) * length;
                    //trace(this.x,this.y);
                },
                enumerable: true,
                configurable: true
            });
            //法向量角
            Vector2D.prototype.toNormalDeg = function (left) {
                return this.deg - (left ? 90 : (-90));
            };
            Vector2D.prototype.toRad = function () {
                return 0;
            };
            /**
             * 克隆矢量对象
             */
            Vector2D.prototype.clone = function () {
                return new Vector2D(this.x, this.y);
            };
            Vector2D.prototype.reset = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
                return this;
            };
            Vector2D.prototype.resetAs = function (vector) {
                if (vector === this)
                    return this;
                this.x = vector.x;
                this.y = vector.y;
                return this;
            };
            Vector2D.prototype.resetToDeg = function (deg) {
                var length = this.length;
                if (length === 0) {
                    return;
                }
                this.x = canvas.Constant.cos(deg * canvas.Constant.DEG_TO_RAD);
                this.y = canvas.Constant.sin(deg * canvas.Constant.DEG_TO_RAD);
                this.length = length;
            };
            /**
             * 从两个点创建适量对象
             */
            Vector2D.createFromPoint = function (start, end) {
                return new Vector2D(end.x - start.x, end.y - start.y);
            };
            /**
             * 从一个角度创建向量
             */
            Vector2D.createFromDeg = function (deg, length) {
                if (length === void 0) { length = 1; }
                return new Vector2D(canvas.Constant.cos(deg), canvas.Constant.sin(deg));
            };
            Vector2D._identity = new Vector2D();
            return Vector2D;
        })();
        canvas.Vector2D = Vector2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                //super();
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Rectangle.identity = function (rect_or_x, y, width, height) {
                if (rect_or_x === void 0) { rect_or_x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                if (typeof rect_or_x == "number") {
                    return Rectangle._identity.reset(rect_or_x, y, width, height);
                }
                else {
                    return Rectangle._identity.resetAs(rect_or_x);
                }
            };
            Object.defineProperty(Rectangle.prototype, "right", {
                /**
                 * x 和 width 属性的和。
                 */
                get: function () {
                    return this.x + this.width;
                },
                set: function (value) {
                    this.width = value - this.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "bottom", {
                /**
                 * y 和 height 属性的和。
                 */
                get: function () {
                    return this.y + this.height;
                },
                set: function (value) {
                    this.height = value - this.y;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            Rectangle.prototype.reset = function (x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                return this;
            };
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            Rectangle.prototype.resetAs = function (rectangle) {
                this.x = rectangle.x;
                this.y = rectangle.y;
                this.width = rectangle.width;
                this.height = rectangle.height;
                return this;
            };
            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
             */
            Rectangle.prototype.contains = function (point) {
                var result = (this.x < point.x && this.x + this.width > point.x && this.y < point.y && this.y + this.height > point.y);
                return result;
            };
            /**
             * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
             */
            Rectangle.prototype.hitRectangelTest = function (toHit) {
                return Math.max(this.x, toHit.x) <= Math.min(this.right, toHit.right) && Math.max(this.y, toHit.y) <= Math.min(this.bottom, toHit.bottom);
            };
            /**
             * 克隆矩形对象
             */
            Rectangle.prototype.clone = function () {
                return new Rectangle(this.x, this.y, this.width, this.height);
            };
            /** 乘 **/
            Rectangle.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                this.width *= vector.x;
                this.height *= vector.y;
                return this;
            };
            /** 除 **/
            Rectangle.prototype.divide = function (vector) {
                this.x /= vector.x;
                this.y /= vector.y;
                this.width /= vector.x;
                this.height /= vector.y;
                return this;
            };
            /**
             * 静态方法
             */
            //从4个点生成一个最大包围矩形
            Rectangle.rectangleFromFourPoint = function (p1, p2, p3, p4, saveRectt) {
                var __x = Math.min(p1.x, p2.x, p3.x, p4.x);
                var __y = Math.min(p1.y, p2.y, p3.y, p4.y);
                var __x_r = Math.max(p1.x, p2.x, p3.x, p4.x);
                var __y_b = Math.max(p1.y, p2.y, p3.y, p4.y);
                //trace(p1.x,p2.x,p3.x,p4.x)
                if (saveRectt) {
                    saveRectt.reset(__x, __y, (__x_r - __x), (__y_b - __y));
                }
                else {
                    saveRectt = new Rectangle(__x, __y, (__x_r - __x), (__y_b - __y));
                }
                return saveRectt;
            };
            Rectangle._identity = new Rectangle();
            return Rectangle;
        })();
        canvas.Rectangle = Rectangle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        var _rcssprop = /^(\d+\.?\d+)(\w+)$/i;
        var DomElement = (function (_super) {
            __extends(DomElement, _super);
            function DomElement(ele) {
                _super.call(this);
                this._node = ele; //this.init(selector);
                if (this._node) {
                    this._apid = +(ele.getAttribute("data-" + dom._elemark));
                    this._designedcss = this.abscss();
                    this._domEventnotify = new Dict();
                    if (this.tagname != "body")
                        this.initevent();
                }
            }
            DomElement.prototype.initevent = function () {
                var _this = this;
                //TODO:点击事件可能会有BUG,待优化.
                var touchcallback = function (e, fn) {
                    e.preventDefault();
                    e.stopPropagation();
                    fn.call(_this, e);
                };
                this._node.addEventListener("mousedown", function (e) {
                    touchcallback(e, _this._onmouse);
                }, false);
                this._node.addEventListener("mouseup", function (e) {
                    touchcallback(e, _this._onmouse);
                }, false);
                this._node.addEventListener("click", function (e) {
                    touchcallback(e, _this._onmouse);
                }, false);
                this._node.addEventListener("mouseenter", function (e) {
                    touchcallback(e, _this._onmouse);
                }, false);
                this._node.addEventListener("mouseleave", function (e) {
                    touchcallback(e, _this._onmouse);
                }, false);
                this._node.addEventListener("touchstart", function (e) {
                    touchcallback(e, _this.ontouchbegin);
                }, false);
                this._node.addEventListener("touchmove", function (e) {
                    touchcallback(e, _this.ontouchmove);
                }, false);
                this._node.addEventListener("touchend", function (e) {
                    touchcallback(e, _this.ontouchend);
                }, false);
                this._node.addEventListener("touchcancel", function (e) {
                    touchcallback(e, _this.ontouchend);
                }, false);
                this._node.addEventListener("tap", function (e) {
                    touchcallback(e, _this.ontouchtap);
                }, false);
                this._node.addEventListener("DOMSubtreeModified", this._onmodified.bind(this));
                this._node.addEventListener('transitionend', this._oncsstransitionend.bind(this), false);
                this._node.addEventListener("webkitTransitionEnd", this._oncsstransitionend.bind(this), false);
            };
            /**
             * Event
             **/
            /**
             * Touch事件
             **/
            DomElement.prototype.emitTouchEvent = function (e, event) {
                if (e.changedTouches) {
                    var l = e.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        var touchtarget = e.changedTouches[i];
                        touchtarget.type = event;
                        this.emit(event, e.changedTouches[i]);
                    }
                }
            };
            //private _touchObserver:any;
            DomElement.prototype.ontouchbegin = function (e) {
                this.emitTouchEvent(e, dom.TouchEvent.TOUCH_BEGIN);
            };
            DomElement.prototype.ontouchmove = function (e) {
                //this.emit(TouchEvent.TOUCH_MOVE)
                //if (Math.abs(e.touches[0].clientX - this._touchObserver.startx) > 20
                //    || Math.abs(e.touches[0].clientY - this._touchObserver.starty) > 20) {
                //    this._touchObserver.moved = true;
                //    this._touchObserver.lastx = e.touches[0].clientX - this._touchObserver.startx;
                //    this._touchObserver.lasty = e.touches[0].clientY - this._touchObserver.starty;
                //}
            };
            DomElement.prototype.ontouchend = function (e) {
                this.emitTouchEvent(e, dom.TouchEvent.TOUCH_END);
                var lasttouch, l = e.changedTouches.length;
                for (var i = 0; i < l; i++) {
                    lasttouch = e.changedTouches[i];
                    if (alcedo.d$.compare(this._node, document.elementFromPoint(lasttouch.clientX, lasttouch.clientY))) {
                        var evt;
                        if (window["CustomEvent"]) {
                            evt = new window["CustomEvent"]('tap', {
                                bubbles: true,
                                cancelable: true
                            });
                        }
                        else {
                            evt = document.createEvent('Event');
                            evt.initEvent('tap', true, true);
                        }
                        evt.touchTarget = lasttouch;
                        evt.touchTarget.type = dom.TouchEvent.TOUCH_TAP;
                        //e.stopPropagation();
                        if (!e.target.dispatchEvent(evt)) {
                            e.preventDefault();
                        }
                    }
                }
            };
            DomElement.prototype.ontouchtap = function (e) {
                this.emit(dom.TouchEvent.TOUCH_TAP, e.touchTarget);
            };
            DomElement.prototype._onmouse = function (e) {
                //trace("_onmouse",e);
            };
            DomElement.prototype._onmodified = function (e) {
                //console.log(e);
            };
            DomElement.prototype._oncsstransitionend = function (e) {
                var _this = this;
                if (!this._csstransitionSleep) {
                    this._csstransitionSleep = true;
                    this.emit(dom.StyleEvent.TRAN_SITION_END);
                    //trace(this.apid,this._lastindex,this.index());
                    this.index = this._lastindex;
                }
                setTimeout(function () {
                    _this._csstransitionSleep = false; //防止重复出发transitionend事件,在下个时间点再允许事件触发
                }, 20);
            };
            /**
             * CSS style
             */
            DomElement.prototype.hasClass = function (className) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return !!this._node.className.match(reg);
            };
            DomElement.prototype.addClass = function (className) {
                if (!this.hasClass(className)) {
                    this._node.className += " " + className;
                }
            };
            DomElement.prototype.removeClass = function (className) {
                if (this.hasClass(className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    this._node.className = this._node.className.replace(reg, '');
                }
            };
            Object.defineProperty(DomElement.prototype, "styleClass", {
                //public get style():any{return this._node.style}
                get: function () {
                    this._node.className = this._node.className.replace('  ', ' ');
                    var result = this.node.className.split(" ");
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            DomElement.prototype.css = function (cssprops) {
                if (cssprops) {
                    for (var prop in cssprops) {
                        this._node.style[prop + ""] = cssprops[prop + ""];
                    }
                }
                return this;
            };
            DomElement.prototype.getcsspropvalue = function (name) {
                //var result:any = this.css()[name];
                var result = this.node.style[name];
                if (!result || result == "auto")
                    result = this.abscss()[name];
                return result;
            };
            DomElement.prototype.abscss = function () {
                var result;
                if (window.getComputedStyle) {
                    result = window.getComputedStyle(this._node, null);
                }
                else {
                    result = this._node.style;
                }
                return result;
            };
            DomElement.prototype.width = function () {
                return this.getcsspropvalue("width");
            };
            DomElement.prototype.height = function () {
                return this.getcsspropvalue("height");
            };
            DomElement.prototype.show = function () {
                //console.log("show",this,this._display);
                if (this._display) {
                    this.css({ display: this._display });
                }
                else {
                    this.css({ display: "block" });
                }
                //this.transition = this._lasttransition;
                return this;
            };
            DomElement.prototype.hide = function () {
                this._display = this.abscss().display;
                //console.log("hide",this,this._display);
                this.css({ display: "none" });
                return this;
            };
            Object.defineProperty(DomElement.prototype, "index", {
                get: function () {
                    var result = this.node.style["z-index"];
                    if (!result)
                        result = this.abscss()["z-index"];
                    return result;
                },
                set: function (index) {
                    this.css({ "z-index": index });
                },
                enumerable: true,
                configurable: true
            });
            //CSS3动画效果
            DomElement.prototype.to = function (cssprops, transition) {
                if (transition === void 0) { transition = 660; }
                if (this._lastindex != this.index)
                    this._lastindex = this.index;
                this.transition = transition;
                this.css(cssprops);
                return this;
            };
            DomElement.prototype.rotate = function (angle, transition) {
                if (transition === void 0) { transition = 660; }
                this.transition = transition;
                if (angle == 0 || angle || angle != this._rotation) {
                    var rotate = angle; // - this._rotation;
                    //trace(this._rotation);
                    this._node.style.transform = "rotate(" + angle + "deg)";
                    this._node.style["-webkit-transform"] = "rotate(" + angle + "deg)";
                    this._rotation = rotate;
                }
                return this;
            };
            DomElement.prototype.scale = function (scale, transition) {
                if (transition === void 0) { transition = 660; }
                this.transition = transition;
                this._node.style.transform = "scale(" + scale + "," + scale + ")";
                this._node.style["-webkit-transform"] = "scale(" + scale + "," + scale + ")";
                return this;
            };
            DomElement.prototype.translate = function (x, y, transition) {
                if (transition === void 0) { transition = 660; }
                this.transition = transition;
                this._node.style.transform = "translate(" + x + "px," + y + "px)";
                this._node.style["-webkit-transform"] = "translate(" + x + "px," + y + "px)";
                return this;
            };
            Object.defineProperty(DomElement.prototype, "transition", {
                set: function (ms) {
                    if (ms <= 0 || !ms) {
                        delete this._node.style["transition-duration"];
                        delete this._node.style["-webkit-transition-duration"];
                    }
                    else {
                        this._node.style["transition-duration"] = ms + "ms";
                        this._node.style["-webkit-transition-duration"] = ms + "ms";
                    }
                    this._lasttransition = ms;
                },
                enumerable: true,
                configurable: true
            });
            DomElement.prototype.then = function (fn, waittime_ms) {
                var _this = this;
                if (waittime_ms === void 0) { waittime_ms = 0; }
                this.addEventListener(dom.StyleEvent.TRAN_SITION_END, function () {
                    _this.removeEventListener(dom.StyleEvent.TRAN_SITION_END, arguments.callee, _this);
                    //trace("lastindex",this._lastindex)
                    //this.index(this._lastindex);
                    if (waittime_ms > 100) {
                        setTimeout(fn, waittime_ms, _this);
                    }
                    else {
                        fn(_this);
                    }
                }, this);
            };
            /**
             * Html Document Object Model
             */
            DomElement.prototype.appendChild = function (ele) {
                this.node.appendChild(ele.node);
                return ele;
            };
            DomElement.prototype.prependChild = function (ele) {
                this.node.insertBefore(ele.node, this.node.children[0]);
                return ele;
            };
            DomElement.prototype.insertBefore = function (ele) {
                ele.node.parentElement.insertBefore(this.node, ele.node);
                return ele;
            };
            DomElement.prototype.removeChild = function (ele) {
                this.node.removeChild(ele.node);
                return ele;
            };
            DomElement.prototype.parent = function () {
                var parent;
                if (this._node.parentElement) {
                    parent = alcedo.d$.query(this._node.parentElement)[0];
                }
                return parent;
            };
            DomElement.prototype.find = function (selector) {
                var results = [], eles = Sizzle(selector, this.node);
                for (var i = 0; i < eles.length; i++) {
                    results.push(alcedo.d$.htmlele2domele(eles[i]));
                }
                return results;
            };
            DomElement.prototype.innerContent = function (anything) {
                this.node.innerText = anything;
            };
            /**
             * Html Document Object Model Data
             */
            DomElement.prototype.data = function (key, value) {
                if (value)
                    this._node.setAttribute("data-" + key, value);
                return this._node.getAttribute("data-" + key);
            };
            Object.defineProperty(DomElement.prototype, "id", {
                get: function () {
                    return this._node.id;
                },
                set: function (id) {
                    if (!document.getElementById(id) || alcedo.d$.compare(this._node, document.getElementById(id))) {
                        this._node.id = id;
                    }
                    else {
                        warn("duplicate id assignment. ", id);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "apid", {
                get: function () {
                    return this._apid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "node", {
                get: function () {
                    return this._node;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "tagname", {
                get: function () {
                    return this.node.nodeName.toLowerCase();
                },
                enumerable: true,
                configurable: true
            });
            return DomElement;
        })(alcedo.EventDispatcher);
        dom.DomElement = DomElement;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        var DomEvents = (function (_super) {
            __extends(DomEvents, _super);
            function DomEvents() {
                _super.apply(this, arguments);
            }
            DomEvents.ON_FOCUS = "dom_ON_FOCUS";
            DomEvents.ON_LOST_FOCUS = "dom_ON_LOST_FOCUS";
            return DomEvents;
        })(alcedo.Event);
        dom.DomEvents = DomEvents;
        var StyleEvent = (function (_super) {
            __extends(StyleEvent, _super);
            function StyleEvent() {
                _super.apply(this, arguments);
            }
            StyleEvent.TRAN_SITION_END = "dom_webkitTransitionEnd";
            return StyleEvent;
        })(alcedo.Event);
        dom.StyleEvent = StyleEvent;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/4.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        var TouchEvent = (function (_super) {
            __extends(TouchEvent, _super);
            function TouchEvent() {
                _super.apply(this, arguments);
            }
            TouchEvent.TOUCH_BEGIN = "dom_touchbegin";
            TouchEvent.TOUCH_END = "dom_touchend";
            TouchEvent.TOUCH_TAP = "dom_touchtap";
            return TouchEvent;
        })(alcedo.Event);
        dom.TouchEvent = TouchEvent;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var AsyncRESEvent = (function (_super) {
            __extends(AsyncRESEvent, _super);
            function AsyncRESEvent() {
                _super.apply(this, arguments);
            }
            AsyncRESEvent.ASSETS_COMPLETE = "AsyncAssetsEvent_LOAD_COMPLETE";
            AsyncRESEvent.ASSETS_PROGRESSING = "AsyncAssetsEvent_LOAD_ASSETS_PROGRESSING";
            return AsyncRESEvent;
        })(alcedo.Event);
        net.AsyncRESEvent = AsyncRESEvent;
        var AsyncRES = (function (_super) {
            __extends(AsyncRES, _super);
            function AsyncRES() {
                _super.call(this);
                this._assetspool = new Dict();
                this._repeatkey = {};
            }
            AsyncRES.prototype.set = function (key, value) {
                if (this._assetspool.has(key)) {
                    var tmp = this._assetspool.get(key);
                    if (Array.isArray(tmp)) {
                        tmp.push(value);
                        this._assetspool.set(key, tmp);
                    }
                }
                else {
                    this._assetspool.set(key, [value]);
                }
            };
            AsyncRES.prototype.get = function (key) {
                return this._assetspool.get(key);
            };
            AsyncRES.prototype.find = function (reg) {
                var i, keys = this._assetspool.keys, result = [];
                for (i = 0; i < keys.length; i++) {
                    if (reg.test(keys[i])) {
                        if (this.get(keys[i]))
                            result.push(this.get(keys[i])[0]);
                    }
                }
                return result;
            };
            Object.defineProperty(AsyncRES.prototype, "assets", {
                get: function () {
                    return this._assetspool.values;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AsyncRES.prototype, "keys", {
                get: function () {
                    return this._assetspool.keys;
                },
                enumerable: true,
                configurable: true
            });
            AsyncRES.instanceable = true;
            return AsyncRES;
        })(alcedo.AppProxyer);
        net.AsyncRES = AsyncRES;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppCycler = (function (_super) {
        __extends(AppCycler, _super);
        function AppCycler() {
            _super.call(this);
            alcedo.AppFacade.instance.app = this;
            //GameFacade.instance['_cmdPostals'].setRoute(notify.CMD.GameReady,this,this.onReady);
            this.addCmdHandler(alcedo.AppLauncher.START_UP, this.cmdStartup);
            alcedo.launch(true);
        }
        AppCycler.prototype.cmdStartup = function () {
            var courier = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                courier[_i - 0] = arguments[_i];
            }
        };
        return AppCycler;
    })(alcedo.AppCmder);
    alcedo.AppCycler = AppCycler;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    var FacadeEvent = (function (_super) {
        __extends(FacadeEvent, _super);
        function FacadeEvent() {
            //:your code here
            _super.call(this, FacadeEvent.UNIQUE);
        }
        FacadeEvent.prototype.setNotify = function (com, notify, courier) {
            this._com = alcedo.AppFacade.getCommandId(com);
            this._notify = notify;
            this._courier = courier;
        };
        Object.defineProperty(FacadeEvent.prototype, "com", {
            get: function () {
                return this._com;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FacadeEvent.prototype, "notify", {
            get: function () {
                return this._notify;
            },
            enumerable: true,
            configurable: true
        });
        FacadeEvent.UNIQUE = 'facadeEvent0811';
        return FacadeEvent;
    })(alcedo.Event);
    alcedo.FacadeEvent = FacadeEvent;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var Art;
(function (Art) {
    function toColorString(value) {
        if (isNaN(value) || value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;
        var color = value.toString(16).toUpperCase();
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }
    Art.toColorString = toColorString;
})(Art || (Art = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 */
/**
 * Created by tommyZZM on 2015/4/28.
 */
//定义一个快捷扩展对象属性的方法 
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var dstruct;
    (function (dstruct) {
        var QuadTree = (function () {
            function QuadTree() {
            }
            return QuadTree;
        })();
        dstruct.QuadTree = QuadTree;
    })(dstruct = alcedo.dstruct || (alcedo.dstruct = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    /**
     * 异步流程控制,beta版
     */
    var AsyncQuener = (function (_super) {
        __extends(AsyncQuener, _super);
        function AsyncQuener() {
            _super.call(this);
            this.finishmark = "_____finish";
        }
        AsyncQuener.prototype.prepush = function (fns) {
            var _this = this;
            var fnarr = [], fn, _fn;
            var index = this._query.length;
            for (var i in fns) {
                fn = fns[i];
                //console.log(fn);
                if (fn instanceof Function) {
                    _fn = expandMethod(fn, function () {
                        arguments.callee["_origin"]();
                        _this.check2next(arguments.callee["_index"]);
                    });
                    _fn["_index"] = index;
                    fns[i] = _fn;
                    fnarr.push(_fn);
                }
            }
            this.push(fnarr);
        };
        AsyncQuener.prototype.push = function (fnarr) {
            this._querycount.push(fnarr.length);
            this._query.push(fnarr);
        };
        AsyncQuener.prototype.check2next = function (index) {
            if (this._querycount[index]) {
                this._querycount[index]--;
                if (this._querycount[index] == 0) {
                    if (this._query[index + 1]) {
                        var length = this._query[index + 1].length;
                        for (var i = 0; i < length; i++) {
                            var fn = this._query[index + 1][i];
                            fn();
                        }
                    }
                    else {
                        this.end();
                    }
                }
            }
            else {
                this.end();
            }
        };
        AsyncQuener.begin = function (fns) {
            var quener = (alcedo.proxy(alcedo.AppObjectPool).new(AsyncQuener));
            quener.prepush(fns);
            return quener;
        };
        AsyncQuener.prototype.then = function (fns) {
            if (fns instanceof Function) {
                fns = [fns];
            }
            this.prepush(fns);
            return this;
        };
        AsyncQuener.prototype.end = function () {
            alcedo.proxy(alcedo.AppObjectPool).destory(this);
        };
        AsyncQuener.prototype.onCreate = function () {
            this._query = [];
            this._querycount = [];
        };
        AsyncQuener.prototype.onDestory = function () {
            this._query = [];
            this._querycount = [];
        };
        return AsyncQuener;
    })(alcedo.AppObject);
    alcedo.AsyncQuener = AsyncQuener;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var encrypt;
    (function (encrypt) {
        var SimpleEncode = (function () {
            function SimpleEncode() {
            }
            SimpleEncode.encode = function (str) {
                var byteArray = new Uint8Array(str.length * 3);
                var offset = 0;
                for (var i = 0; i < str.length; i++) {
                    var charCode = str.charCodeAt(i);
                    var codes;
                    if (charCode <= 0x7f) {
                        codes = [charCode];
                    }
                    else if (charCode <= 0x7ff) {
                        codes = [0xc0 | (charCode >> 10), 0x80 | (charCode & 0x3f)];
                    }
                    else {
                        codes = [0xe0 | (charCode >> 20), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
                    }
                    for (var j = 0; j < codes.length; j++) {
                        byteArray[offset] = codes[j];
                        ++offset;
                    }
                }
                var result = [];
                for (var i = 0; i < byteArray.length; i++) {
                    result.push(byteArray[i]);
                }
                for (var i = result.length - 1; i > 0; i--) {
                    if (result[i] == 0) {
                        result.splice(i, 1);
                    }
                }
                return result;
            };
            SimpleEncode.decode = function (_bytes) {
                for (var i = _bytes.length - 1; i > 0; i--) {
                    if (_bytes[i] == 0) {
                        _bytes.splice(i, 1);
                    }
                }
                var bytes = new Uint8Array(_bytes);
                var array = [];
                var offset = 0;
                var charCode = 0;
                var end = bytes.length;
                while (offset < end) {
                    if (bytes[offset] < 128) {
                        charCode = bytes[offset];
                        offset += 1;
                    }
                    else if (bytes[offset] < 224) {
                        charCode = ((bytes[offset] & 0x3f) << 10) + (bytes[offset + 1] & 0x3f);
                        offset += 2;
                    }
                    else {
                        charCode = ((bytes[offset] & 0x0f) << 20) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                        offset += 3;
                    }
                    array.push(charCode);
                }
                var result = String.fromCharCode.apply(null, array);
                result.replace(" ", "");
                return result;
            };
            return SimpleEncode;
        })();
        encrypt.SimpleEncode = SimpleEncode;
        function copyArray(dest, doffset, src, soffset, length) {
            if ('function' === typeof src.copy) {
                // Buffer
                src.copy(dest, doffset, soffset, soffset + length);
            }
            else {
                for (var index = 0; index < length; index++) {
                    dest[doffset++] = src[soffset++];
                }
            }
        }
    })(encrypt = alcedo.encrypt || (alcedo.encrypt = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */
        var CanvasMainContext = (function (_super) {
            __extends(CanvasMainContext, _super);
            function CanvasMainContext(stage, canvas) {
                _super.call(this);
                this._stage = stage;
                this._designwidth = this._stage.width();
                this._designheight = this._stage.height();
                this._designw2h = this._designwidth / this._designheight;
                this._canvas = canvas;
                this._canvas.node["width"] = this._designwidth;
                this._canvas.node["height"] = this._designheight;
                this._canvascontainer = alcedo.d$.query("<div></div>")[0];
                //this._canvascontainer.id = this._canvas.id+"_container";
                this._canvascontainer.insertBefore(this._canvas);
                this._canvascontainer.appendChild(this._canvas);
                this._profiler = new _canvas.Profiler(this);
                if (this._stage.options.profiler === true) {
                    this._profiler.visible = true;
                }
                this.createui();
                this.resizecontext();
                this._stage.resizecontext = this.resizecontext.bind(this);
                this.run();
            }
            //创建dom ui;
            CanvasMainContext.prototype.createui = function () {
                var id = "";
                if (this._stage.options.ui === true) {
                    this._canvasui = alcedo.d$.query("<div></div>")[0];
                    id = this._canvas.id + "_ui";
                }
                if (typeof this._stage.options.ui == "string") {
                    this._canvasui = alcedo.d$.query("#" + this._stage.options.ui)[0];
                    id = this._stage.options.ui;
                }
                if (!this._canvasui) {
                    this._canvasui = alcedo.d$.query("<div></div>")[0];
                }
                if (this._canvasui) {
                    this._canvasui.id = id;
                    this._canvasui.insertBefore(this._canvas);
                    this._canvasui.css({ position: "absolute", overflow: "hidden", width: "100%", height: "100%" });
                    if (typeof this.canvas.index == "number") {
                        this._canvasui.css({ "z-index": Math.add(this.canvas.index, 1) });
                    }
                    else {
                        this._canvasui.css({ "z-index": 1 });
                    }
                    //在ui层底部插入control gasket, 作为canvas的控制传导垫片
                    var control_gasket = alcedo.d$.query("<div style='position: absolute;top:0;left: 0'></div>")[0];
                    control_gasket.id = this._canvas.id + "_gasket";
                    this._canvasui.appendChild(control_gasket);
                    control_gasket.css({ width: this._canvas.width(), height: this._canvas.height() });
                    this._canvasgasket = control_gasket;
                    this._canvasgasket.css({ "z-index": Math.add(this._canvasui.index, 1) });
                }
            };
            CanvasMainContext.prototype.run = function () {
                this._canvasrenderer = _canvas.CanvasRenderer.detecter(); //default 2d(cpu|webgl)
                //TODO:if webgl3d || other reset this._canvasrender
                this._canvasrenderer.executeMainLoop(this._stage, this._canvas.node);
                this._canvasrenderer.registMainLoopTask(this.mainloop, this);
                this._canvascontainer.transition = 100;
                this._canvascontainer.addEventListener(alcedo.dom.StyleEvent.TRAN_SITION_END, this.onResizeComplete, this);
                //this._stage = new Stage();
            };
            CanvasMainContext.prototype.mainloop = function (renderer) {
                this._stage._enterframe(renderer);
            };
            CanvasMainContext.prototype.resizecontext = function () {
                this._stage["_orientchanged"] = false;
                var currstylew2h = this.containerStyleW2h;
                if (this._stage.options.orient === true) {
                    if (this._designw2h > 1) {
                        if (!(currstylew2h > 1)) {
                            this._stage["_orientchanged"] = true;
                            currstylew2h = 1 / currstylew2h;
                        }
                    }
                    else {
                        if (currstylew2h > 1) {
                            this._stage["_orientchanged"] = true;
                            currstylew2h = 1 / currstylew2h;
                        }
                    }
                }
                if (currstylew2h > this._designw2h) {
                    //this._stage._stageHeight = toValue(this._canvas.abscss().height);
                    this._stage["setHeight"](this._designheight);
                    this._stage["setWidth"](this._stage._stageHeight * currstylew2h);
                }
                else {
                    this._stage["setWidth"](this._designwidth);
                    this._stage["setHeight"](this._stage._stageWidth / currstylew2h);
                }
                this._stage.emit(_canvas.Stage.RESIZE);
                this._canvas.node["width"] = this._stage.width();
                this._canvas.node["height"] = this._stage.height();
                if (this._canvasgasket) {
                    this._canvasgasket.css({ width: this._canvas.width(), height: this._canvas.height() });
                }
                //console.log("resized");
            };
            CanvasMainContext.prototype.onResizeComplete = function () {
                this._stage.emit(_canvas.Stage.RESIZED);
            };
            Object.defineProperty(CanvasMainContext.prototype, "container", {
                get: function () {
                    return this._canvascontainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "gasket", {
                get: function () {
                    return this._canvasgasket;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "canvasui", {
                get: function () {
                    return this._canvasui;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "stage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "containerStyleW2h", {
                get: function () {
                    return alcedo.toValue(this._canvas.abscss().width) / alcedo.toValue(this._canvas.abscss().height);
                },
                enumerable: true,
                configurable: true
            });
            return CanvasMainContext;
        })(alcedo.EventDispatcher);
        _canvas.CanvasMainContext = CanvasMainContext;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
        function animationFrame(callback, thisArg) {
            window.requestAnimationFrame(callback.bind(thisArg));
        }
        canvas.animationFrame = animationFrame;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TouchContext = (function (_super) {
            __extends(TouchContext, _super);
            function TouchContext(stage) {
                _super.call(this);
                this._stage = stage;
                this._gasket = stage.gasket;
                this._canvas = stage.canvas;
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                //TODO:touchmove
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
            }
            TouchContext.prototype.onTouchBegin = function (e) {
                //trace("onTouchBegin",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_BEGIN);
            };
            TouchContext.prototype.onTouchEnd = function (e) {
                //trace("onTouchEnd",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_END);
            };
            TouchContext.prototype.onTouchTab = function (e) {
                //trace("onTouchTab",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_TAP);
            };
            TouchContext.prototype.emitTouchEvent = function (e, evnet) {
                var touchseedling = canvas.TouchEvent.createSimpleTouchEvent(e.identifier, e.pageX, e.pageY);
                this._stage.emit(evnet, touchseedling);
            };
            return TouchContext;
        })(alcedo.EventDispatcher);
        canvas.TouchContext = TouchContext;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/25.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayGraphic = (function (_super) {
            __extends(DisplayGraphic, _super);
            function DisplayGraphic() {
                _super.apply(this, arguments);
            }
            //public graphic(fn:(context:CanvasRenderingContext2D|any)=>void):void{
            //    this._graphicfn = fn;
            //}
            DisplayGraphic.prototype._draw = function (renderer) {
                this._graphicfn(renderer.context);
            };
            Object.defineProperty(DisplayGraphic.prototype, "fillcolour", {
                set: function (clour) {
                    this._fillcolour = clour;
                },
                enumerable: true,
                configurable: true
            });
            return DisplayGraphic;
        })(canvas.DisplayObject);
        canvas.DisplayGraphic = DisplayGraphic;
        var graphic;
        (function (graphic) {
            var Circle = (function (_super) {
                __extends(Circle, _super);
                function Circle(x, y, r, coulour) {
                    var _this = this;
                    if (r === void 0) { r = 5; }
                    if (coulour === void 0) { coulour = "#000"; }
                    _super.call(this);
                    this._fillcolour = coulour;
                    this.x = x;
                    this.y = y;
                    this._radius = r;
                    this._graphicfn = function (context) {
                        context.beginPath();
                        context.fillStyle = _this._fillcolour;
                        context.arc(0, 0, _this._radius, 0, 2 * Math.PI, false);
                        context.closePath();
                        context.fill();
                    };
                }
                return Circle;
            })(DisplayGraphic);
            graphic.Circle = Circle;
            var Rectangle = (function (_super) {
                __extends(Rectangle, _super);
                //private _shapewidth:number;
                //private _shapeheight:number;
                function Rectangle(x, y, width, height, coulour) {
                    var _this = this;
                    if (width === void 0) { width = 100; }
                    if (height === void 0) { height = 100; }
                    if (coulour === void 0) { coulour = "#000"; }
                    _super.call(this);
                    this._fillcolour = coulour;
                    this.x = x;
                    this.y = y;
                    this.width(width);
                    this.height(height);
                    this._graphicfn = function (context) {
                        context.beginPath();
                        context.fillStyle = _this._fillcolour;
                        context.fillRect(0, 0, _this.width(), _this.height());
                        context.closePath();
                    };
                }
                return Rectangle;
            })(DisplayGraphic);
            graphic.Rectangle = Rectangle;
        })(graphic = canvas.graphic || (canvas.graphic = {}));
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var MovieClip = (function (_super) {
            __extends(MovieClip, _super);
            function MovieClip(movieclipdata) {
                _super.call(this);
                this._moveclipdata = movieclipdata;
                this._nextframeindex = 0;
                this._currframeindex = 1;
                this._totalframescount = movieclipdata.getFrames().length;
                this._frameRate = movieclipdata.getFrameRate();
                this._countdt = 1000 / this._frameRate;
                this._passtime = 0;
                this._lasttime = 0;
                this.width(this._moveclipdata.width);
                this.height(this._moveclipdata.height);
                this.gotoAndStop(1);
            }
            MovieClip.prototype._draw = function (renderer) {
                this._texture_to_render = this._currframe;
                //console.log(this._position)
                var texture = this._texture_to_render;
                if (texture && texture.bitmapData && this._alpha > 0 && this._visible) {
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);
                    var offsetX = texture._offsetX - this._moveclipdata.left;
                    var offsetY = texture._offsetY - this._moveclipdata.top;
                    var destW = Math.round(texture._sourceWidth);
                    var destH = Math.round(texture._sourceHeight);
                    renderer.context.drawImage(texture.bitmapData, texture._sourceX, texture._sourceY, texture._sourceWidth, texture._sourceHeight, offsetX, offsetY, destW, destH);
                }
            };
            MovieClip.prototype._onAdd = function () {
                _super.prototype._onAdd.call(this);
                this.setPlayState(this._playstatetmp); //防止在add到stage之前执行playstate;
            };
            MovieClip.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                var result = this._root.viewPort().hitRectangelTest(this.actualBound());
                return result;
            };
            /**
             * MovieClip API
             */
            MovieClip.prototype.play = function (playtimes) {
                if (playtimes === void 0) { playtimes = 0; }
                this._playtotag = -1;
                this._isPlaying = true;
                this.setPlayTimes(playtimes);
                this.setPlayState(true);
            };
            MovieClip.prototype.stop = function () {
                this._playtotag = -1;
                this._isPlaying = false;
                this.setPlayState(false);
            };
            //TODO:supprot label
            MovieClip.prototype.gotoAndPlay = function (frame, playTimes) {
                if (playTimes === void 0) { playTimes = 0; }
                this.play(playTimes);
                this.gotoFrame(+frame);
            };
            MovieClip.prototype.gotoAndStop = function (frame) {
                this.stop();
                this.gotoFrame(+frame);
            };
            MovieClip.prototype.playToAndStop = function (frame, playtimes) {
                if (playtimes === void 0) { playtimes = 0; }
                this._playtotag = this.selectFrame(frame);
                this.setPlayTimes(playtimes);
                this.setPlayState(true);
            };
            MovieClip.prototype.stopAt = function (frame) {
                this._playtotag = this.selectFrame(frame);
            };
            MovieClip.prototype.setPlayTimes = function (value) {
                if (value === 0)
                    value = -1;
                if (value < 0 || value >= 1) {
                    this._playTimes = value < 0 ? -1 : Math.floor(value);
                }
            };
            MovieClip.prototype.gotoFrame = function (index) {
                var _index = this.selectFrame(index);
                if (this._nextframeindex === _index) {
                    return;
                }
                this._nextframeindex = _index;
                this._updateCurrFrame();
            };
            MovieClip.prototype.selectFrame = function (index) {
                var result = index;
                if (result > this._totalframescount) {
                    result = this._totalframescount;
                }
                else if (result < 1 || !result) {
                    result = 1;
                }
                return result;
            };
            MovieClip.prototype._frameRateControl = function (e) {
                var countdt = this._countdt, currtime = this._passtime + e.dt;
                this._passtime = currtime % countdt;
                var delay = currtime / countdt;
                if (delay < 1) {
                    return;
                }
                delay = delay ^ 0;
                this._nextframeindex += delay;
                if (this._nextframeindex > this._totalframescount) {
                    this._playTimes--;
                    if (this._playtotag < 1) {
                        if (this._playTimes == -2) {
                            this._playTimes++;
                            this._nextframeindex = 1;
                        }
                        else if (this._playTimes > 0) {
                            this._nextframeindex = 1;
                        }
                        else {
                            this._nextframeindex = this._totalframescount;
                            this.stop();
                        }
                    }
                    else {
                        this._nextframeindex = 1;
                    }
                }
                if (this._playtotag >= 1) {
                    //trace(this._playTimes)
                    if (this._playTimes <= 0) {
                        if (this._nextframeindex == this._playtotag) {
                            this.stop();
                            this._playtotag = -1;
                        }
                    }
                }
                this._updateCurrFrame();
            };
            MovieClip.prototype._updateCurrFrame = function () {
                this._currframeindex = this._nextframeindex;
                var currframe = this._currframeindex - 1;
                this._currframe = this._moveclipdata.getFrame(currframe);
            };
            MovieClip.prototype.setPlayState = function (value) {
                if (this._playstate == value) {
                    return;
                }
                if (!this.isAddtoStage()) {
                    this._playstatetmp = value;
                    trace("'[dev]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if (value) {
                    this._stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10, this._frameRateControl, this, Number.NEGATIVE_INFINITY);
                }
                else {
                    this._stage.removeEventListener(canvas.Stage.ENTER_MILLSECOND10, this._frameRateControl, this);
                }
            };
            return MovieClip;
        })(canvas.DisplayObject);
        canvas.MovieClip = MovieClip;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/10.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            //protected _visualboundingbox:Rectangle;//可视包围盒
            function Sprite(texture) {
                _super.call(this);
                if (texture) {
                    this.texture = texture;
                }
            }
            Sprite.prototype._draw = function (renderer) {
                //if(!this.isInViewPort())return;
                this._texture_to_render = this._texture;
                //console.log(this._position)
                if (this._texture_to_render && this._texture_to_render.bitmapData && this._alpha > 0 && this._visible) {
                    renderer.context.drawImage(this._texture_to_render.bitmapData, this._texture_to_render._sourceX, this._texture_to_render._sourceY, this._texture_to_render._sourceWidth, this._texture_to_render._sourceHeight);
                }
            };
            Object.defineProperty(Sprite.prototype, "texture", {
                get: function () {
                    return this._texture;
                },
                set: function (texture) {
                    this._texture = texture;
                    this.width(this._texture._sourceWidth);
                    this.height(this._texture._sourceHeight);
                    //this._visualboundingbox = this._staticboundingbox.clone();
                },
                enumerable: true,
                configurable: true
            });
            Sprite.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                var result = this._root.viewPort().hitRectangelTest(this.actualBound());
                return result;
            };
            return Sprite;
        })(canvas.DisplayObject);
        canvas.Sprite = Sprite;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            //private _tweens:Tweens;
            function Stage(canvas, width, height, opts) {
                if (width === void 0) { width = 320; }
                if (height === void 0) { height = 480; }
                if (opts === void 0) { opts = {}; }
                _super.call(this);
                this._startTime = 0;
                this._lastTime = 0;
                this.setWidth(width);
                this.setHeight(height);
                this._options = opts;
                this.initcomponent();
                this._maincontext = new _canvas.CanvasMainContext(this, canvas);
                this.initcontext();
            }
            Stage.prototype.width = function () {
                return this._staticboundingbox.width;
            };
            Stage.prototype.setWidth = function (width) {
                this._staticboundingbox.width = width;
                this._stageWidth = width;
            };
            Stage.prototype.height = function () {
                return this._staticboundingbox.height;
            };
            Stage.prototype.setHeight = function (height) {
                this._staticboundingbox.height = height;
                this._stageHeight = height;
            };
            Stage.prototype.initcomponent = function () {
                this._ticker = new _canvas.Ticker(this);
                this._camera = new _canvas.Camera2D(this);
                //this._tweens = (new Tweens()).init(this);
                this._startTime = Date.now();
            };
            Stage.prototype.initcontext = function () {
                this._touchcontext = new _canvas.TouchContext(this);
            };
            Stage.prototype.render = function (renderer) {
                this._render(renderer);
            };
            Stage.prototype._transform = function () {
                var wt = this._worldtransform;
                wt.identity();
                this._getMatrix(wt);
                this.eachChilder(function (child) {
                    child._transform();
                });
            };
            Stage.prototype._nowTime = function () {
                return Date.now() - this._startTime;
            };
            /** @deprecated dont use outside*/
            Stage.prototype._enterframe = function (renderer) {
                var nowTime = this._nowTime();
                var dt = nowTime - this._lastTime;
                //TODO:广播EnterFrame;
                this.notify(this._notifymap, Stage.ENTER_FRAME, [{ dt: dt, renderer: renderer }]);
                this.emit(Stage.ENTER_FRAME, { dt: dt });
                this._lastTime = nowTime;
            };
            Stage.prototype.enterframe = function (callback, thisOBject) {
                this.registNotify(this._notifymap, Stage.ENTER_FRAME, callback, thisOBject);
            };
            Object.defineProperty(Stage.prototype, "canvas", {
                get: function () {
                    return this._maincontext.canvas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "gasket", {
                get: function () {
                    return this._maincontext.gasket;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "canvasui", {
                get: function () {
                    return this._maincontext.canvasui;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "options", {
                get: function () {
                    return this._options;
                },
                enumerable: true,
                configurable: true
            });
            Stage.prototype.resizecontext = function () {
            }; //Dont Remove!! 该方法会在CanvasMainCOntext被覆盖重写,
            Object.defineProperty(Stage.prototype, "orientchanged", {
                get: function () {
                    return this._orientchanged;
                },
                enumerable: true,
                configurable: true
            });
            Stage.prototype.viewPort = function () {
                return this._camera.viewsafe();
            };
            Stage.prototype.camera = function () {
                return this._camera;
            };
            Stage.prototype.isInViewPort = function () {
                return true;
                //nothing
            };
            Stage.prototype.addChild = function (child) {
                if (child instanceof Stage)
                    return; //todo:error log here;
                _super.prototype.addChild.call(this, child);
            };
            Stage.ENTER_FRAME = "Stage_ENTER_FRAME";
            Stage.ENTER_MILLSECOND10 = "Stage_ENTER_20MILLSECOND";
            Stage.ENTER_SECOND = "Stage_ENTER_SECOND";
            Stage.RESIZED = "Stage_RESIZED";
            Stage.RESIZE = "Stage_RESIZE";
            return Stage;
        })(_canvas.DisplatObjectContainer);
        _canvas.Stage = Stage;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 * 一枚单独的栗子
 * 栗子的生命周期 create prebron alive decaying decay
 *
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Particle = (function () {
            function Particle() {
                this.rotation = 0;
                this.alpha = 1;
                this._mass = 1; //质量哦
                this._onDecayTask = [];
                this.position = new canvas.Vector2D();
                this.scale = new canvas.Vector2D(1, 1);
                this.pivot = new canvas.Vector2D();
                this._velocity = new canvas.Vector2D();
                this._acceleration = new canvas.Vector2D();
                this.worldtransform = new canvas.Matrix2D();
                this.create(0, 0);
            }
            Particle.prototype.scaleAll = function (value) {
                this.scale.x = value;
                this.scale.y = value;
            };
            Particle.prototype._stagetransform = function (stage) {
                this.worldtransform.identityMatrix(stage.worldtransform);
            };
            Particle.prototype._transform = function () {
                //this.worldtransform.identityMatrix(Matrix2D.identity);
                this.worldtransform.appendTransform(this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation, 0, 0, this.pivot.x, this.pivot.y);
            };
            Particle.prototype._draw = function (renderer) {
                var context = renderer.context;
                context.beginPath();
                context.arc(0, 0, 6, 0, 2 * Math.PI, false);
                context.fillStyle = '#95a5a6';
                context.fill();
                context.lineWidth = 3;
                context.strokeStyle = '#2c3e50';
                context.stroke();
            };
            /**
             * [控制栗子运动的接口]
             * 给栗子施加一个力
             * @param vector
             */
            Particle.prototype.applyForce = function (vector) {
                this._velocity.add(vector.divide(canvas.Vector2D.identity(this._mass, this._mass)));
            };
            /**
             * 栗子生命周期开始
             * @param x
             * @param y
             * @param mass
             * @param preserve
             */
            Particle.prototype.create = function (x, y, mass) {
                if (mass === void 0) { mass = 1; }
                var preserve = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    preserve[_i - 3] = arguments[_i];
                }
                this.position.reset(x, y);
                this.scale.reset(1, 1);
                this.rotation = 0;
                this._velocity.reset();
                this._acceleration.reset();
                this._currtime = 0;
                this._lifetime = 60000;
                this._onDecayTask = [];
                this.alpha = 1;
                this._mass = mass;
                this._isdecayed = false;
                this._currphase = 0;
                this._lifephase = [this.prebron, this.alive, this.decaying];
            };
            Particle.prototype.readPhase = function (e) {
                if (this._isdecayed)
                    return;
                if (this._lifephase[this._currphase].call(this, e) === true) {
                    this._currphase++;
                }
                //trace(this._currtime>this._lifetime);
                if (this._currphase >= this._lifephase.length || this._currtime > this._lifetime) {
                    this.decay();
                }
            };
            /**
             * 当栗子诞生
             */
            Particle.prototype.prebron = function () {
                this.scale.x += 0.05;
                this.scale.y += 0.05;
                if (this.scale.x > 1.6) {
                    this.scale.x = 1.6;
                    this.scale.y = 1.6;
                    return true;
                }
            };
            /**
             * 栗子
             */
            Particle.prototype.alive = function () {
                return true;
            };
            /**
             * 栗子逝去
             */
            Particle.prototype.decaying = function () {
                this.alpha -= 0.01;
                this.scale.x -= 0.01;
                this.scale.y -= 0.01;
                if (this.alpha < 0) {
                    this.alpha = 0;
                    return true;
                }
            };
            Particle.prototype.decay = function () {
                this._isdecayed = true;
                alcedo.AppNotifyable.notifyArray(this._onDecayTask, [this]);
            };
            Particle.prototype.onDecay = function (callback, thisObject, param) {
                if (param === void 0) { param = []; }
                this._onDecayTask.push({ callback: callback, thisObject: thisObject, param: param });
            };
            Particle.prototype.update = function (e) {
                this._velocity.add(this._acceleration);
                this.position.add(this._velocity);
                this._currtime += e.dt;
                this.readPhase(e);
            };
            return Particle;
        })();
        canvas.Particle = Particle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 * 离子发射器
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var ParticleEmitter = (function (_super) {
            __extends(ParticleEmitter, _super);
            /**
             * @param initial
             * @param opts
             * @particleClass 粒子类
             */
            function ParticleEmitter(opts) {
                if (opts === void 0) { opts = {}; }
                _super.call(this);
                trace(opts);
                this._particles = [];
                this._particlespool = [];
                this._currinitial = new canvas.Vector2D();
                this._forcemoment = new canvas.Vector2D();
                this._force = new canvas.Vector2D();
                this._shouldcreate = 0;
                //frequency
                this._initial = opts.initial ? opts.initial.clone() : new canvas.Vector2D();
                this._spread = opts.spread || 0;
                this._mass = opts.massrandom || 1;
                this._massrandom = opts.massrandom || 0;
                this._rate = opts.rate || 1;
                this._max = opts.max || 1;
                this._particleClass = opts.particleClass ? opts.particleClass : canvas.Particle;
            }
            ParticleEmitter.prototype._draw = function (renderer) {
                var wt, partile;
                for (var i = 0; i < this._particles.length; i++) {
                    partile = this._particles[i];
                    partile._stagetransform(this._stage);
                    partile._transform();
                    renderer.context.globalAlpha = partile.alpha * this._alpha;
                    //trace(partile.alpha,this._alpha,partile.alpha*this._alpha);
                    //partile.worldtransform = this._getMatrix(partile.worldtransform)
                    renderer.setTransform(partile.worldtransform);
                    partile._draw(renderer);
                }
            };
            /**
             * 创建一枚栗子
             * @private
             */
            ParticleEmitter.prototype._createOneParticle = function () {
                var _this = this;
                var partile;
                if (this._particlespool.length > 0) {
                    partile = this._particlespool.pop();
                }
                else {
                    partile = new this._particleClass();
                }
                this._ParticleInit(partile);
                this._particles.push(partile);
                partile.onDecay(function (particle) {
                    _this._particles.fastRemove(_this._particles.indexOf(particle)); //you dian diao a
                    _this._particlespool.push(particle);
                }, this);
            };
            ParticleEmitter.prototype._ParticleInit = function (paricle) {
                paricle.create(this.x, this.y);
                this._currinitial.resetAs(this._initial);
                if (this._spread) {
                    var _randeg = Math.randomFrom(-1, 1) * this._spread / 2;
                    var _curdeg = _randeg + this._initial.deg;
                    this._currinitial.resetToDeg(_curdeg);
                }
                paricle.applyForce(this._currinitial);
            };
            ParticleEmitter.prototype._updateParticles = function (e) {
                var partile;
                for (var i = 0; i < this._particles.length; i++) {
                    partile = this._particles[i];
                    this._updateOneParticle(partile);
                    partile.update(e);
                }
                if (this._forcemoment.length > 0) {
                    this._forcemoment.reset();
                }
                this._shouldcreate += (this._rate / 100);
                var delay = (this._shouldcreate) ^ 0;
                if (this._shouldcreate > 1)
                    this._shouldcreate = 0;
                //trace(delay,this._particles.length,this._max);
                if (delay < 1 || this._particles.length >= this._max)
                    return;
                for (var i = 0; i < delay; i++) {
                    //TODO:当i>1时说明错过了上次创建粒子的时机
                    this._createOneParticle();
                }
            };
            /**
             * 更新一枚栗子
             * @param partile
             * @private
             */
            ParticleEmitter.prototype._updateOneParticle = function (partile) {
                partile.applyForce(this._force);
                if (this._forcemoment.length > 0) {
                    partile.applyForce(this._forcemoment);
                }
            };
            ParticleEmitter.prototype.applyForce = function (force, continute) {
                if (continute === void 0) { continute = true; }
                if (continute) {
                    this._force.add(force);
                }
                else {
                    this._forcemoment.add(force);
                }
            };
            Object.defineProperty(ParticleEmitter.prototype, "initialdegree", {
                set: function (drgee) {
                    this._initial.resetToDeg(drgee);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 发射器开关控制系统
             * @private
             */
            ParticleEmitter.prototype._onAdd = function () {
                _super.prototype._onAdd.call(this);
                if (this.isAddtoStage()) {
                    this.setPlayState(this._playstatetmp);
                }
            };
            ParticleEmitter.prototype.play = function () {
                this.setPlayState(true);
            };
            ParticleEmitter.prototype.stop = function () {
                this.setPlayState(false);
            };
            ParticleEmitter.prototype.setPlayState = function (value) {
                //trace(this._playstate , value)
                if (this._playstate == value) {
                    return;
                }
                if (!this.isAddtoStage()) {
                    this._playstatetmp = value;
                    trace("'[dev]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if (value) {
                    this._stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10, this._updateParticles, this);
                }
                else {
                    this._stage.removeEventListener(canvas.Stage.ENTER_MILLSECOND10, this._updateParticles, this);
                }
            };
            ParticleEmitter.prototype.dispose = function () {
                //todo:释放粒子发射器
            };
            return ParticleEmitter;
        })(canvas.DisplayObject);
        canvas.ParticleEmitter = ParticleEmitter;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/19.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayObjectEvent = (function (_super) {
            __extends(DisplayObjectEvent, _super);
            function DisplayObjectEvent() {
                _super.apply(this, arguments);
            }
            DisplayObjectEvent.ON_ADD = "DisplayObjectEventON_ON_ADD";
            DisplayObjectEvent.ON_REMOVE = "DisplayObjectEventON_ON_REMOVE";
            DisplayObjectEvent.ON_ADD_TO_STAGE = "DisplayObjectEventON_ADD_TO_STAGE";
            return DisplayObjectEvent;
        })(alcedo.Event);
        canvas.DisplayObjectEvent = DisplayObjectEvent;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Camera2D = (function (_super) {
            __extends(Camera2D, _super);
            function Camera2D(stage, buffer) {
                if (buffer === void 0) { buffer = 1.2; }
                _super.call(this);
                this._focal = 1;
                this._yaw = new canvas.Vector2D(0.5, 0.5);
                this._buffer = buffer > 1 ? buffer : 1;
                this._position = new canvas.Point2D();
                this._stage = stage;
                this._vieworigin = new canvas.Rectangle(stage.x, stage.y, stage.width(), stage.height());
                this._viewfinder = this._vieworigin.clone();
                this._viewsafe = this._vieworigin.clone();
                //this.zoomToPoint(Point2D.identity(0,0),1,0);
            }
            Object.defineProperty(Camera2D.prototype, "x", {
                get: function () {
                    return this._position.x;
                },
                set: function (x) {
                    this._position.x = x;
                    this._stage.pivotOffsetX(this._position.x);
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "y", {
                get: function () {
                    return this._position.y;
                },
                set: function (y) {
                    this._position.y = y;
                    this._stage.pivotOffsetY(this._position.y);
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "focal", {
                get: function () {
                    return 1 / this._focal;
                },
                set: function (focal) {
                    this._focal = 1 / focal;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yawX", {
                get: function () {
                    return this._yaw.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yawY", {
                get: function () {
                    return this._yaw.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yaw", {
                set: function (yaw) {
                    this._yaw.x = yaw;
                    this._yaw.y = yaw;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Camera2D.prototype.zoomTo = function (x, y, focal, yawx, yawy) {
                if (yawx === void 0) { yawx = 0.5; }
                if (yawy === void 0) { yawy = 0.5; }
                this._position.x = x;
                this._stage.pivotOffsetX(this._position.x);
                this._position.y = y;
                this._stage.pivotOffsetY(this._position.y);
                this._focal = 1 / focal;
                this._yaw.x = yawx;
                this._yaw.y = yawy;
                this._updateView();
            };
            Camera2D.prototype._updateView = function () {
                //TODO:现在的Viewport计算不正确！
                this._stage.x = this._stage.width() * this._yaw.x;
                this._stage.y = this._stage.height() * this._yaw.y;
                this._stage.scaleALL(1 / this._focal);
                this._viewfinder.width = this._focal * this._stage.width();
                this._viewfinder.height = this._focal * this._stage.height();
                this._viewfinder.x = this._position.x - this._viewfinder.width / 2;
                this._viewfinder.y = this._position.y - this._viewfinder.height / 2;
                var buffer = this._buffer;
                this._viewsafe.width = this._viewfinder.width; //*buffer;
                this._viewsafe.height = this._viewfinder.height; //*buffer;
                this._viewsafe.x = this._viewfinder.x; //-(this._viewfinder.width*(buffer-1))/2;
                this._viewsafe.y = this._viewfinder.y; //-(this._viewfinder.width*(buffer-1))/2;
                //trace(this._stage.x,this._stage.y,this._stage.width(),this._stage.height(),this._stage["_staticboundingbox"]);
            };
            Camera2D.prototype.viewfinder = function () {
                return this._viewfinder.clone();
            };
            Camera2D.prototype.viewsafe = function () {
                return this._viewsafe.clone();
            };
            return Camera2D;
        })(alcedo.AppProxyer);
        canvas.Camera2D = Camera2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        /**
         * 当前canvas配置熟悉显示
         */
        var Profiler = (function (_super) {
            __extends(Profiler, _super);
            function Profiler(context) {
                _super.call(this);
                this._maincontext = context;
                this._profilerdiv = alcedo.d$.query("<div style='font-family:Microsoft Yahei;background-color: black;opacity: 0.6;color: #fff;line-height: 1.3;padding: 3px'>" + "<p style='margin: 0;'>FPS:<span class='fps'>60</span></p>" + "<p style='margin: 0;'>CPU</p>" + "</div>")[0];
                this._profilerdiv.css({ position: "absolute" });
                //this._profilerdiv.id = this._maincontext.canvas.id+"_profiler";
                this._maincontext.stage.addEventListener(canvas.Stage.ENTER_SECOND, this.update, this);
                this.visible = false;
                this._maincontext.container.prependChild(this._profilerdiv);
            }
            Object.defineProperty(Profiler.prototype, "visible", {
                set: function (visible) {
                    if (visible) {
                        this._profilerdiv.show();
                    }
                    else {
                        this._profilerdiv.hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Profiler.prototype.update = function (e) {
                //trace(e.fps);
                this._profilerdiv.find(".fps")[0].innerContent(e.fps);
            };
            return Profiler;
        })(alcedo.AppObject);
        canvas.Profiler = Profiler;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 1015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Ticker = (function (_super) {
            __extends(Ticker, _super);
            function Ticker(stage) {
                _super.call(this);
                this._fps = 0;
                this._total10microsecond = 0;
                this._totalsecond = 0;
                this._countmicrosecond = 0;
                this._count10microsecond = 0;
                this._last10microsecond = 0;
                this._stage = stage;
                this._stage.enterframe(this.update, this);
                this._lostfocustime = 0;
                alcedo.d$.addEventListener(alcedo.dom.DomEvents.ON_FOCUS, this.onWindowFocus, this);
                alcedo.d$.addEventListener(alcedo.dom.DomEvents.ON_LOST_FOCUS, this.onWindowLostFocus, this);
            }
            Ticker.prototype.onWindowFocus = function (e) {
                if (!this._lostfocustime)
                    return;
                this._lostfocustime = e.time - this._lostfocustime;
                //trace("onWindowFocus",this._lostfocustime)
            };
            Ticker.prototype.onWindowLostFocus = function (e) {
                //trace("onWindowLostFocus")
                this._lostfocustime = e.time;
            };
            Ticker.prototype.update = function (e) {
                var i, dt = e.dt, _counter;
                if (this._lostfocustime > 0 && e.dt > this._lostfocustime) {
                    dt = e.dt - this._lostfocustime; //trace("ReFocus",e.dt,this._lostfocustime,dt)
                    this._lostfocustime = 0;
                }
                this._countmicrosecond += dt;
                this._fps = 1000 / dt;
                //TODO:不使用for循环,改成50毫秒
                _counter = +(this._countmicrosecond / 10) ^ 0;
                if (_counter >= 1) {
                    this._total10microsecond += _counter;
                    this._stage.emit(canvas.Stage.ENTER_MILLSECOND10, { fps: this.fps(), count: this._total10microsecond, dt: dt, delay: _counter });
                    //trace("10microsecode",_counter)
                    this._countmicrosecond = 0;
                }
                this._count10microsecond += (this._total10microsecond - this._last10microsecond);
                _counter = +(this._count10microsecond / 100) ^ 0;
                if (_counter >= 1) {
                    this._stage.emit(canvas.Stage.ENTER_SECOND, { fps: this.fps(), count: this._totalsecond, dt: dt, delay: _counter });
                    this._count10microsecond = 0;
                }
                this._last10microsecond = this._total10microsecond;
            };
            Ticker.prototype.fps = function () {
                return +this._fps.toFixed(0);
            };
            return Ticker;
        })(alcedo.AppProxyer);
        canvas.Ticker = Ticker;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Constant = (function () {
            function Constant() {
            }
            /**
             * 得到对应角度值的sin近似值
             * @param value {number} 角度值
             * @returns {number} sin值
             */
            Constant.sin = function (value) {
                var result = 0;
                if (value % (Constant.PI_2 * Constant.RAD_TO_DEG)) {
                    result = Math.sin(value);
                }
                else {
                    result = 0;
                }
                return result;
            };
            /**
             * 得到对应角度值的cos近似值
             * @param value {number} 角度值
             * @returns {number} cos值
             */
            Constant.cos = function (value) {
                var result = 0;
                if (value % (Constant.PI_2 * Constant.RAD_TO_DEG)) {
                    result = Math.cos(value);
                }
                else {
                    result = 1;
                }
                return Math.cos(value);
            };
            Constant.PI = 3.14;
            /**
             * @property {Number} PI_2
             */
            Constant.PI_2 = Math.PI * 2;
            /**
             * @property {Number} RAD_TO_DEG
             */
            Constant.RAD_TO_DEG = 180 / Math.PI;
            /**
             * @property {Number} DEG_TO_RAD
             */
            Constant.DEG_TO_RAD = Math.PI / 180;
            return Constant;
        })();
        canvas.Constant = Constant;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Segment2D = (function () {
            function Segment2D(begin, end) {
                this.begin = new canvas.Point2D(begin.x, begin.y);
                this.end = new canvas.Point2D(end.x, end.y);
            }
            Object.defineProperty(Segment2D.prototype, "vector", {
                /**
                 * 转换成二维向量
                 */
                get: function () {
                    return canvas.Vector2D.createFromPoint(this.begin, this.end);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Segment2D.prototype, "length", {
                get: function () {
                    return this.vector.length;
                },
                enumerable: true,
                configurable: true
            });
            Segment2D.identity = new Segment2D(canvas.Point2D.identity(), canvas.Point2D.identity());
            return Segment2D;
        })();
        canvas.Segment2D = Segment2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Bezier2D = (function () {
            function Bezier2D(points, accuracy) {
                if (accuracy === void 0) { accuracy = 66; }
                this._controlpoints = [];
                if (points.length < 0)
                    return;
                for (var i = 0; i < points.length; i++) {
                    this._controlpoints.push(new canvas.Point2D(points[i].x, points[i].y));
                }
                this._controlpoints = this._controlpoints.map(function (p) { return p; });
                this._generate(1 / accuracy);
            }
            Bezier2D.prototype._generate = function (step) {
                var points = [];
                //make sure the curve goes through the first point
                points.push(this._controlpoints[0]);
                for (var t = step; t <= 1; t += step) {
                    points.push(Bezier2D.lerpCurve(this._controlpoints, t));
                }
                //make sure the curve goes through the last point
                points.push(this._controlpoints.last);
                this._curve = points;
            };
            //public get length(){
            //
            //}
            Bezier2D.prototype.getPointAt = function (precent) {
                var _precent = precent;
                if (_precent > 100)
                    _precent = _precent % 100;
                var _index = this._curve.length * (_precent / 100) ^ 0;
                return this._curve[_index];
            };
            Bezier2D.prototype.eachPointsOnCurve = function (fn) {
                for (var i = 0; i < this._curve.length; i++) {
                    fn(this._curve[i]);
                }
            };
            Bezier2D.lerpCurve = function (inPoints, t) {
                if (inPoints.length == 1) {
                    return inPoints[0];
                }
                var points = [];
                for (var i = 0; i < inPoints.length - 1; i++) {
                    var pt1 = inPoints[i];
                    var pt2 = inPoints[i + 1];
                    points[i] = this.lerpPoint(pt1, pt2, t);
                }
                return this.lerpCurve(points, t);
            };
            Bezier2D.lerpPoint = function (fromPoint, toPoint, t) {
                var s = 1.0 - t;
                var x = fromPoint.x * s + toPoint.x * t;
                var y = fromPoint.y * s + toPoint.y * t;
                return new canvas.Point2D(x, y);
            };
            return Bezier2D;
        })();
        canvas.Bezier2D = Bezier2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Circle = (function () {
            function Circle(center, r) {
                this.center = center;
                this.radius = r;
            }
            return Circle;
        })();
        canvas.Circle = Circle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/10.
 */
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var Context2DRenderer = (function (_super) {
            __extends(Context2DRenderer, _super);
            function Context2DRenderer() {
                _super.call(this);
            }
            Context2DRenderer.prototype.render = function () {
                //transform
                this._stage._transform();
                this._canvasRenderContext.setTransform(1, 0, 0, 1, 0, 0); //重置canvas的transform
                this._canvasRenderContext.globalAlpha = 1;
                this._canvasRenderContext.globalCompositeOperation = "source-over";
                if (this._renderoption.background) {
                    this._canvasRenderContext.fillStyle = this._renderoption.background;
                    this._canvasRenderContext.fillRect(0, 0, this._stage._stageWidth, this._stage._stageHeight);
                }
                else {
                    this._canvasRenderContext.clearRect(0, 0, this._stage._stageWidth, this._stage._stageHeight);
                }
                //render
                //this._stage._debugdraw(this);
                this._stage.render(this);
                this.notify(this._mainlooptask, _canvas.CanvasRenderer.MainLoop, [this]);
                _canvas.animationFrame(this.render, this);
            };
            Context2DRenderer.prototype.setTransform = function (matrix) {
                //在没有旋转缩放斜切的情况下，先不进行矩阵偏移，等下次绘制的时候偏移
                this._canvasRenderContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            };
            Context2DRenderer.prototype.executeMainLoop = function (stage, canvas) {
                this._stage = stage;
                this._canvas = canvas;
                this._canvasRenderContext = this._canvas.getContext("2d");
                this._renderoption = this._stage._options;
                //TODO:判断option是否合法
                //使用平滑设置
                if ("imageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "imageSmoothingEnabled";
                }
                else if ("webkitImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "webkitImageSmoothingEnabled";
                }
                else if ("mozImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "mozImageSmoothingEnabled";
                }
                else if ("oImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "oImageSmoothingEnabled";
                }
                else if ("msImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "msImageSmoothingEnabled";
                }
                //混合设置
                this._canvasRenderContext.globalCompositeOperation = "source-over";
                this.smooth = true;
                _canvas.animationFrame(this.render, this);
            };
            Object.defineProperty(Context2DRenderer.prototype, "smooth", {
                set: function (flag) {
                    this._canvasRenderContext[this._smoothProperty] = flag;
                },
                enumerable: true,
                configurable: true
            });
            Context2DRenderer.prototype.clearScreen = function () {
                this._canvasRenderContext.clear();
            };
            return Context2DRenderer;
        })(_canvas.CanvasRenderer);
        _canvas.Context2DRenderer = Context2DRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var WebGLRenderer = (function (_super) {
            __extends(WebGLRenderer, _super);
            function WebGLRenderer() {
                _super.apply(this, arguments);
            }
            return WebGLRenderer;
        })(canvas.CanvasRenderer);
        canvas.WebGLRenderer = WebGLRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var MovieClipRepository = (function (_super) {
            __extends(MovieClipRepository, _super);
            function MovieClipRepository() {
                _super.call(this);
                this._movieclipdataspool = new Dict();
            }
            /**
             * 解析MovieClipData并存入仓库
             * @param dataset
             * @param sheet
             */
            MovieClipRepository.prototype.praseMovieClipData = function (dataset, sheettexture) {
                var _dataset = dataset;
                if (Array.isArray(_dataset)) {
                    _dataset = _dataset[0];
                }
                if (!_dataset.mc) {
                    trace("praseMovieClipData dataset format invalid!!!", _dataset);
                    return;
                } //invalid foramt
                if (_dataset.res && sheettexture) {
                    var _tmpsheetdata = this.praseSheetData(_dataset.res, new canvas.SpriteSheet(sheettexture));
                }
                for (var name in _dataset.mc) {
                    if (typeof name == "string") {
                        var moveclip, frames = [], moveclipdata = _dataset.mc[name];
                        if (!this._movieclipdataspool.has(name) && Array.isArray(moveclipdata.frames)) {
                            moveclip = new MovieClipData(name);
                            for (var i = 0; i < moveclipdata.frames.length; i++) {
                                var texture = _tmpsheetdata.get(moveclipdata.frames[i].res);
                                texture._offsetX = moveclipdata.frames[i].x || 0;
                                texture._offsetY = moveclipdata.frames[i].y || 0;
                                frames.push(texture);
                            }
                            if (frames.length > 0)
                                moveclip._importFrames(frames, moveclipdata.frameRate);
                            this._movieclipdataspool.set(name, moveclip);
                        }
                        else {
                        }
                    }
                }
            };
            /**
             * 解析雪碧图(egret)
             * @param sheetdataset
             * @param sheet
             */
            MovieClipRepository.prototype.praseSheetData = function (sheetdataset, sheet) {
                var texture, texturedata, name, sheetdata = new Dict();
                for (name in sheetdataset) {
                    if (typeof name == "string") {
                        texturedata = sheetdataset[name];
                        texture = sheet.createTexture(texturedata.x, texturedata.y, texturedata.w, texturedata.h);
                        sheetdata.set(name, texture);
                    }
                }
                return sheetdata;
            };
            MovieClipRepository.prototype.get = function (name) {
                return this._movieclipdataspool.get(name);
            };
            MovieClipRepository.instanceable = true;
            return MovieClipRepository;
        })(alcedo.AppProxyer);
        canvas.MovieClipRepository = MovieClipRepository;
        var MovieClipData = (function (_super) {
            __extends(MovieClipData, _super);
            function MovieClipData(name) {
                _super.call(this);
                this._name = name;
                this._bound = new alcedo.canvas.Rectangle();
            }
            MovieClipData.prototype._importFrames = function (frames, frameRate) {
                this._frames = frames;
                this._framerate = frameRate;
                this._framescount = frames.length;
                this._bound = MovieClipData.getBoundFromFrames(frames);
            };
            MovieClipData.prototype.getFrames = function () {
                return this._frames;
            };
            MovieClipData.prototype.getFrame = function (index) {
                return this._frames[index];
            };
            MovieClipData.prototype.getFrameRate = function () {
                return this._framerate;
            };
            Object.defineProperty(MovieClipData.prototype, "left", {
                get: function () {
                    return this._bound.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "top", {
                get: function () {
                    return this._bound.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "width", {
                get: function () {
                    return this._bound.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "height", {
                get: function () {
                    return this._bound.height;
                },
                enumerable: true,
                configurable: true
            });
            MovieClipData.getBoundFromFrames = function (frames) {
                var lefts = [];
                var rights = [];
                var tops = [];
                var bottoms = [];
                for (var i = 0; i < frames.length; i++) {
                    var frame = frames[i];
                    lefts.push(frame._offsetX);
                    rights.push(frame._sourceWidth);
                    tops.push(frame._offsetY);
                    bottoms.push(frame._sourceHeight);
                }
                var minleft = Math.min.apply(Math, lefts);
                var mintop = Math.min.apply(Math, tops);
                var maxright = Math.max.apply(Math, rights);
                var maxbottom = Math.max.apply(Math, bottoms);
                return new canvas.Rectangle(minleft, mintop, maxright, maxbottom);
            };
            return MovieClipData;
        })(alcedo.AppObject);
        canvas.MovieClipData = MovieClipData;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var SpriteSheet = (function (_super) {
            __extends(SpriteSheet, _super);
            function SpriteSheet(texture) {
                _super.call(this);
                this._sourceWidth = 0;
                this._sourceHeight = 0;
                this._texture = texture;
                this._sourceWidth = texture._sourceWidth;
                this._sourceHeight = texture._sourceHeight;
                this._textureMap = new Dict();
            }
            //public createTexturesFromConfig(config:any){
            //
            //}
            SpriteSheet.prototype.getTexture = function (name) {
                return this._textureMap.get(name);
            };
            SpriteSheet.prototype.createTexture = function (sourceX, sourceY, sourceWidth, sourceHeight) {
                if (sourceX === void 0) { sourceX = 0; }
                if (sourceY === void 0) { sourceY = 0; }
                var texture = this._texture.clone();
                texture._sourceX = sourceX;
                texture._sourceY = sourceY;
                texture._sourceWidth = sourceWidth;
                texture._sourceHeight = sourceHeight;
                return texture;
            };
            return SpriteSheet;
        })(alcedo.AppObject);
        canvas.SpriteSheet = SpriteSheet;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(value, args) {
                _super.call(this);
                this._sourceX = 0;
                this._sourceY = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的宽度
                 */
                this._sourceWidth = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的高度
                 */
                this._sourceHeight = 0;
                /**
                 * 这个纹理的纹理x,Y,width,height
                 */
                this._textureX = 0;
                this._textureY = 0;
                this._textureWidth = 0;
                this._textureHeight = 0;
                this._offsetX = 0;
                this._offsetY = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的宽高比
                 */
                this._sourceW2H = 0;
                this._bitmapData = null;
                this._bitmapData = value;
                this._sourceWidth = value.width;
                this._sourceHeight = value.height;
                this._sourceW2H = this._sourceWidth / this._sourceHeight;
                this._bound = new alcedo.canvas.Rectangle();
            }
            Object.defineProperty(Texture.prototype, "bitmapData", {
                /**
                 * 纹理对象中得位图数据
                 * @member {ImageData} canvas.Texture#bitmapData
                 */
                get: function () {
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Texture.prototype, "sourceUrl", {
                get: function () {
                    if (this._bitmapData.src) {
                        return this._bitmapData.src;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Texture.prototype.clone = function () {
                var texture = new Texture(this._bitmapData);
                return texture;
            };
            return Texture;
        })(alcedo.AppObject);
        canvas.Texture = Texture;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TextureRepository = (function (_super) {
            __extends(TextureRepository, _super);
            function TextureRepository() {
                _super.call(this);
                this._texurespool = new Dict();
                this._repeatkey = {};
            }
            TextureRepository.prototype.set = function (key, value) {
                this._texurespool.set(key, value);
            };
            TextureRepository.prototype.get = function (key) {
                //trace(a$.proxy(net.AsyncRES))
                if (!this._texurespool.has(key)) {
                    if (alcedo.proxy(alcedo.net.AsyncRES).get(key) && alcedo.proxy(alcedo.net.AsyncRES).get(key)[0] instanceof HTMLImageElement) {
                        var img = alcedo.proxy(alcedo.net.AsyncRES).get(key)[0];
                        var texture = new canvas.Texture(img);
                        this._texurespool.set(key, texture);
                    }
                }
                return this._texurespool.get(key);
            };
            TextureRepository.prototype.find = function (reg) {
                var i, keys = alcedo.proxy(alcedo.net.AsyncRES).keys, result = [];
                for (i = 0; i < keys.length; i++) {
                    if (reg.test(keys[i])) {
                        if (this.get(keys[i]))
                            result.push(this.get(keys[i]));
                    }
                }
                return result;
            };
            TextureRepository.instanceable = true;
            TextureRepository.ASSETS_COMPLETE = "TextureRepository_LOAD_COMPLETE";
            TextureRepository.ASSETS_PROGRESSING = "TextureRepository_LOAD_ASSETS_PROGRESSING";
            return TextureRepository;
        })(alcedo.AppProxyer);
        canvas.TextureRepository = TextureRepository;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        function width() {
            var result;
            if (document.documentElement.clientWidth) {
                result = document.documentElement.clientWidth;
            }
            else {
                result = window.innerWidth;
            }
            return result;
        }
        dom.width = width;
        function height() {
            var result;
            if (document.documentElement.clientHeight) {
                result = document.documentElement.clientHeight;
            }
            else {
                result = window.innerHeight;
            }
            return result;
        }
        dom.height = height;
        function w2h() {
            return width() / height();
        }
        dom.w2h = w2h;
        var navigator;
        if (!navigator) {
            navigator = { userAgent: "commonJS" };
        }
        dom.ua = navigator.userAgent.toLowerCase();
        function device() {
            if (/iphone|ipad|ipod/i.test(dom.ua)) {
                return 2 /* IOS */;
            }
            if (/android/i.test(dom.ua)) {
                return 1 /* Android */;
            }
            if (/windows/i.test(dom.ua) && /phone/i.test(dom.ua)) {
                return 3 /* WinPhone */;
            }
            return 0 /* PC */;
        }
        dom.device = device;
        (function (DeviceType) {
            DeviceType[DeviceType["Android"] = 1] = "Android";
            DeviceType[DeviceType["IOS"] = 2] = "IOS";
            DeviceType[DeviceType["WinPhone"] = 3] = "WinPhone";
            DeviceType[DeviceType["PC"] = 0] = "PC";
            DeviceType[DeviceType["Other"] = -1] = "Other";
        })(dom.DeviceType || (dom.DeviceType = {}));
        var DeviceType = dom.DeviceType;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
var alcedo;
(function (alcedo) {
    function px(value) {
        return value.toFixed(1) + "px";
    }
    alcedo.px = px;
    function percent(value) {
        return value.toFixed(1) + "%";
    }
    alcedo.percent = percent;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var RequestMethod = (function () {
            function RequestMethod() {
            }
            RequestMethod.GET = "get";
            RequestMethod.POST = "post";
            return RequestMethod;
        })();
        net.RequestMethod = RequestMethod;
        var RequestDataType = (function () {
            function RequestDataType() {
            }
            /**
             * 指定以原始二进制数据形式接收下载的数据。
             */
            RequestDataType.BINARY = "binary";
            /**
             * 指定以文本形式接收已下载的数据。
             */
            RequestDataType.TEXT = "text";
            /**
             * 指定以JSON形式接收已下载的数据。
             */
            RequestDataType.JSON = "json";
            return RequestDataType;
        })();
        net.RequestDataType = RequestDataType;
        var DataType = (function () {
            function DataType() {
            }
            DataType.TEXT = "text";
            DataType.JSON = "json";
            DataType.IMAGE = "image";
            DataType.SOUND = "sound";
            DataType.SCRIPT = "script";
            return DataType;
        })();
        net.DataType = DataType;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        /**Ajax请求**/
        function ajax(url, args, thisArg) {
            if (args.async == undefined) {
                args.async = true;
            }
            alcedo.a$.proxy(AsyncProxy).ajax(url, args, thisArg);
        }
        net.ajax = ajax;
        /**异步载入图片**/
        function asyncImage(url, args, thisArg) {
            alcedo.a$.proxy(AsyncProxy).asyncImage(url, args, thisArg);
        }
        net.asyncImage = asyncImage;
        var AsyncProxy = (function (_super) {
            __extends(AsyncProxy, _super);
            function AsyncProxy() {
                _super.call(this);
                this._asyncimagepool = new Dict();
            }
            AsyncProxy.prototype.bindcallback = function (args, thisArg) {
                if (thisArg) {
                    if (args.success)
                        args.success = args.success.bind(thisArg);
                    if (args.error)
                        args.error = args.error.bind(thisArg);
                }
                return args;
            };
            /**
             * ajax方法
             * @param url
             * @param method
             * @param args
             * @param thisArg
             */
            AsyncProxy.prototype.ajax = function (url, args, thisArg) {
                //default value;
                var xhr = this.getXHR();
                args.method = args.method ? args.method : "get";
                if (args.responseType == net.RequestDataType.BINARY) {
                    xhr.responseType = net.RequestDataType.BINARY;
                }
                if (args.responseType == net.RequestDataType.BINARY) {
                    //warn(url,"AjaxResponseType.BINARY require method of post")
                    args.method = "post";
                }
                args = this.bindcallback(args, thisArg);
                if (!alcedo.checkNormalType(args.data) || args.data) {
                    var _datastr = "";
                    for (var i in args.data) {
                        if (alcedo.checkNormalType(args.data[i])) {
                            _datastr += "&" + i + "=" + args.data[i];
                        }
                    }
                    args.data = _datastr;
                }
                xhr.onreadystatechange = function () {
                    // 4 = "finish"
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var data = "";
                            switch (args.responseType) {
                                default:
                                case net.RequestDataType.TEXT: {
                                    data = xhr.responseText;
                                    break;
                                }
                                case net.RequestDataType.JSON: {
                                    //TODO:tryCatch隔离
                                    alcedo.tryExecute(function () {
                                        data = JSON.parse(xhr.responseText);
                                    }, function () {
                                        console.warn("data is not a json type", { data: xhr.responseText });
                                    });
                                    break;
                                }
                                case net.RequestDataType.BINARY: {
                                    data = xhr.response;
                                    break;
                                }
                            }
                            args.success(data, args.courier);
                        }
                        if (xhr.stage >= 400) {
                            args.error(xhr.status);
                        }
                    }
                };
                xhr.open(args.method, url, args.async, args.user, args.password);
                if (args.method == net.RequestMethod.GET || !args.data) {
                    xhr.send();
                }
            };
            AsyncProxy.prototype.getXHR = function () {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                }
                else if (window["ActiveXObject"]) {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                }
                else {
                    console.error("XMLHttpRequest not support on this device!");
                }
            };
            AsyncProxy.prototype.asyncImage = function (url, args, thisArg) {
                var _this = this;
                args = this.bindcallback(args, thisArg);
                if (!this._asyncimagepool.has(url)) {
                    var image = new Image();
                    image.onload = function () {
                        _this._asyncimagepool.set(url, image);
                        args.success(_this._asyncimagepool.get(url), args.courier);
                    };
                    image.onerror = args.error;
                    image.src = url;
                }
                else {
                    args.success(this._asyncimagepool.get(url), args.courier);
                }
            };
            AsyncProxy.instanceable = true;
            return AsyncProxy;
        })(alcedo.AppProxyer);
        net.AsyncProxy = AsyncProxy;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var AsyncAssetsLoader = (function (_super) {
            __extends(AsyncAssetsLoader, _super);
            function AsyncAssetsLoader() {
                _super.call(this);
                this._thread = 2; /**最大并发鲜橙树**/
                this._threadCound = 0;
                this._assets_loading_tasks = [];
                this._assets_groups_loading = new Dict();
                this._assets_groups_loaded = new Dict();
                this._assets_pool = new Dict();
                this._assets_groups = new Dict();
                this._assets_configs = new Dict();
                this._assets_groups_waitingload = [];
                this._basedir = window.location.href.replace(/\w+\.(html|htm)$/, "");
            }
            AsyncAssetsLoader.prototype.addConfig = function (configurl) {
                var _this = this;
                if (this._assets_configs.has(configurl)) {
                    return;
                }
                var _configurl = configurl.indexOf("://") < 0 ? (this._basedir + "/" + configurl) : configurl;
                this._assets_configs.set(_configurl, { configed: false, refdir: _configurl.replace(/\w+\.json$/, "") });
                net.ajax(_configurl, {
                    success: function (data) {
                        var i, _config = JSON.parse(data);
                        _this._assets_configs.get(_configurl).configed = true;
                        for (i = 0; i < _config.resources.length; i++) {
                            _this._assets_pool.set(_config.resources[i].name, _config.resources[i]);
                        }
                        for (i = 0; i < _config.groups.length; i++) {
                            if (!_this._assets_groups.has(_config.groups[i].name)) {
                                _config.groups[i].loaded = false;
                                _config.groups[i].refdir = _configurl.replace(/\w+\.json$/, "");
                                _this._assets_groups.set(_config.groups[i].name, _config.groups[i]);
                            }
                        }
                        _this.loadGroup(_this._assets_groups_waitingload);
                    }
                });
            };
            AsyncAssetsLoader.prototype.loadGroup = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i - 0] = arguments[_i];
                }
                var i, j, _names, _name;
                if (Array.isArray(names[0]))
                    names = names[0];
                if (names.length < 1)
                    return;
                for (i = 0; i < this._assets_configs.size; i++) {
                    if (!this._assets_configs.values[i].configed) {
                        _names = [];
                        for (j = 0; j < names.length; j++) {
                            if (this._assets_groups_waitingload.indexOf(names[j]) < 0) {
                                _names.push(names[j]);
                            }
                        }
                        this._assets_groups_waitingload = this._assets_groups_waitingload.concat(_names);
                        return;
                    }
                }
                this._assets_groups_waitingload = [];
                for (i = 0; i < names.length; i++) {
                    _name = names[i];
                    if (this._assets_groups.has(_name) && !this._assets_groups_loaded.get(_name)) {
                        var assetsobjs = [], assets = this._assets_groups.get(_name).keys;
                        assets = assets.split(",");
                        for (j = 0; j < assets.length; j++) {
                            var assetsobj = this._assets_pool.get(assets[j]);
                            if (assetsobj)
                                assetsobjs.push(assetsobj);
                        }
                        this.loadAssets(assetsobjs, _name, this._assets_groups.get(_name).refdir);
                    }
                }
            };
            /**
             * 资源组
             */
            AsyncAssetsLoader.prototype.loadAssets = function (assets, groupname, basedir) {
                //console.log(basedir);
                if (assets && Array.isArray(assets)) {
                    this._assets_groups_loading.set(groupname, 0);
                    this._assets_groups_loaded.set(groupname, { length: assets.length, complete: false });
                    for (var i = 0; i < assets.length; i++) {
                        var asset = assets[i];
                        var name = asset.name;
                        if (alcedo.proxy(net.AsyncRES).get(name)) {
                            continue;
                        }
                        this.loadAsset(asset, groupname, basedir);
                    }
                }
            };
            AsyncAssetsLoader.prototype.loadAsset = function (asset, groupname, basedir) {
                var _this = this;
                if (this._threadCound >= this._thread) {
                    this._assets_loading_tasks.push([asset, groupname, basedir]);
                    return;
                }
                this._threadCound++;
                switch (asset.type) {
                    default:
                    case net.DataType.IMAGE:
                        {
                            net.asyncImage(basedir + "/" + asset.url, {
                                success: function (image, courier) {
                                    alcedo.proxy(net.AsyncRES).set(courier.name, image); //{type:asset.type,res:image}
                                    _this._oneAsssetComplete(groupname);
                                },
                                error: function () {
                                    _this._oneAsssetComplete(groupname);
                                },
                                courier: {
                                    name: asset.name //防止变量提升,把name存进courier里
                                }
                            }, this);
                        }
                        break;
                    case net.DataType.JSON: {
                        net.ajax(basedir + "/" + asset.url, {
                            success: function (json, courier) {
                                var _jsonobj;
                                try {
                                    _jsonobj = JSON.parse(json);
                                }
                                catch (e) {
                                    trace(json, "format error!");
                                    _this._oneAsssetComplete(groupname);
                                    return;
                                }
                                alcedo.proxy(net.AsyncRES).set(courier.name, _jsonobj); //{type:asset.type,res:image}
                                _this._oneAsssetComplete(groupname);
                            },
                            error: function () {
                                _this._oneAsssetComplete(groupname);
                            },
                            courier: {
                                name: asset.name //防止变量提升,把name存进courier里
                            }
                        });
                    }
                }
            };
            /**一个资源加载结束**/
            AsyncAssetsLoader.prototype._oneAsssetComplete = function (counter) {
                var a = this._assets_groups_loading.get(counter) + 1;
                this._assets_groups_loading.set(counter, a);
                this._threadCound--;
                //trace(counter,this._assets_loaded.get(counter).length,this._assets_loading.get(counter))
                //trace(this._assets_loading_tasks)
                if (this._assets_loading_tasks.length > 0) {
                    this._loadNextAssets();
                }
                if (this._assets_groups_loaded.get(counter).length == this._assets_groups_loading.get(counter)) {
                    this._assets_groups_loaded.get(counter).complete = true;
                    this._oneAsssetsGroupComplete();
                }
            };
            AsyncAssetsLoader.prototype._loadNextAssets = function () {
                var task = this._assets_loading_tasks.shift();
                this.loadAsset(task[0], task[1], task[2]);
            };
            /**一个资源组加载完成了**/
            AsyncAssetsLoader.prototype._oneAsssetsGroupComplete = function () {
                var loadedgroups = this._assets_groups_loaded.values;
                var flag = true;
                for (var i = 0; i < loadedgroups.length; i++) {
                    if (loadedgroups[i].complete == false) {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                    this.emit(net.AsyncRESEvent.ASSETS_COMPLETE);
            };
            AsyncAssetsLoader.instanceable = true;
            return AsyncAssetsLoader;
        })(alcedo.AppProxyer);
        net.AsyncAssetsLoader = AsyncAssetsLoader;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
// 当开启GPU渲染时，Chrome的canvas绘制会锁定在30帧（不接电源的时候是这样。）
// 加入要打包成原生应用，首选考虑工具CocoonJS
// Dom元素操作尽量通过add Class操作
//
//a
//fuckgulpa
