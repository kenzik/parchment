/*

Common untility functions
=================================================

Copyright (c) 2011 The ifvms.js team
BSD licenced
http://github.com/curiousdannii/ifvms.js

*/

// Array.indexOf compatibility
if ( ![].indexOf )
{
	Array.prototype.indexOf = function( obj, fromIndex )
	{
		for ( var i = fromIndex || 0, l = this.length; i < l; i++ )
		{
			if ( this[i] == obj )
			{
				return i;
			}
		}
		return -1;
	};
}

// Utility to extend objects
var extend = function( old, add )
{
	for ( var name in add )
	{
		old[name] = add[name];
	}
	return old;
},

// Console dummy funcs
console = window.console || {
	log: function(){},
	info: function(){},
	warn: function(){}
},

// Utilities for 16-bit signed arithmetic
U2S = function( value )
{
	return ( (value & 0x8000) ? ~0xFFFF : 0 ) | value;
},
S2U = function( value )
{
	return value & 0xFFFF;
},

// Utility to convert from byte arrays to word arrays
byte_to_word = function( array )
{
	var i = 0, l = array.length,
	result = [];
	while ( i < l )
	{
		result[i / 2] = array[i++] << 8 | array[i++];
	}
	return result;
},
	
// Perform some micro optimisations
optimise = function( code )
{
	return code
	
	// Bytearray
	.replace( /([\w.]+)\.getUint8\(([^(]+?)\)/g, '$1[$2]' )
	.replace( /([\w.]+)\.getUint16\(([^(]+?)\)/g, '($1[$2]<<8|$1[$2+1])' )
	
	// Conversions
	.replace( /(e\.)?S2U\(([^(]+?)\)/g, '($2)&65535' );
},
optimise_obj = function( obj )
{
	var funcname, funcparts, args;
	for ( funcname in obj )
	{
		funcparts = /function\s*\(([^(]*)\)\s*\{([\s\S]+)\}/.exec( '' + obj[funcname] );
		if ( funcparts )
		{
			/* DEBUG */
				obj[funcname] = eval( '(function ' + arguments[1] +'_' + funcname + '(' + funcparts[1] + '){' + optimise( funcparts[2] ) + '})' );
			/* ELSEDEBUG
				args = funcparts[1].split( ',' );
				args.push( optimise( funcparts[2] ) );
				obj[funcname] = Function.apply( this, args );
			/* ENDDEBUG */
		}
	}
};

/* DEBUG */

// Debug flags
var debugflags = {},
get_debug_flags = function( data )
{
	data = data.split( ',' );
	var i = 0;
	while ( i < data.length )
	{
		debugflags[data[i++]] = 1; 
	}
};
if ( parchment && parchment.options && parchment.options.debug )
{
	get_debug_flags( parchment.options.debug );
}

/* ENDDEBUG */