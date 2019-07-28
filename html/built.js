(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}



// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		out.push(A4(elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		return replacer(A4(elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return elm$core$Maybe$Nothing;
	}
}


function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? elm$core$Result$Ok(value)
		: (value instanceof String)
			? elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var author$project$Model$View = F2(
	function (magnification, offset) {
		return {magnification: magnification, offset: offset};
	});
var author$project$IdMap$IdMap = F2(
	function (dict, nextId) {
		return {dict: dict, nextId: nextId};
	});
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var author$project$IdMap$empty = A2(author$project$IdMap$IdMap, elm$core$Dict$empty, 0);
var elm$core$Basics$False = {$: 'False'};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$List$cons = _List_cons;
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Basics$le = _Utils_le;
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var author$project$Model$initialHistoryValue = {
	cachedRegex: elm$core$Maybe$Nothing,
	cyclesError: false,
	exampleText: {
		cachedMatches: elm$core$Maybe$Nothing,
		contents: A2(elm$core$String$repeat, 12, 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment. Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring. Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.'),
		isEditing: false,
		maxMatches: 4000
	},
	nodes: author$project$IdMap$empty,
	outputNode: {id: elm$core$Maybe$Nothing, locked: false},
	selectedNode: elm$core$Maybe$Nothing
};
var author$project$Vec2$Vec2 = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var author$project$Model$initialValue = {
	dragMode: elm$core$Maybe$Nothing,
	history: {future: _List_Nil, past: _List_Nil, present: author$project$Model$initialHistoryValue},
	search: elm$core$Maybe$Nothing,
	view: A2(
		author$project$Model$View,
		0,
		A2(author$project$Vec2$Vec2, 0, 0))
};
var author$project$Update$FinishSearch = function (a) {
	return {$: 'FinishSearch', a: a};
};
var author$project$Update$ParseRegex = function (a) {
	return {$: 'ParseRegex', a: a};
};
var author$project$Update$SearchMessage = function (a) {
	return {$: 'SearchMessage', a: a};
};
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$True = {$: 'True'};
var elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var author$project$IdMap$isEmpty = function (idMap) {
	return elm$core$Dict$isEmpty(idMap.dict);
};
var author$project$Model$CreateConnection = function (a) {
	return {$: 'CreateConnection', a: a};
};
var author$project$Model$LiteralNode = function (a) {
	return {$: 'LiteralNode', a: a};
};
var author$project$Model$MoveViewDrag = function (a) {
	return {$: 'MoveViewDrag', a: a};
};
var author$project$Model$PrepareEditingConnection = function (a) {
	return {$: 'PrepareEditingConnection', a: a};
};
var author$project$Model$Graph = F2(
	function (blocks, connections) {
		return {blocks: blocks, connections: connections};
	});
var author$project$Model$collectBlocks = F3(
	function (graph, nodeId, nodes) {
		return graph;
	});
var author$project$Model$autolayout = F2(
	function (nodeId, nodes) {
		var graph = A3(
			author$project$Model$collectBlocks,
			A2(author$project$Model$Graph, elm$core$Dict$empty, _List_Nil),
			nodeId,
			nodes);
		return nodes;
	});
var author$project$Update$maxUndoSteps = 100;
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var author$project$Update$advanceHistory = F2(
	function (history, model) {
		return {
			future: _List_Nil,
			past: A2(
				elm$core$List$take,
				author$project$Update$maxUndoSteps,
				A2(elm$core$List$cons, history.present, history.past)),
			present: model
		};
	});
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === 'RBNode_elm_builtin') {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === 'RBNode_elm_builtin') {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === 'RBNode_elm_builtin') {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var author$project$IdMap$remove = F2(
	function (id, idMap) {
		return _Utils_update(
			idMap,
			{
				dict: A2(elm$core$Dict$remove, id, idMap.dict)
			});
	});
var elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2(elm$core$Dict$map, func, left),
				A2(elm$core$Dict$map, func, right));
		}
	});
var author$project$IdMap$updateAll = F2(
	function (mapper, idMap) {
		return _Utils_update(
			idMap,
			{
				dict: A2(
					elm$core$Dict$map,
					F2(
						function (_n0, v) {
							return mapper(v);
						}),
					idMap.dict)
			});
	});
var author$project$Model$AnyRepetitionNode = function (a) {
	return {$: 'AnyRepetitionNode', a: a};
};
var author$project$Model$AtLeastOneNode = function (a) {
	return {$: 'AtLeastOneNode', a: a};
};
var author$project$Model$CaptureNode = function (a) {
	return {$: 'CaptureNode', a: a};
};
var author$project$Model$ExactRepetitionNode = function (a) {
	return {$: 'ExactRepetitionNode', a: a};
};
var author$project$Model$FlagsNode = function (a) {
	return {$: 'FlagsNode', a: a};
};
var author$project$Model$IfFollowedByNode = function (a) {
	return {$: 'IfFollowedByNode', a: a};
};
var author$project$Model$IfNotFollowedByNode = function (a) {
	return {$: 'IfNotFollowedByNode', a: a};
};
var author$project$Model$MaximumRepetitionNode = function (a) {
	return {$: 'MaximumRepetitionNode', a: a};
};
var author$project$Model$MinimumRepetitionNode = function (a) {
	return {$: 'MinimumRepetitionNode', a: a};
};
var author$project$Model$OptionalNode = function (a) {
	return {$: 'OptionalNode', a: a};
};
var author$project$Model$RangedRepetitionNode = function (a) {
	return {$: 'RangedRepetitionNode', a: a};
};
var author$project$Model$SequenceNode = function (a) {
	return {$: 'SequenceNode', a: a};
};
var author$project$Model$SetNode = function (a) {
	return {$: 'SetNode', a: a};
};
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var author$project$Model$ifNotDeleted = F2(
	function (deleted, node) {
		return _Utils_eq(
			node,
			elm$core$Maybe$Just(deleted)) ? elm$core$Maybe$Nothing : node;
	});
var author$project$Model$ifExpressionNotDeleted = F2(
	function (deleted, values) {
		return _Utils_update(
			values,
			{
				expression: A2(author$project$Model$ifNotDeleted, deleted, values.expression)
			});
	});
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var elm$core$Array$filter = F2(
	function (isGood, array) {
		return elm$core$Array$fromList(
			A3(
				elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var elm$core$Basics$neq = _Utils_notEqual;
var author$project$Model$onNodeDeleted = F2(
	function (deleted, node) {
		switch (node.$) {
			case 'SymbolNode':
				return node;
			case 'CharSetNode':
				return node;
			case 'NotInCharSetNode':
				return node;
			case 'LiteralNode':
				return node;
			case 'CharRangeNode':
				return node;
			case 'NotInCharRangeNode':
				return node;
			case 'SetNode':
				var members = node.a;
				return author$project$Model$SetNode(
					A2(
						elm$core$Array$filter,
						elm$core$Basics$neq(deleted),
						members));
			case 'SequenceNode':
				var members = node.a;
				return author$project$Model$SequenceNode(
					A2(
						elm$core$Array$filter,
						elm$core$Basics$neq(deleted),
						members));
			case 'CaptureNode':
				var child = node.a;
				return author$project$Model$CaptureNode(
					A2(author$project$Model$ifNotDeleted, deleted, child));
			case 'OptionalNode':
				var child = node.a;
				return author$project$Model$OptionalNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, child));
			case 'AtLeastOneNode':
				var child = node.a;
				return author$project$Model$AtLeastOneNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, child));
			case 'AnyRepetitionNode':
				var child = node.a;
				return author$project$Model$AnyRepetitionNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, child));
			case 'FlagsNode':
				var value = node.a;
				return author$project$Model$FlagsNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			case 'IfFollowedByNode':
				var value = node.a;
				return author$project$Model$IfFollowedByNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			case 'IfNotFollowedByNode':
				var value = node.a;
				return author$project$Model$IfNotFollowedByNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			case 'RangedRepetitionNode':
				var value = node.a;
				return author$project$Model$RangedRepetitionNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			case 'MinimumRepetitionNode':
				var value = node.a;
				return author$project$Model$MinimumRepetitionNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			case 'MaximumRepetitionNode':
				var value = node.a;
				return author$project$Model$MaximumRepetitionNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
			default:
				var value = node.a;
				return author$project$Model$ExactRepetitionNode(
					A2(author$project$Model$ifExpressionNotDeleted, deleted, value));
		}
	});
var author$project$Build$andMinimal = F2(
	function (min, expression) {
		return min ? (expression + '?') : expression;
	});
var author$project$Build$anyRepetition = F2(
	function (min, expression) {
		return A2(author$project$Build$andMinimal, min, expression + '*');
	});
var author$project$Build$atLeastOne = F2(
	function (min, expression) {
		return A2(author$project$Build$andMinimal, min, expression + '+');
	});
var author$project$Build$buildSymbol = function (symbol) {
	switch (symbol.$) {
		case 'WhitespaceChar':
			return '\\s';
		case 'NonWhitespaceChar':
			return '\\S';
		case 'DigitChar':
			return '\\d';
		case 'NonDigitChar':
			return '\\D';
		case 'WordChar':
			return '\\w';
		case 'NonWordChar':
			return '\\W';
		case 'WordBoundary':
			return '\\b';
		case 'NonWordBoundary':
			return '\\B';
		case 'LinebreakChar':
			return '\\n';
		case 'NonLinebreakChar':
			return '.';
		case 'TabChar':
			return '\\t';
		case 'Never':
			return '(?!)';
		case 'Always':
			return '(.|\\n)';
		case 'Start':
			return '^';
		default:
			return '$';
	}
};
var author$project$Build$capture = function (child) {
	return '(' + (child + ')');
};
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var author$project$Build$escapeChar = F2(
	function (pattern, _char) {
		return A2(elm$core$List$member, _char, pattern) ? _List_fromArray(
			[
				_Utils_chr('\\'),
				_char
			]) : _List_fromArray(
			[_char]);
	});
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$core$String$fromList = _String_fromList;
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var author$project$Build$escapeChars = F2(
	function (pattern, chars) {
		return elm$core$String$fromList(
			A2(
				elm$core$List$concatMap,
				author$project$Build$escapeChar(
					elm$core$String$toList(pattern)),
				elm$core$String$toList(chars)));
	});
var author$project$Build$escapeCharset = author$project$Build$escapeChars('[^-.\\]');
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var author$project$Build$charRange = F2(
	function (start, end) {
		return '[' + (author$project$Build$escapeCharset(
			elm$core$String$fromChar(start)) + ('-' + (author$project$Build$escapeCharset(
			elm$core$String$fromChar(end)) + ']')));
	});
var author$project$Build$charset = function (chars) {
	return '[' + (author$project$Build$escapeCharset(chars) + ']');
};
var author$project$Build$cycles = 'Nodes have cycles';
var elm$core$String$fromInt = _String_fromNumber;
var author$project$Build$exactRepetition = F2(
	function (count, expression) {
		return expression + ('{' + (elm$core$String$fromInt(count) + '}'));
	});
var author$project$Build$ifFollowedBy = F2(
	function (successor, expression) {
		return expression + ('(?=' + (successor + ')'));
	});
var author$project$Build$ifNotFollowedBy = F2(
	function (successor, expression) {
		return expression + ('(?!' + (successor + ')'));
	});
var author$project$Build$escapeLiteral = author$project$Build$escapeChars('[]{}()|^.-+*?!$/\\');
var author$project$Build$literal = function (chars) {
	return author$project$Build$escapeLiteral(chars);
};
var author$project$Build$maximumRepetition = F3(
	function (min, maximum, expression) {
		return A2(
			author$project$Build$andMinimal,
			min,
			expression + ('{0,' + (elm$core$String$fromInt(maximum) + '}')));
	});
var author$project$Build$minimumRepetition = F3(
	function (min, minimum, expression) {
		return A2(
			author$project$Build$andMinimal,
			min,
			expression + ('{' + (elm$core$String$fromInt(minimum) + ',}')));
	});
var author$project$Build$notInCharRange = F2(
	function (start, end) {
		return '[^' + (author$project$Build$escapeCharset(
			elm$core$String$fromChar(start)) + ('-' + (author$project$Build$escapeCharset(
			elm$core$String$fromChar(end)) + ']')));
	});
var author$project$Build$notInCharset = function (chars) {
	return '[^' + (author$project$Build$escapeCharset(chars) + ']');
};
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var author$project$Build$okOrErr = F2(
	function (error, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Result$Ok(value);
		} else {
			return elm$core$Result$Err(error);
		}
	});
var author$project$Build$optional = F2(
	function (min, expression) {
		return A2(author$project$Build$andMinimal, min, expression + '?');
	});
var elm$core$Basics$and = _Basics_and;
var author$project$Build$parenthesesForPrecedence = F3(
	function (ownPrecedence, childPrecedence, child) {
		return ((_Utils_cmp(ownPrecedence, childPrecedence) > 0) && (childPrecedence < 5)) ? ('(?:' + (child + ')')) : child;
	});
var elm$core$String$length = _String_length;
var author$project$Build$precedence = function (node) {
	switch (node.$) {
		case 'FlagsNode':
			return 0;
		case 'SetNode':
			return 1;
		case 'LiteralNode':
			var text = node.a;
			return (elm$core$String$length(text) === 1) ? 5 : 2;
		case 'SequenceNode':
			return 2;
		case 'IfNotFollowedByNode':
			return 3;
		case 'IfFollowedByNode':
			return 3;
		case 'OptionalNode':
			return 4;
		case 'AtLeastOneNode':
			return 4;
		case 'MaximumRepetitionNode':
			return 4;
		case 'MinimumRepetitionNode':
			return 4;
		case 'ExactRepetitionNode':
			return 4;
		case 'RangedRepetitionNode':
			return 4;
		case 'AnyRepetitionNode':
			return 4;
		case 'CharSetNode':
			return 5;
		case 'NotInCharSetNode':
			return 5;
		case 'CharRangeNode':
			return 5;
		case 'NotInCharRangeNode':
			return 5;
		case 'CaptureNode':
			return 5;
		default:
			return 5;
	}
};
var author$project$Build$rangedRepetition = F4(
	function (min, minimum, maximum, expression) {
		return A2(
			author$project$Build$andMinimal,
			min,
			expression + ('{' + (elm$core$String$fromInt(minimum) + (',' + (elm$core$String$fromInt(maximum) + '}')))));
	});
var elm$core$Basics$not = _Basics_not;
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var author$project$Build$sequence = function (members) {
	return (!elm$core$List$isEmpty(members)) ? elm$core$String$concat(members) : '(nothing)';
};
var author$project$Build$set = function (options) {
	return (!elm$core$List$isEmpty(options)) ? A2(elm$core$String$join, '|', options) : '(nothing)';
};
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var author$project$IdMap$get = F2(
	function (id, idMap) {
		return A2(elm$core$Dict$get, id, idMap.dict);
	});
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return elm$core$Result$Err(msg);
		}
	});
var elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 'Err') {
			var x = ra.a;
			return elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 'Err') {
				var x = rb.a;
				return elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$Build$buildExpression = F5(
	function (childMayNeedParens, cost, nodes, ownPrecedence, nodeId) {
		if (cost < 0) {
			return elm$core$Result$Err(author$project$Build$cycles);
		} else {
			if (nodeId.$ === 'Nothing') {
				return elm$core$Result$Ok(
					_Utils_Tuple2(cost, '(nothing)'));
			} else {
				var id = nodeId.a;
				var parens = function (node) {
					return childMayNeedParens ? A2(
						author$project$Build$parenthesesForPrecedence,
						ownPrecedence,
						author$project$Build$precedence(node)) : elm$core$Basics$identity;
				};
				var nodeResult = A2(
					author$project$Build$okOrErr,
					'Internal Error: Invalid Node Id',
					A2(author$project$IdMap$get, id, nodes));
				var build = function (node) {
					return A2(
						elm$core$Result$map,
						elm$core$Tuple$mapSecond(
							parens(node)),
						A3(author$project$Build$buildNodeExpression, cost - 1, nodes, node));
				};
				var built = A2(
					elm$core$Result$andThen,
					A2(
						elm$core$Basics$composeR,
						function ($) {
							return $.node;
						},
						build),
					nodeResult);
				return built;
			}
		}
	});
var author$project$Build$buildNodeExpression = F3(
	function (cost, nodes, node) {
		var ownPrecedence = author$project$Build$precedence(node);
		var build = F3(
			function (childParens, depth, child) {
				return A5(author$project$Build$buildExpression, childParens, depth, nodes, ownPrecedence, child);
			});
		var buildMember = F3(
			function (childParens, element, lastResult) {
				return A2(
					elm$core$Result$andThen,
					function (_n4) {
						var currentCost = _n4.a;
						var builtMembers = _n4.b;
						return A2(
							elm$core$Result$map,
							elm$core$Tuple$mapSecond(
								function (e) {
									return A2(elm$core$List$cons, e, builtMembers);
								}),
							A3(
								build,
								childParens,
								currentCost,
								elm$core$Maybe$Just(element)));
					},
					lastResult);
			});
		var buildMembers = F3(
			function (childParens, join, members) {
				return A2(
					elm$core$Result$map,
					elm$core$Tuple$mapSecond(join),
					A3(
						elm$core$List$foldr,
						buildMember(childParens),
						elm$core$Result$Ok(
							_Utils_Tuple2(cost, _List_Nil)),
						elm$core$Array$toList(members)));
			});
		var buildSingleChild = F3(
			function (childParens, map, child) {
				return A2(
					elm$core$Result$map,
					elm$core$Tuple$mapSecond(map),
					A3(build, childParens, cost, child));
			});
		var buildTwoChildren = F5(
			function (map, childParens1, child1, childParens2, child2) {
				var merge = F2(
					function (_n2, _n3) {
						var firstChild = _n2.b;
						var totalCost = _n3.a;
						var secondChild = _n3.b;
						return _Utils_Tuple2(
							totalCost,
							A2(map, firstChild, secondChild));
					});
				var first = A3(build, childParens1, cost, child1);
				var buildSecond = function (_n1) {
					var firstCost = _n1.a;
					return A3(build, childParens2, firstCost, child2);
				};
				return A3(
					elm$core$Result$map2,
					merge,
					first,
					A2(elm$core$Result$andThen, buildSecond, first));
			});
		var string = function () {
			switch (node.$) {
				case 'SymbolNode':
					var symbol = node.a;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							author$project$Build$buildSymbol(symbol)));
				case 'CharSetNode':
					var chars = node.a;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							author$project$Build$charset(chars)));
				case 'NotInCharSetNode':
					var chars = node.a;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							author$project$Build$notInCharset(chars)));
				case 'CharRangeNode':
					var start = node.a;
					var end = node.b;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							A2(author$project$Build$charRange, start, end)));
				case 'NotInCharRangeNode':
					var start = node.a;
					var end = node.b;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							A2(author$project$Build$notInCharRange, start, end)));
				case 'LiteralNode':
					var chars = node.a;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							cost,
							author$project$Build$literal(chars)));
				case 'SequenceNode':
					var members = node.a;
					return A3(buildMembers, true, author$project$Build$sequence, members);
				case 'SetNode':
					var options = node.a;
					return A3(buildMembers, true, author$project$Build$set, options);
				case 'CaptureNode':
					var child = node.a;
					return A3(buildSingleChild, false, author$project$Build$capture, child);
				case 'FlagsNode':
					var expression = node.a.expression;
					return A3(build, false, cost, expression);
				case 'IfNotFollowedByNode':
					var expression = node.a.expression;
					var successor = node.a.successor;
					return A5(buildTwoChildren, author$project$Build$ifNotFollowedBy, false, successor, true, expression);
				case 'IfFollowedByNode':
					var expression = node.a.expression;
					var successor = node.a.successor;
					return A5(buildTwoChildren, author$project$Build$ifFollowedBy, false, successor, true, expression);
				case 'OptionalNode':
					var expression = node.a.expression;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						author$project$Build$optional(minimal),
						expression);
				case 'AtLeastOneNode':
					var expression = node.a.expression;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						author$project$Build$atLeastOne(minimal),
						expression);
				case 'AnyRepetitionNode':
					var expression = node.a.expression;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						author$project$Build$anyRepetition(minimal),
						expression);
				case 'ExactRepetitionNode':
					var expression = node.a.expression;
					var count = node.a.count;
					return A3(
						buildSingleChild,
						true,
						author$project$Build$exactRepetition(count),
						expression);
				case 'RangedRepetitionNode':
					var expression = node.a.expression;
					var minimum = node.a.minimum;
					var maximum = node.a.maximum;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						A3(author$project$Build$rangedRepetition, minimal, minimum, maximum),
						expression);
				case 'MinimumRepetitionNode':
					var expression = node.a.expression;
					var count = node.a.count;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						A2(author$project$Build$minimumRepetition, minimal, count),
						expression);
				default:
					var expression = node.a.expression;
					var count = node.a.count;
					var minimal = node.a.minimal;
					return A3(
						buildSingleChild,
						true,
						A2(author$project$Build$maximumRepetition, minimal, count),
						expression);
			}
		}();
		return string;
	});
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2(elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var elm$core$Dict$size = function (dict) {
	return A2(elm$core$Dict$sizeHelp, 0, dict);
};
var author$project$IdMap$size = A2(
	elm$core$Basics$composeL,
	elm$core$Dict$size,
	function ($) {
		return $.dict;
	});
var author$project$Model$RegexBuild = F2(
	function (expression, flags) {
		return {expression: expression, flags: flags};
	});
var author$project$Model$RegexFlags = F3(
	function (multiple, caseInsensitive, multiline) {
		return {caseInsensitive: caseInsensitive, multiline: multiline, multiple: multiple};
	});
var author$project$Model$defaultFlags = A3(author$project$Model$RegexFlags, true, false, true);
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Build$buildRegex = F2(
	function (nodes, id) {
		var nodeView = A2(author$project$IdMap$get, id, nodes);
		var options = function () {
			var _n1 = A2(
				elm$core$Maybe$map,
				function ($) {
					return $.node;
				},
				nodeView);
			if ((_n1.$ === 'Just') && (_n1.a.$ === 'FlagsNode')) {
				var flags = _n1.a.a.flags;
				return flags;
			} else {
				return author$project$Model$defaultFlags;
			}
		}();
		var maxCost = author$project$IdMap$size(nodes) * 6;
		var expression = A5(
			author$project$Build$buildExpression,
			false,
			maxCost,
			nodes,
			0,
			elm$core$Maybe$Just(id));
		return A2(
			elm$core$Result$map,
			function (_n0) {
				var string = _n0.b;
				return A2(author$project$Model$RegexBuild, string, options);
			},
			expression);
	});
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var elm$regex$Regex$never = _Regex_never;
var author$project$Build$compileRegex = function (build) {
	var options = {caseInsensitive: build.flags.caseInsensitive, multiline: build.flags.multiline};
	return A2(
		elm$core$Maybe$withDefault,
		elm$regex$Regex$never,
		A2(elm$regex$Regex$fromStringWith, options, build.expression));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			elm$core$String$join,
			after,
			A2(elm$core$String$split, before, string));
	});
var elm$core$String$slice = _String_slice;
var elm$regex$Regex$findAtMost = _Regex_findAtMost;
var author$project$Update$extractMatches = F4(
	function (multiple, maxMatches, text, regex) {
		var visualizeMatch = function (match) {
			return A3(elm$core$String$replace, ' ', '\u200b␣\u200b', match);
		};
		var visualize = function (matchList) {
			return A2(
				elm$core$List$map,
				elm$core$Tuple$mapSecond(visualizeMatch),
				matchList);
		};
		var simplifyMatch = F2(
			function (_n4, alreadySimplified) {
				var before = _n4.a;
				var match = _n4.b;
				if (alreadySimplified.b && (alreadySimplified.a.a === '')) {
					var _n3 = alreadySimplified.a;
					var immediateSuccessor = _n3.b;
					var moreRest = alreadySimplified.b;
					return A2(
						elm$core$List$cons,
						_Utils_Tuple2(
							before,
							_Utils_ap(match, immediateSuccessor)),
						moreRest);
				} else {
					var other = alreadySimplified;
					return A2(
						elm$core$List$cons,
						_Utils_Tuple2(before, match),
						other);
				}
			});
		var simplify = A2(elm$core$List$foldr, simplifyMatch, _List_Nil);
		var matches = A3(
			elm$regex$Regex$findAtMost,
			multiple ? maxMatches : 1,
			regex,
			text);
		var extractMatch = F2(
			function (match, _n1) {
				var textStartIndex = _n1.a;
				var extractedMatches = _n1.b;
				var textBeforeMatch = A3(elm$core$String$slice, textStartIndex, match.index, text);
				var indexAfterMatch = match.index + elm$core$String$length(match.match);
				return _Utils_Tuple2(
					indexAfterMatch,
					_Utils_ap(
						extractedMatches,
						_List_fromArray(
							[
								_Utils_Tuple2(textBeforeMatch, match.match)
							])));
			});
		var extract = function (rawMatches) {
			var _n0 = A3(
				elm$core$List$foldl,
				extractMatch,
				_Utils_Tuple2(0, _List_Nil),
				rawMatches);
			var indexAfterLastMatch = _n0.a;
			var extractedMatches = _n0.b;
			return _Utils_eq(
				elm$core$List$length(matches),
				maxMatches) ? extractedMatches : _Utils_ap(
				extractedMatches,
				_List_fromArray(
					[
						_Utils_Tuple2(
						A3(
							elm$core$String$slice,
							indexAfterLastMatch,
							elm$core$String$length(text),
							text),
						'')
					]));
		};
		return visualize(
			simplify(
				extract(matches)));
	});
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var author$project$Update$updateCache = F2(
	function (model, fallback) {
		var regex = A2(
			elm$core$Maybe$map,
			author$project$Build$buildRegex(model.nodes),
			model.outputNode.id);
		var example = model.exampleText;
		if (_Utils_eq(
			regex,
			elm$core$Maybe$Just(
				elm$core$Result$Err(author$project$Build$cycles)))) {
			return _Utils_update(
				fallback,
				{cyclesError: true});
		} else {
			var multiple = A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeR,
						elm$core$Result$map(
							A2(
								elm$core$Basics$composeR,
								function ($) {
									return $.flags;
								},
								function ($) {
									return $.multiple;
								})),
						elm$core$Result$withDefault(false)),
					regex));
			var compiled = A2(
				elm$core$Maybe$andThen,
				A2(
					elm$core$Basics$composeR,
					elm$core$Result$map(author$project$Build$compileRegex),
					A2(
						elm$core$Basics$composeR,
						elm$core$Result$map(elm$core$Maybe$Just),
						elm$core$Result$withDefault(elm$core$Maybe$Nothing))),
				regex);
			var newExample = _Utils_update(
				example,
				{
					cachedMatches: A2(
						elm$core$Maybe$map,
						A3(author$project$Update$extractMatches, multiple, example.maxMatches, example.contents),
						compiled)
				});
			return _Utils_update(
				model,
				{cachedRegex: regex, cyclesError: false, exampleText: newExample});
		}
	});
var author$project$Update$updatePresent = F2(
	function (model, presentUpdater) {
		var history = model.history;
		return _Utils_update(
			model,
			{
				history: _Utils_update(
					history,
					{
						present: presentUpdater(history.present)
					})
			});
	});
var author$project$Update$deleteNode = F2(
	function (nodeId, model) {
		var output = _Utils_eq(
			model.history.present.outputNode.id,
			elm$core$Maybe$Just(nodeId)) ? elm$core$Maybe$Nothing : model.history.present.outputNode.id;
		var newNodeValues = A2(
			author$project$IdMap$updateAll,
			function (view) {
				return _Utils_update(
					view,
					{
						node: A2(author$project$Model$onNodeDeleted, nodeId, view.node)
					});
			},
			A2(author$project$IdMap$remove, nodeId, model.history.present.nodes));
		var newPresent = function (present) {
			return A2(
				author$project$Update$updateCache,
				_Utils_update(
					present,
					{
						nodes: newNodeValues,
						outputNode: {id: output, locked: present.outputNode.locked}
					}),
				present);
		};
		var newModel = A2(author$project$Update$updatePresent, model, newPresent);
		return _Utils_update(
			newModel,
			{dragMode: elm$core$Maybe$Nothing});
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var author$project$IdMap$insertAnonymous = F2(
	function (value, idMap) {
		return {
			dict: A3(elm$core$Dict$insert, idMap.nextId, value, idMap.dict),
			nextId: idMap.nextId + 1
		};
	});
var author$project$Vec2$add = F2(
	function (a, b) {
		return A2(author$project$Vec2$Vec2, a.x + b.x, a.y + b.y);
	});
var elm$core$Basics$negate = function (n) {
	return -n;
};
var author$project$Update$duplicateNode = F2(
	function (model, nodeId) {
		var nodes = model.nodes;
		var node = A2(author$project$IdMap$get, nodeId, nodes);
		if (node.$ === 'Nothing') {
			return model;
		} else {
			var original = node.a;
			var position = A2(
				author$project$Vec2$add,
				original.position,
				A2(author$project$Vec2$Vec2, 0, -28));
			var clone = _Utils_update(
				original,
				{position: position});
			return _Utils_update(
				model,
				{
					nodes: A2(author$project$IdMap$insertAnonymous, clone, nodes)
				});
		}
	});
var author$project$Update$enableEditingExampleText = F2(
	function (enabled, model) {
		var old = model.exampleText;
		return _Utils_update(
			model,
			{
				exampleText: _Utils_update(
					old,
					{isEditing: enabled})
			});
	});
var author$project$Model$NodeView = F2(
	function (position, node) {
		return {node: node, position: position};
	});
var elm$core$Basics$pow = _Basics_pow;
var author$project$Model$viewTransform = function (_n0) {
	var magnification = _n0.magnification;
	var offset = _n0.offset;
	return {
		scale: A2(elm$core$Basics$pow, 2, magnification * 0.4),
		translate: offset
	};
};
var author$project$Vec2$scale = F2(
	function (s, v) {
		return A2(author$project$Vec2$Vec2, v.x * s, v.y * s);
	});
var author$project$Vec2$sub = F2(
	function (a, b) {
		return A2(author$project$Vec2$Vec2, a.x - b.x, a.y - b.y);
	});
var author$project$Vec2$inverseTransform = F2(
	function (value, transformation) {
		return A2(
			author$project$Vec2$scale,
			1 / transformation.scale,
			A2(author$project$Vec2$sub, value, transformation.translate));
	});
var author$project$Update$insertNode = F2(
	function (node, model) {
		var position = A2(
			author$project$Vec2$inverseTransform,
			A2(author$project$Vec2$Vec2, 800, 400),
			author$project$Model$viewTransform(model.view));
		var newPresent = function (present) {
			return _Utils_update(
				present,
				{
					nodes: A2(
						author$project$IdMap$insertAnonymous,
						A2(author$project$Model$NodeView, position, node),
						present.nodes)
				});
		};
		var newModel = A2(author$project$Update$updatePresent, model, newPresent);
		return _Utils_update(
			newModel,
			{search: elm$core$Maybe$Nothing});
	});
var author$project$Model$MoveNodeDrag = function (a) {
	return {$: 'MoveNodeDrag', a: a};
};
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var author$project$IdMap$update = F3(
	function (id, mapper, idMap) {
		var updateDictValue = function (oldValue) {
			return A2(elm$core$Maybe$map, mapper, oldValue);
		};
		return _Utils_update(
			idMap,
			{
				dict: A3(elm$core$Dict$update, id, updateDictValue, idMap.dict)
			});
	});
var author$project$Update$moveNode = F4(
	function (view, nodes, nodeId, movement) {
		var transform = author$project$Model$viewTransform(view);
		var viewMovement = A2(author$project$Vec2$scale, 1 / transform.scale, movement);
		var updateNodePosition = function (nodeView) {
			return _Utils_update(
				nodeView,
				{
					position: A2(author$project$Vec2$add, nodeView.position, viewMovement)
				});
		};
		return A3(author$project$IdMap$update, nodeId, updateNodePosition, nodes);
	});
var author$project$Update$moveNodeInModel = F4(
	function (newMouse, mouse, node, model) {
		var delta = A2(author$project$Vec2$sub, newMouse, mouse);
		var newPresent = function (present) {
			return _Utils_update(
				present,
				{
					nodes: A4(author$project$Update$moveNode, model.view, present.nodes, node, delta)
				});
		};
		var newModel = A2(author$project$Update$updatePresent, model, newPresent);
		return _Utils_update(
			newModel,
			{
				dragMode: elm$core$Maybe$Just(
					author$project$Model$MoveNodeDrag(
						{mouse: newMouse, node: node}))
			});
	});
var author$project$Update$moveViewInModel = F3(
	function (newMouse, mouse, model) {
		var view = model.view;
		var delta = A2(author$project$Vec2$sub, newMouse, mouse);
		return _Utils_update(
			model,
			{
				dragMode: elm$core$Maybe$Just(
					author$project$Model$MoveViewDrag(
						{mouse: newMouse})),
				view: _Utils_update(
					view,
					{
						offset: A2(author$project$Vec2$add, view.offset, delta)
					})
			});
	});
var author$project$IdMap$insert = F2(
	function (value, idMap) {
		return _Utils_Tuple2(
			idMap.nextId,
			A2(author$project$IdMap$insertAnonymous, value, idMap));
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var author$project$IdMap$insertListWith = F2(
	function (values, idMap) {
		var insertWithInserter = F2(
			function (inserter, _n0) {
				var ids = _n0.a;
				var result = _n0.b;
				return A2(
					elm$core$Tuple$mapFirst,
					function (id) {
						return A2(elm$core$List$cons, id, ids);
					},
					inserter(result));
			});
		return A3(
			elm$core$List$foldr,
			insertWithInserter,
			_Utils_Tuple2(_List_Nil, idMap),
			values);
	});
var author$project$Model$CharRangeNode = F2(
	function (a, b) {
		return {$: 'CharRangeNode', a: a, b: b};
	});
var author$project$Model$CharSetNode = function (a) {
	return {$: 'CharSetNode', a: a};
};
var author$project$Model$NotInCharRangeNode = F2(
	function (a, b) {
		return {$: 'NotInCharRangeNode', a: a, b: b};
	});
var author$project$Model$NotInCharSetNode = function (a) {
	return {$: 'NotInCharSetNode', a: a};
};
var author$project$Model$SymbolNode = function (a) {
	return {$: 'SymbolNode', a: a};
};
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var author$project$Parse$insert = F3(
	function (position, element, nodes) {
		switch (element.$) {
			case 'CompiledSequence':
				var members = element.a;
				var insertChild = F2(
					function (index, child) {
						return A2(
							author$project$Parse$insert,
							A2(
								author$project$Vec2$add,
								position,
								A2(
									author$project$Vec2$Vec2,
									-200,
									75 * (index - ((elm$core$List$length(members) / 2) | 0)))),
							child);
					});
				var _n1 = A2(
					author$project$IdMap$insertListWith,
					A2(elm$core$List$indexedMap, insertChild, members),
					nodes);
				var children = _n1.a;
				var newNodes = _n1.b;
				var node = A2(
					author$project$Model$NodeView,
					position,
					author$project$Model$SequenceNode(
						elm$core$Array$fromList(children)));
				return A2(author$project$IdMap$insert, node, newNodes);
			case 'CompiledCharSequence':
				var sequence = element.a;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$LiteralNode(sequence)),
					nodes);
			case 'CompiledSymbol':
				var symbol = element.a;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$SymbolNode(symbol)),
					nodes);
			case 'CompiledCharRange':
				var inverted = element.a;
				var _n2 = element.b;
				var a = _n2.a;
				var b = _n2.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						A2(
							inverted ? author$project$Model$NotInCharRangeNode : author$project$Model$CharRangeNode,
							a,
							b)),
					nodes);
			case 'CompiledCapture':
				var child = element.a;
				var _n3 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					child,
					nodes);
				var childId = _n3.a;
				var nodesWithChild = _n3.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$CaptureNode(
							elm$core$Maybe$Just(childId))),
					nodesWithChild);
			case 'CompiledCharset':
				var inverted = element.a.inverted;
				var contents = element.a.contents;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						inverted ? author$project$Model$NotInCharSetNode(contents) : author$project$Model$CharSetNode(contents)),
					nodes);
			case 'CompiledSet':
				var options = element.a;
				var insertChild = F2(
					function (index, child) {
						return A2(
							author$project$Parse$insert,
							A2(
								author$project$Vec2$add,
								position,
								A2(
									author$project$Vec2$Vec2,
									-200,
									75 * (index - ((elm$core$List$length(options) / 2) | 0)))),
							child);
					});
				var _n4 = A2(
					author$project$IdMap$insertListWith,
					A2(elm$core$List$indexedMap, insertChild, options),
					nodes);
				var children = _n4.a;
				var newNodes = _n4.b;
				var node = A2(
					author$project$Model$NodeView,
					position,
					author$project$Model$SetNode(
						elm$core$Array$fromList(children)));
				return A2(author$project$IdMap$insert, node, newNodes);
			case 'CompiledIfFollowedBy':
				var expression = element.a.expression;
				var successor = element.a.successor;
				var _n5 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n5.a;
				var nodesWithExpression = _n5.b;
				var _n6 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 75)),
					successor,
					nodesWithExpression);
				var successorId = _n6.a;
				var nodesWithChildren = _n6.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$IfFollowedByNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								successor: elm$core$Maybe$Just(successorId)
							})),
					nodesWithChildren);
			case 'CompiledIfNotFollowedBy':
				var expression = element.a.expression;
				var successor = element.a.successor;
				var _n7 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n7.a;
				var nodesWithExpression = _n7.b;
				var _n8 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 75)),
					successor,
					nodesWithExpression);
				var successorId = _n8.a;
				var nodesWithChildren = _n8.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$IfNotFollowedByNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								successor: elm$core$Maybe$Just(successorId)
							})),
					nodesWithChildren);
			case 'CompiledRangedRepetition':
				var expression = element.a.expression;
				var minimum = element.a.minimum;
				var maximum = element.a.maximum;
				var minimal = element.a.minimal;
				var _n9 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n9.a;
				var nodesWithChild = _n9.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$RangedRepetitionNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								maximum: maximum,
								minimal: minimal,
								minimum: minimum
							})),
					nodesWithChild);
			case 'CompiledOptional':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				var _n10 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n10.a;
				var nodesWithChild = _n10.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$OptionalNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								minimal: minimal
							})),
					nodesWithChild);
			case 'CompiledAtLeastOne':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				var _n11 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n11.a;
				var nodesWithChild = _n11.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$AtLeastOneNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								minimal: minimal
							})),
					nodesWithChild);
			case 'CompiledAnyRepetition':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				var _n12 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n12.a;
				var nodesWithChild = _n12.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$AnyRepetitionNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								minimal: minimal
							})),
					nodesWithChild);
			default:
				var expression = element.a.expression;
				var flags = element.a.flags;
				var _n13 = A3(
					author$project$Parse$insert,
					A2(
						author$project$Vec2$add,
						position,
						A2(author$project$Vec2$Vec2, -200, 0)),
					expression,
					nodes);
				var expressionId = _n13.a;
				var nodesWithChild = _n13.b;
				return A2(
					author$project$IdMap$insert,
					A2(
						author$project$Model$NodeView,
						position,
						author$project$Model$FlagsNode(
							{
								expression: elm$core$Maybe$Just(expressionId),
								flags: flags
							})),
					nodesWithChild);
		}
	});
var author$project$Parse$addCompiledElement = F3(
	function (position, nodes, parsed) {
		return A3(author$project$Parse$insert, position, parsed, nodes);
	});
var author$project$Parse$CompiledAnyRepetition = function (a) {
	return {$: 'CompiledAnyRepetition', a: a};
};
var author$project$Parse$CompiledAtLeastOne = function (a) {
	return {$: 'CompiledAtLeastOne', a: a};
};
var author$project$Parse$CompiledCapture = function (a) {
	return {$: 'CompiledCapture', a: a};
};
var author$project$Parse$CompiledCharSequence = function (a) {
	return {$: 'CompiledCharSequence', a: a};
};
var author$project$Parse$CompiledFlags = function (a) {
	return {$: 'CompiledFlags', a: a};
};
var author$project$Parse$CompiledIfFollowedBy = function (a) {
	return {$: 'CompiledIfFollowedBy', a: a};
};
var author$project$Parse$CompiledIfNotFollowedBy = function (a) {
	return {$: 'CompiledIfNotFollowedBy', a: a};
};
var author$project$Parse$CompiledOptional = function (a) {
	return {$: 'CompiledOptional', a: a};
};
var author$project$Parse$CompiledRangedRepetition = function (a) {
	return {$: 'CompiledRangedRepetition', a: a};
};
var author$project$Parse$CompiledSequence = function (a) {
	return {$: 'CompiledSequence', a: a};
};
var author$project$Parse$CompiledSet = function (a) {
	return {$: 'CompiledSet', a: a};
};
var author$project$Parse$CompiledSymbol = function (a) {
	return {$: 'CompiledSymbol', a: a};
};
var author$project$Parse$compileCharOrSymbol = function (charOrSymbol) {
	switch (charOrSymbol.$) {
		case 'Plain':
			var _char = charOrSymbol.a;
			return author$project$Parse$CompiledCharSequence(
				elm$core$String$fromChar(_char));
		case 'Escaped':
			var symbol = charOrSymbol.a;
			return author$project$Parse$CompiledSymbol(symbol);
		default:
			var _n1 = charOrSymbol.a;
			var a = _n1.a;
			var b = _n1.b;
			return author$project$Parse$CompiledCharSequence(
				elm$core$String$fromChar(a) + ('-' + elm$core$String$fromChar(b)));
	}
};
var author$project$Parse$CompiledCharRange = F2(
	function (a, b) {
		return {$: 'CompiledCharRange', a: a, b: b};
	});
var author$project$Parse$CompiledCharset = function (a) {
	return {$: 'CompiledCharset', a: a};
};
var author$project$Parse$compileCharsetOption = F2(
	function (member, _n0) {
		var chars = _n0.a;
		var symbols = _n0.b;
		var ranges = _n0.c;
		switch (member.$) {
			case 'Plain':
				var _char = member.a;
				return _Utils_Tuple3(
					_Utils_ap(
						elm$core$String$fromChar(_char),
						chars),
					symbols,
					ranges);
			case 'Escaped':
				var symbol = member.a;
				return _Utils_Tuple3(
					chars,
					A2(elm$core$List$cons, symbol, symbols),
					ranges);
			default:
				var _n2 = member.a;
				var start = _n2.a;
				var end = _n2.b;
				return _Utils_Tuple3(
					chars,
					symbols,
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(start, end),
						ranges));
		}
	});
var author$project$Parse$compileCharset = function (_n0) {
	var inverted = _n0.inverted;
	var contents = _n0.contents;
	var _n1 = A3(
		elm$core$List$foldr,
		author$project$Parse$compileCharsetOption,
		_Utils_Tuple3('', _List_Nil, _List_Nil),
		contents);
	_n1$3:
	while (true) {
		_n1$4:
		while (true) {
			if (_n1.b.b) {
				if (_n1.a === '') {
					if ((!_n1.b.b.b) && (!_n1.c.b)) {
						var _n2 = _n1.b;
						var symbol = _n2.a;
						return author$project$Parse$CompiledSymbol(symbol);
					} else {
						break _n1$3;
					}
				} else {
					break _n1$4;
				}
			} else {
				if (!_n1.c.b) {
					var chars = _n1.a;
					return author$project$Parse$CompiledCharset(
						{contents: chars, inverted: inverted});
				} else {
					if (_n1.a === '') {
						if (!_n1.c.b.b) {
							var _n3 = _n1.c;
							var range = _n3.a;
							return A2(author$project$Parse$CompiledCharRange, inverted, range);
						} else {
							break _n1$3;
						}
					} else {
						break _n1$4;
					}
				}
			}
		}
		var chars = _n1.a;
		var symbols = _n1.b;
		var ranges = _n1.c;
		return author$project$Parse$CompiledSet(
			A2(
				elm$core$List$cons,
				author$project$Parse$CompiledCharset(
					{contents: chars, inverted: inverted}),
				_Utils_ap(
					A2(elm$core$List$map, author$project$Parse$CompiledSymbol, symbols),
					A2(
						elm$core$List$map,
						author$project$Parse$CompiledCharRange(inverted),
						ranges))));
	}
	var symbols = _n1.b;
	var ranges = _n1.c;
	return author$project$Parse$CompiledSet(
		_Utils_ap(
			A2(elm$core$List$map, author$project$Parse$CompiledSymbol, symbols),
			A2(
				elm$core$List$map,
				author$project$Parse$CompiledCharRange(inverted),
				ranges)));
};
var author$project$Parse$compile = function (element) {
	compile:
	while (true) {
		switch (element.$) {
			case 'ParsedSet':
				if (element.a.b && (!element.a.b.b)) {
					var _n4 = element.a;
					var onlyOneOption = _n4.a;
					var $temp$element = onlyOneOption;
					element = $temp$element;
					continue compile;
				} else {
					var options = element.a;
					return author$project$Parse$CompiledSet(
						A2(elm$core$List$map, author$project$Parse$compile, options));
				}
			case 'ParsedSequence':
				var manyMembers = element.a;
				return author$project$Parse$compileSequence(manyMembers);
			case 'ParsedCapture':
				var child = element.a;
				return author$project$Parse$CompiledCapture(
					author$project$Parse$compile(child));
			case 'ParsedCharsetAtom':
				var charOrSymbol = element.a;
				return author$project$Parse$compileCharOrSymbol(charOrSymbol);
			case 'ParsedCharset':
				var set = element.a;
				return author$project$Parse$compileCharset(set);
			case 'ParsedIfFollowedBy':
				var expression = element.a.expression;
				var successor = element.a.successor;
				return author$project$Parse$CompiledIfFollowedBy(
					{
						expression: author$project$Parse$compile(expression),
						successor: author$project$Parse$compile(successor)
					});
			case 'ParsedIfNotFollowedBy':
				var expression = element.a.expression;
				var successor = element.a.successor;
				return author$project$Parse$CompiledIfNotFollowedBy(
					{
						expression: author$project$Parse$compile(expression),
						successor: author$project$Parse$compile(successor)
					});
			case 'ParsedRangedRepetition':
				var expression = element.a.expression;
				var minimum = element.a.minimum;
				var maximum = element.a.maximum;
				var minimal = element.a.minimal;
				return author$project$Parse$CompiledRangedRepetition(
					{
						expression: author$project$Parse$compile(expression),
						maximum: maximum,
						minimal: minimal,
						minimum: minimum
					});
			case 'ParsedOptional':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				return author$project$Parse$CompiledOptional(
					{
						expression: author$project$Parse$compile(expression),
						minimal: minimal
					});
			case 'ParsedAnyRepetition':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				return author$project$Parse$CompiledAnyRepetition(
					{
						expression: author$project$Parse$compile(expression),
						minimal: minimal
					});
			case 'ParsedAtLeastOne':
				var expression = element.a.expression;
				var minimal = element.a.minimal;
				return author$project$Parse$CompiledAtLeastOne(
					{
						expression: author$project$Parse$compile(expression),
						minimal: minimal
					});
			default:
				var expression = element.a.expression;
				var flags = element.a.flags;
				return author$project$Parse$CompiledFlags(
					{
						expression: author$project$Parse$compile(expression),
						flags: flags
					});
		}
	}
};
var author$project$Parse$compileSequence = function (members) {
	var _n2 = A3(elm$core$List$foldr, author$project$Parse$compileSequenceMember, _List_Nil, members);
	if (_n2.b && (!_n2.b.b)) {
		var onlyOneMember = _n2.a;
		return onlyOneMember;
	} else {
		var moreMembers = _n2;
		return author$project$Parse$CompiledSequence(moreMembers);
	}
};
var author$project$Parse$compileSequenceMember = F2(
	function (member, compiled) {
		if ((member.$ === 'ParsedCharsetAtom') && (member.a.$ === 'Plain')) {
			var character = member.a.a;
			if (compiled.b && (compiled.a.$ === 'CompiledCharSequence')) {
				var collapsed = compiled.a.a;
				var alreadyCompiled = compiled.b;
				return A2(
					elm$core$List$cons,
					author$project$Parse$CompiledCharSequence(
						_Utils_ap(
							elm$core$String$fromChar(character),
							collapsed)),
					alreadyCompiled);
			} else {
				var nonCharsequenceCompiled = compiled;
				return A2(
					elm$core$List$cons,
					author$project$Parse$CompiledCharSequence(
						elm$core$String$fromChar(character)),
					nonCharsequenceCompiled);
			}
		} else {
			var symbol = member;
			return A2(
				elm$core$List$cons,
				author$project$Parse$compile(symbol),
				compiled);
		}
	});
var author$project$Parse$ParsedFlags = function (a) {
	return {$: 'ParsedFlags', a: a};
};
var author$project$Parse$ParsedAnyRepetition = function (a) {
	return {$: 'ParsedAnyRepetition', a: a};
};
var author$project$Parse$ParsedAtLeastOne = function (a) {
	return {$: 'ParsedAtLeastOne', a: a};
};
var author$project$Parse$ParsedCapture = function (a) {
	return {$: 'ParsedCapture', a: a};
};
var author$project$Parse$ParsedIfFollowedBy = function (a) {
	return {$: 'ParsedIfFollowedBy', a: a};
};
var author$project$Parse$ParsedIfNotFollowedBy = function (a) {
	return {$: 'ParsedIfNotFollowedBy', a: a};
};
var author$project$Parse$ParsedOptional = function (a) {
	return {$: 'ParsedOptional', a: a};
};
var author$project$Parse$ParsedSequence = function (a) {
	return {$: 'ParsedSequence', a: a};
};
var author$project$Parse$ParsedSet = function (a) {
	return {$: 'ParsedSet', a: a};
};
var author$project$Parse$appendTo = F2(
	function (list, element) {
		return _Utils_ap(
			list,
			_List_fromArray(
				[element]));
	});
var author$project$Parse$ParsedCharset = function (a) {
	return {$: 'ParsedCharset', a: a};
};
var author$project$Parse$Expected = function (a) {
	return {$: 'Expected', a: a};
};
var author$project$Parse$Plain = function (a) {
	return {$: 'Plain', a: a};
};
var author$project$Parse$Range = function (a) {
	return {$: 'Range', a: a};
};
var author$project$Parse$atomToCharOrErr = function (_n0) {
	var atom = _n0.a;
	var rest = _n0.b;
	if (atom.$ === 'Plain') {
		var _char = atom.a;
		return elm$core$Result$Ok(
			_Utils_Tuple2(_char, rest));
	} else {
		return elm$core$Result$Err(
			author$project$Parse$Expected('Plain Character'));
	}
};
var author$project$Parse$maybeOptions = F3(
	function (first, second, value) {
		var _n0 = first(value);
		if (_n0.$ === 'Just') {
			var result = _n0.a;
			return elm$core$Maybe$Just(result);
		} else {
			return second(value);
		}
	});
var author$project$Parse$Escaped = function (a) {
	return {$: 'Escaped', a: a};
};
var author$project$Parse$ExpectedMoreChars = {$: 'ExpectedMoreChars'};
var author$project$Parse$okOrErr = function (error) {
	return A2(
		elm$core$Basics$composeR,
		elm$core$Maybe$map(elm$core$Result$Ok),
		elm$core$Maybe$withDefault(
			elm$core$Result$Err(error)));
};
var elm$core$String$uncons = _String_uncons;
var author$project$Parse$parseSingleChar = function (string) {
	return A2(
		author$project$Parse$okOrErr,
		author$project$Parse$ExpectedMoreChars,
		elm$core$String$uncons(string));
};
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var author$project$Parse$skipIfNext = F2(
	function (symbol, text) {
		return A2(elm$core$String$startsWith, symbol, text) ? _Utils_Tuple2(
			true,
			A2(
				elm$core$String$dropLeft,
				elm$core$String$length(symbol),
				text)) : _Utils_Tuple2(false, text);
	});
var author$project$Parse$parseAtomicChar = F2(
	function (escape, text) {
		var symbolOrElsePlainChar = function (character) {
			return A2(
				elm$core$Maybe$withDefault,
				author$project$Parse$Plain(character),
				A2(
					elm$core$Maybe$map,
					author$project$Parse$Escaped,
					escape(character)));
		};
		var _n0 = A2(
			elm$core$Tuple$mapSecond,
			author$project$Parse$parseSingleChar,
			A2(author$project$Parse$skipIfNext, '\\', text));
		var isEscaped = _n0.a;
		var charSubResult = _n0.b;
		return isEscaped ? A2(
			elm$core$Result$map,
			elm$core$Tuple$mapFirst(symbolOrElsePlainChar),
			charSubResult) : A2(
			elm$core$Result$map,
			elm$core$Tuple$mapFirst(author$project$Parse$Plain),
			charSubResult);
	});
var author$project$Model$DigitChar = {$: 'DigitChar'};
var author$project$Model$NonDigitChar = {$: 'NonDigitChar'};
var author$project$Model$NonWhitespaceChar = {$: 'NonWhitespaceChar'};
var author$project$Model$NonWordBoundary = {$: 'NonWordBoundary'};
var author$project$Model$NonWordChar = {$: 'NonWordChar'};
var author$project$Model$WhitespaceChar = {$: 'WhitespaceChar'};
var author$project$Model$WordBoundary = {$: 'WordBoundary'};
var author$project$Model$WordChar = {$: 'WordChar'};
var author$project$Parse$symbolizeLetterbased = function (token) {
	switch (token.valueOf()) {
		case 'd':
			return elm$core$Maybe$Just(author$project$Model$DigitChar);
		case 'D':
			return elm$core$Maybe$Just(author$project$Model$NonDigitChar);
		case 's':
			return elm$core$Maybe$Just(author$project$Model$WhitespaceChar);
		case 'S':
			return elm$core$Maybe$Just(author$project$Model$NonWhitespaceChar);
		case 'w':
			return elm$core$Maybe$Just(author$project$Model$WordChar);
		case 'W':
			return elm$core$Maybe$Just(author$project$Model$NonWordChar);
		case 'b':
			return elm$core$Maybe$Just(author$project$Model$WordBoundary);
		case 'B':
			return elm$core$Maybe$Just(author$project$Model$NonWordBoundary);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Model$LinebreakChar = {$: 'LinebreakChar'};
var author$project$Model$NonLinebreakChar = {$: 'NonLinebreakChar'};
var author$project$Model$TabChar = {$: 'TabChar'};
var author$project$Parse$symbolizeTabLinebreakDot = function (token) {
	switch (token.valueOf()) {
		case 't':
			return elm$core$Maybe$Just(author$project$Model$TabChar);
		case 'n':
			return elm$core$Maybe$Just(author$project$Model$LinebreakChar);
		case '.':
			return elm$core$Maybe$Just(author$project$Model$NonLinebreakChar);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var author$project$Parse$parseCharsetAtom = function (text) {
	var atom = author$project$Parse$parseAtomicChar(
		A2(author$project$Parse$maybeOptions, author$project$Parse$symbolizeLetterbased, author$project$Parse$symbolizeTabLinebreakDot));
	var extractRange = function (_n3) {
		var firstAtom = _n3.a;
		var remaining = _n3.b;
		var _n2 = A2(author$project$Parse$skipIfNext, '-', remaining);
		if (_n2.a) {
			var rest = _n2.b;
			return A2(
				elm$core$Result$map,
				elm$core$Tuple$mapFirst(
					A2(
						elm$core$Basics$composeR,
						elm$core$Tuple$pair(firstAtom),
						author$project$Parse$Range)),
				A2(
					elm$core$Result$andThen,
					author$project$Parse$atomToCharOrErr,
					atom(rest)));
		} else {
			return elm$core$Result$Ok(
				_Utils_Tuple2(
					author$project$Parse$Plain(firstAtom),
					remaining));
		}
	};
	var _n0 = atom(text);
	if ((_n0.$ === 'Ok') && (_n0.a.a.$ === 'Plain')) {
		var _n1 = _n0.a;
		var _char = _n1.a.a;
		var rest = _n1.b;
		return extractRange(
			_Utils_Tuple2(_char, rest));
	} else {
		var other = _n0;
		return other;
	}
};
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var author$project$Parse$extendCharset = function (current) {
	if (current.$ === 'Err') {
		var error = current.a;
		return elm$core$Result$Err(error);
	} else {
		var _n1 = current.a;
		var options = _n1.a;
		var remaining = _n1.b;
		if (elm$core$String$isEmpty(remaining)) {
			return elm$core$Result$Err(
				author$project$Parse$Expected(']'));
		} else {
			var _n2 = A2(author$project$Parse$skipIfNext, ']', remaining);
			if (_n2.a) {
				var rest = _n2.b;
				return elm$core$Result$Ok(
					_Utils_Tuple2(options, rest));
			} else {
				var rest = _n2.b;
				return author$project$Parse$extendCharset(
					A2(
						elm$core$Result$map,
						elm$core$Tuple$mapFirst(
							author$project$Parse$appendTo(options)),
						author$project$Parse$parseCharsetAtom(rest)));
			}
		}
	}
};
var author$project$Parse$skipOrErr = F2(
	function (symbol, text) {
		return A2(elm$core$String$startsWith, symbol, text) ? elm$core$Result$Ok(
			A2(
				elm$core$String$dropLeft,
				elm$core$String$length(symbol),
				text)) : elm$core$Result$Err(
			author$project$Parse$Expected(symbol));
	});
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var author$project$Parse$parseCharset = function (text) {
	var withoutBracket = A2(author$project$Parse$skipOrErr, '[', text);
	var inversion = A2(
		elm$core$Result$map,
		author$project$Parse$skipIfNext('^'),
		withoutBracket);
	var contents = author$project$Parse$extendCharset(
		A2(
			elm$core$Result$map,
			elm$core$Tuple$mapFirst(
				elm$core$Basics$always(_List_Nil)),
			inversion));
	var charsetFromResults = F2(
		function (_n0, _n1) {
			var inverted = _n0.a;
			var options = _n1.a;
			var remaining = _n1.b;
			return _Utils_Tuple2(
				author$project$Parse$ParsedCharset(
					{contents: options, inverted: inverted}),
				remaining);
		});
	return A3(elm$core$Result$map2, charsetFromResults, inversion, contents);
};
var author$project$Model$End = {$: 'End'};
var author$project$Model$Start = {$: 'Start'};
var author$project$Parse$ParsedCharsetAtom = function (a) {
	return {$: 'ParsedCharsetAtom', a: a};
};
var author$project$Parse$symbolizeTabLinebreak = function (token) {
	switch (token.valueOf()) {
		case 't':
			return elm$core$Maybe$Just(author$project$Model$TabChar);
		case 'n':
			return elm$core$Maybe$Just(author$project$Model$LinebreakChar);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Parse$parseGenericAtomicChar = function (text) {
	var _n0 = elm$core$String$uncons(text);
	_n0$3:
	while (true) {
		if (_n0.$ === 'Just') {
			switch (_n0.a.a.valueOf()) {
				case '.':
					var _n1 = _n0.a;
					var rest = _n1.b;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							author$project$Parse$ParsedCharsetAtom(
								author$project$Parse$Escaped(author$project$Model$NonLinebreakChar)),
							rest));
				case '$':
					var _n2 = _n0.a;
					var rest = _n2.b;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							author$project$Parse$ParsedCharsetAtom(
								author$project$Parse$Escaped(author$project$Model$End)),
							rest));
				case '^':
					var _n3 = _n0.a;
					var rest = _n3.b;
					return elm$core$Result$Ok(
						_Utils_Tuple2(
							author$project$Parse$ParsedCharsetAtom(
								author$project$Parse$Escaped(author$project$Model$Start)),
							rest));
				default:
					break _n0$3;
			}
		} else {
			break _n0$3;
		}
	}
	return A2(
		elm$core$Result$map,
		elm$core$Tuple$mapFirst(author$project$Parse$ParsedCharsetAtom),
		A2(
			author$project$Parse$parseAtomicChar,
			A2(author$project$Parse$maybeOptions, author$project$Parse$symbolizeLetterbased, author$project$Parse$symbolizeTabLinebreak),
			text));
};
var elm$core$Basics$or = _Basics_or;
var elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var author$project$Parse$extendSequence = function (current) {
	if (current.$ === 'Err') {
		var error = current.a;
		return elm$core$Result$Err(error);
	} else {
		var _n14 = current.a;
		var members = _n14.a;
		var text = _n14.b;
		return (elm$core$String$isEmpty(text) || (A2(elm$core$String$startsWith, ')', text) || (A2(elm$core$String$startsWith, '|', text) || A2(elm$core$String$startsWith, '/', text)))) ? elm$core$Result$Ok(
			_Utils_Tuple2(members, text)) : author$project$Parse$extendSequence(
			A2(
				elm$core$Result$map,
				elm$core$Tuple$mapFirst(
					author$project$Parse$appendTo(members)),
				author$project$Parse$parseLookAhead(text)));
	}
};
var author$project$Parse$extendSet = function (current) {
	if (current.$ === 'Err') {
		var error = current.a;
		return elm$core$Result$Err(error);
	} else {
		var _n11 = current.a;
		var options = _n11.a;
		var text = _n11.b;
		var _n12 = A2(author$project$Parse$skipIfNext, '|', text);
		if (_n12.a) {
			var rest = _n12.b;
			return author$project$Parse$extendSet(
				A2(
					elm$core$Result$map,
					elm$core$Tuple$mapFirst(
						author$project$Parse$appendTo(options)),
					author$project$Parse$parseSequence(rest)));
		} else {
			var rest = _n12.b;
			return elm$core$Result$Ok(
				_Utils_Tuple2(options, rest));
		}
	}
};
var author$project$Parse$parseAnyRepetition = function (text) {
	var parseIt = function (_n9) {
		var expression = _n9.a;
		var rest = _n9.b;
		var _n7 = A2(author$project$Parse$skipIfNext, '*', rest);
		var optional = _n7.a;
		var rest1 = _n7.b;
		var _n8 = optional ? A2(author$project$Parse$skipIfNext, '?', rest1) : _Utils_Tuple2(false, rest1);
		var isLazy = _n8.a;
		var rest2 = _n8.b;
		return optional ? _Utils_Tuple2(
			author$project$Parse$ParsedAnyRepetition(
				{expression: expression, minimal: isLazy}),
			rest2) : _Utils_Tuple2(expression, rest2);
	};
	var expressionResult = author$project$Parse$parseRangedRepetition(text);
	return A2(elm$core$Result$map, parseIt, expressionResult);
};
var author$project$Parse$parseAtLeastOne = function (text) {
	var parseIt = function (_n6) {
		var expression = _n6.a;
		var rest = _n6.b;
		var _n4 = A2(author$project$Parse$skipIfNext, '+', rest);
		var optional = _n4.a;
		var rest1 = _n4.b;
		var _n5 = optional ? A2(author$project$Parse$skipIfNext, '?', rest1) : _Utils_Tuple2(false, rest1);
		var isLazy = _n5.a;
		var rest2 = _n5.b;
		return optional ? _Utils_Tuple2(
			author$project$Parse$ParsedAtLeastOne(
				{expression: expression, minimal: isLazy}),
			rest2) : _Utils_Tuple2(expression, rest2);
	};
	var expressionResult = author$project$Parse$parseAnyRepetition(text);
	return A2(elm$core$Result$map, parseIt, expressionResult);
};
var author$project$Parse$parseAtom = function (text) {
	var isNext = function (character) {
		return A2(elm$core$String$startsWith, character, text);
	};
	return isNext('[') ? author$project$Parse$parseCharset(text) : (isNext('(?:') ? author$project$Parse$cyclic$parseGroup()(text) : (isNext('(') ? author$project$Parse$cyclic$parseCapturingGroup()(text) : author$project$Parse$parseGenericAtomicChar(text)));
};
var author$project$Parse$parseLookAhead = function (text) {
	var extract = function (_n3) {
		var content = _n3.a;
		var rest = _n3.b;
		return A2(elm$core$String$startsWith, '(?=', rest) ? A3(
			author$project$Parse$parseParentheses,
			function (s) {
				return author$project$Parse$ParsedIfFollowedBy(
					{expression: content, successor: s});
			},
			'(?=',
			rest) : (A2(elm$core$String$startsWith, '(?!', rest) ? A3(
			author$project$Parse$parseParentheses,
			function (s) {
				return author$project$Parse$ParsedIfNotFollowedBy(
					{expression: content, successor: s});
			},
			'(?!',
			rest) : elm$core$Result$Ok(
			_Utils_Tuple2(content, rest)));
	};
	var expressionResult = author$project$Parse$parseQuantified(text);
	return A2(elm$core$Result$andThen, extract, expressionResult);
};
var author$project$Parse$parseOptional = function (text) {
	var parseIt = function (_n2) {
		var expression = _n2.a;
		var rest = _n2.b;
		var _n0 = A2(author$project$Parse$skipIfNext, '?', rest);
		var optional = _n0.a;
		var rest1 = _n0.b;
		var _n1 = optional ? A2(author$project$Parse$skipIfNext, '?', rest1) : _Utils_Tuple2(false, rest1);
		var isLazy = _n1.a;
		var rest2 = _n1.b;
		return optional ? _Utils_Tuple2(
			author$project$Parse$ParsedOptional(
				{expression: expression, minimal: isLazy}),
			rest2) : _Utils_Tuple2(expression, rest2);
	};
	var expressionResult = author$project$Parse$parseAtLeastOne(text);
	return A2(elm$core$Result$map, parseIt, expressionResult);
};
var author$project$Parse$parseParentheses = F3(
	function (map, openParens, text) {
		var contents = A2(author$project$Parse$skipOrErr, openParens, text);
		var result = A2(elm$core$Result$andThen, author$project$Parse$parseSet, contents);
		return A2(
			elm$core$Result$map,
			elm$core$Tuple$mapFirst(map),
			A2(
				elm$core$Result$map,
				elm$core$Tuple$mapSecond(
					elm$core$String$dropLeft(1)),
				result));
	});
var author$project$Parse$parseQuantified = function (text) {
	return author$project$Parse$parseOptional(text);
};
var author$project$Parse$parseRangedRepetition = function (text) {
	return author$project$Parse$parseAtom(text);
};
var author$project$Parse$parseSequence = function (text) {
	return A2(
		elm$core$Result$map,
		elm$core$Tuple$mapFirst(author$project$Parse$ParsedSequence),
		author$project$Parse$extendSequence(
			elm$core$Result$Ok(
				_Utils_Tuple2(_List_Nil, text))));
};
var author$project$Parse$parseSet = function (text) {
	var firstOption = A2(
		elm$core$Result$map,
		elm$core$Tuple$mapFirst(elm$core$List$singleton),
		author$project$Parse$parseSequence(text));
	return A2(
		elm$core$Result$map,
		elm$core$Tuple$mapFirst(author$project$Parse$ParsedSet),
		author$project$Parse$extendSet(firstOption));
};
function author$project$Parse$cyclic$parseCapturingGroup() {
	return A2(author$project$Parse$parseParentheses, author$project$Parse$ParsedCapture, '(');
}
function author$project$Parse$cyclic$parseGroup() {
	return A2(author$project$Parse$parseParentheses, elm$core$Basics$identity, '(?:');
}
try {
	var author$project$Parse$parseCapturingGroup = author$project$Parse$cyclic$parseCapturingGroup();
	author$project$Parse$cyclic$parseCapturingGroup = function () {
		return author$project$Parse$parseCapturingGroup;
	};
	var author$project$Parse$parseGroup = author$project$Parse$cyclic$parseGroup();
	author$project$Parse$cyclic$parseGroup = function () {
		return author$project$Parse$parseGroup;
	};
} catch ($) {
throw 'Some top-level definitions from `Parse` are causing infinite recursion:\n\n  ┌─────┐\n  │    extendSequence\n  │     ↓\n  │    extendSet\n  │     ↓\n  │    parseAnyRepetition\n  │     ↓\n  │    parseAtLeastOne\n  │     ↓\n  │    parseAtom\n  │     ↓\n  │    parseCapturingGroup\n  │     ↓\n  │    parseGroup\n  │     ↓\n  │    parseLookAhead\n  │     ↓\n  │    parseOptional\n  │     ↓\n  │    parseParentheses\n  │     ↓\n  │    parseQuantified\n  │     ↓\n  │    parseRangedRepetition\n  │     ↓\n  │    parseSequence\n  │     ↓\n  │    parseSet\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.0/halting-problem to learn how to fix it!';}
var elm$core$String$contains = _String_contains;
var author$project$Parse$parseFlags = function (text) {
	var wrapInFlags = F2(
		function (content, flags) {
			return (!_Utils_eq(flags, author$project$Model$defaultFlags)) ? author$project$Parse$ParsedFlags(
				{expression: content, flags: flags}) : content;
		});
	var parseRegexFlags = function (chars) {
		return A3(
			author$project$Model$RegexFlags,
			A2(elm$core$String$contains, 'g', chars),
			A2(elm$core$String$contains, 'i', chars),
			A2(elm$core$String$contains, 'm', chars));
	};
	var parseModifiers = function (_n1) {
		var content = _n1.a;
		var remaining1 = _n1.b;
		var skipSlash = A2(author$project$Parse$skipOrErr, '/', remaining1);
		var flags = A2(elm$core$Result$map, parseRegexFlags, skipSlash);
		return A2(
			elm$core$Result$map,
			wrapInFlags(content),
			flags);
	};
	var _n0 = A2(author$project$Parse$skipIfNext, '/', text);
	var hasModifiers = _n0.a;
	var remaining = _n0.b;
	var expression = author$project$Parse$parseSet(remaining);
	return hasModifiers ? A2(elm$core$Result$andThen, parseModifiers, expression) : A2(elm$core$Result$map, elm$core$Tuple$first, expression);
};
var author$project$Parse$parse = function (regex) {
	return author$project$Parse$parseFlags(regex);
};
var author$project$Parse$addParsedRegexNode = F3(
	function (position, nodes, regex) {
		return A2(
			elm$core$Result$map,
			A2(
				elm$core$Basics$composeR,
				author$project$Parse$compile,
				A2(author$project$Parse$addCompiledElement, position, nodes)),
			author$project$Parse$parse(regex));
	});
var author$project$Update$selectNode = F2(
	function (node, model) {
		var safeModel = _Utils_update(
			model,
			{
				selectedNode: elm$core$Maybe$Just(node)
			});
		var possiblyInvalidModel = _Utils_update(
			safeModel,
			{
				outputNode: ((!model.outputNode.locked) || _Utils_eq(model.outputNode.id, elm$core$Maybe$Nothing)) ? {
					id: elm$core$Maybe$Just(node),
					locked: model.outputNode.locked
				} : model.outputNode
			});
		return (!_Utils_eq(model.outputNode.id, possiblyInvalidModel.outputNode.id)) ? A2(author$project$Update$updateCache, possiblyInvalidModel, safeModel) : possiblyInvalidModel;
	});
var author$project$Update$parseRegexNodes = F2(
	function (model, regex) {
		var position = A2(
			author$project$Vec2$inverseTransform,
			A2(author$project$Vec2$Vec2, 1000, 400),
			author$project$Model$viewTransform(model.view));
		var history = model.history;
		var coreModel = history.present;
		var resultHistory = F2(
			function (resultNodeId, nodes) {
				return _Utils_update(
					history,
					{
						present: A2(
							author$project$Update$selectNode,
							resultNodeId,
							_Utils_update(
								coreModel,
								{
									nodes: A2(author$project$Model$autolayout, resultNodeId, nodes)
								}))
					});
			});
		var resultModel = function (_n0) {
			var resultNodeId = _n0.a;
			var nodes = _n0.b;
			return _Utils_update(
				model,
				{
					history: A2(resultHistory, resultNodeId, nodes),
					search: elm$core$Maybe$Nothing
				});
		};
		var resultNodes = A3(author$project$Parse$addParsedRegexNode, position, coreModel.nodes, regex);
		return A2(
			elm$core$Result$withDefault,
			model,
			A2(elm$core$Result$map, resultModel, resultNodes));
	});
var author$project$Model$RetainPrototypedConnection = function (a) {
	return {$: 'RetainPrototypedConnection', a: a};
};
var author$project$Update$updateNode = F3(
	function (nodes, id, newNode) {
		return A3(
			author$project$IdMap$update,
			id,
			function (nodeView) {
				return _Utils_update(
					nodeView,
					{node: newNode});
			},
			nodes);
	});
var author$project$Update$realizeConnection = F4(
	function (model, nodeId, newNode, mouse) {
		var newPresent = function (present) {
			return A2(
				author$project$Update$updateCache,
				_Utils_update(
					present,
					{
						nodes: A3(author$project$Update$updateNode, present.nodes, nodeId, newNode)
					}),
				present);
		};
		var newModel = A2(author$project$Update$updatePresent, model, newPresent);
		var newDragMode = author$project$Model$RetainPrototypedConnection(
			{
				mouse: mouse,
				node: nodeId,
				previousNodeValue: A2(
					elm$core$Maybe$map,
					function ($) {
						return $.node;
					},
					A2(author$project$IdMap$get, nodeId, model.history.present.nodes))
			});
		return _Utils_update(
			newModel,
			{
				dragMode: elm$core$Maybe$Just(newDragMode)
			});
	});
var author$project$Update$redo = function (history) {
	var _n0 = history.future;
	if (_n0.b) {
		var next = _n0.a;
		var newer = _n0.b;
		return {
			future: newer,
			past: A2(elm$core$List$cons, history.present, history.past),
			present: next
		};
	} else {
		return history;
	}
};
var author$project$Update$startEditingConnection = F5(
	function (nodeId, node, currentSupplier, mouse, model) {
		var newPresent = function (present) {
			return A2(
				author$project$Update$updateCache,
				_Utils_update(
					present,
					{
						nodes: A3(author$project$Update$updateNode, present.nodes, nodeId, node)
					}),
				present);
		};
		var newModel = A2(author$project$Update$updatePresent, model, newPresent);
		var updateIt = function (oldSupplier) {
			return _Utils_update(
				newModel,
				{
					dragMode: elm$core$Maybe$Just(
						author$project$Model$CreateConnection(
							{openEnd: mouse, supplier: oldSupplier}))
				});
		};
		return A2(
			elm$core$Maybe$withDefault,
			model,
			A2(elm$core$Maybe$map, updateIt, currentSupplier));
	});
var author$project$Update$startNodeMove = F3(
	function (mouse, node, model) {
		var history = model.history;
		var present = history.present;
		return _Utils_update(
			model,
			{
				dragMode: elm$core$Maybe$Just(
					author$project$Model$MoveNodeDrag(
						{mouse: mouse, node: node})),
				history: _Utils_update(
					history,
					{
						present: A2(author$project$Update$selectNode, node, present)
					})
			});
	});
var author$project$Update$stopEditingExampleText = function (model) {
	return A2(
		author$project$Update$updatePresent,
		model,
		author$project$Update$enableEditingExampleText(false));
};
var author$project$Update$undo = function (history) {
	var _n0 = history.past;
	if (_n0.b) {
		var last = _n0.a;
		var older = _n0.b;
		return {
			future: A2(elm$core$List$cons, history.present, history.future),
			past: older,
			present: last
		};
	} else {
		return history;
	}
};
var author$project$Update$updateView = F3(
	function (amount, focus, oldView) {
		var oldTransform = author$project$Model$viewTransform(oldView);
		var magnification = oldView.magnification + amount;
		var transform = author$project$Model$viewTransform(
			{magnification: magnification, offset: oldView.offset});
		var deltaScale = transform.scale / oldTransform.scale;
		var newView = ((transform.scale < 0.1) || (transform.scale > 16)) ? oldView : {
			magnification: magnification,
			offset: {x: ((oldView.offset.x - focus.x) * deltaScale) + focus.x, y: ((oldView.offset.y - focus.y) * deltaScale) + focus.y}
		};
		return newView;
	});
var author$project$Update$update = F2(
	function (message, model) {
		var coreModel = model.history.present;
		var advanceModel = function (newModel) {
			return _Utils_update(
				newModel,
				{
					history: A2(author$project$Update$advanceHistory, model.history, newModel.history.present)
				});
		};
		var advance = function (newPresent) {
			return _Utils_update(
				model,
				{
					history: A2(author$project$Update$advanceHistory, model.history, newPresent)
				});
		};
		switch (message.$) {
			case 'DoNothing':
				return model;
			case 'Undo':
				return _Utils_update(
					model,
					{
						history: author$project$Update$undo(model.history)
					});
			case 'Redo':
				return _Utils_update(
					model,
					{
						history: author$project$Update$redo(model.history)
					});
			case 'DismissCyclesError':
				return advance(
					_Utils_update(
						coreModel,
						{cyclesError: false}));
			case 'Deselect':
				return coreModel.outputNode.locked ? advance(
					_Utils_update(
						coreModel,
						{selectedNode: elm$core$Maybe$Nothing})) : advance(
					A2(
						author$project$Update$updateCache,
						_Utils_update(
							coreModel,
							{
								outputNode: {id: elm$core$Maybe$Nothing, locked: false},
								selectedNode: elm$core$Maybe$Nothing
							}),
						coreModel));
			case 'UpdateExampleText':
				var textMessage = message.a;
				switch (textMessage.$) {
					case 'SetEditing':
						var enabled = textMessage.a;
						return (!enabled) ? advance(
							A2(
								author$project$Update$updateCache,
								A2(author$project$Update$enableEditingExampleText, enabled, coreModel),
								coreModel)) : advance(
							A2(author$project$Update$enableEditingExampleText, enabled, coreModel));
					case 'UpdateContents':
						var text = textMessage.a;
						var old = coreModel.exampleText;
						return advance(
							_Utils_update(
								coreModel,
								{
									exampleText: _Utils_update(
										old,
										{contents: text})
								}));
					default:
						var limit = textMessage.a;
						var old = coreModel.exampleText;
						return advance(
							_Utils_update(
								coreModel,
								{
									exampleText: _Utils_update(
										old,
										{maxMatches: limit})
								}));
				}
			case 'UpdateView':
				var viewMessage = message.a;
				if (coreModel.exampleText.isEditing || author$project$IdMap$isEmpty(coreModel.nodes)) {
					return model;
				} else {
					var amount = viewMessage.a.amount;
					var focus = viewMessage.a.focus;
					return _Utils_update(
						model,
						{
							view: A3(author$project$Update$updateView, amount, focus, model.view)
						});
				}
			case 'SetOutputLocked':
				var locked = message.a;
				return advance(
					_Utils_update(
						coreModel,
						{
							outputNode: {id: coreModel.outputNode.id, locked: locked}
						}));
			case 'UpdateNodeMessage':
				var id = message.a;
				var value = message.b;
				return advance(
					A2(
						author$project$Update$updateCache,
						_Utils_update(
							coreModel,
							{
								nodes: A3(author$project$Update$updateNode, coreModel.nodes, id, value)
							}),
						coreModel));
			case 'DuplicateNode':
				var id = message.a;
				return advance(
					A2(author$project$Update$duplicateNode, coreModel, id));
			case 'DeleteNode':
				var id = message.a;
				return advanceModel(
					A2(author$project$Update$deleteNode, id, model));
			case 'AutoLayout':
				var id = message.a;
				return advance(
					_Utils_update(
						coreModel,
						{
							nodes: A2(author$project$Model$autolayout, id, coreModel.nodes)
						}));
			case 'SearchMessage':
				var searchMessage = message.a;
				if (searchMessage.$ === 'UpdateSearch') {
					var query = searchMessage.a;
					return _Utils_update(
						model,
						{
							search: elm$core$Maybe$Just(query)
						});
				} else {
					var result = searchMessage.a;
					switch (result.$) {
						case 'NoResult':
							return _Utils_update(
								model,
								{search: elm$core$Maybe$Nothing});
						case 'InsertLiteral':
							var text = result.a;
							return advanceModel(
								A2(
									author$project$Update$insertNode,
									author$project$Model$LiteralNode(text),
									model));
						case 'InsertPrototype':
							var prototype = result.a;
							return advanceModel(
								A2(
									author$project$Update$insertNode,
									prototype,
									author$project$Update$stopEditingExampleText(model)));
						default:
							var regex = result.a;
							return advanceModel(
								A2(
									author$project$Update$parseRegexNodes,
									author$project$Update$stopEditingExampleText(model),
									regex));
					}
				}
			default:
				var modeMessage = message.a;
				switch (modeMessage.$) {
					case 'StartNodeMove':
						var node = modeMessage.a.node;
						var mouse = modeMessage.a.mouse;
						return advanceModel(
							A3(author$project$Update$startNodeMove, mouse, node, model));
					case 'StartViewMove':
						var drag = modeMessage.a;
						return _Utils_update(
							model,
							{
								dragMode: elm$core$Maybe$Just(
									author$project$Model$MoveViewDrag(drag))
							});
					case 'StartEditingConnection':
						var nodeId = modeMessage.a.nodeId;
						var node = modeMessage.a.node;
						var supplier = modeMessage.a.supplier;
						var mouse = modeMessage.a.mouse;
						return advanceModel(
							A5(author$project$Update$startEditingConnection, nodeId, node, supplier, mouse, model));
					case 'StartCreateConnection':
						var supplier = modeMessage.a.supplier;
						var mouse = modeMessage.a.mouse;
						return _Utils_update(
							model,
							{
								dragMode: elm$core$Maybe$Just(
									author$project$Model$CreateConnection(
										{openEnd: mouse, supplier: supplier}))
							});
					case 'StartPrepareEditingConnection':
						var node = modeMessage.a.node;
						var mouse = modeMessage.a.mouse;
						return _Utils_update(
							model,
							{
								dragMode: elm$core$Maybe$Just(
									author$project$Model$PrepareEditingConnection(
										{mouse: mouse, node: node}))
							});
					case 'UpdateDrag':
						var newMouse = modeMessage.a.newMouse;
						var _n6 = model.dragMode;
						_n6$3:
						while (true) {
							if (_n6.$ === 'Just') {
								switch (_n6.a.$) {
									case 'MoveNodeDrag':
										var node = _n6.a.a.node;
										var mouse = _n6.a.a.mouse;
										return A4(author$project$Update$moveNodeInModel, newMouse, mouse, node, model);
									case 'MoveViewDrag':
										var mouse = _n6.a.a.mouse;
										return A3(author$project$Update$moveViewInModel, newMouse, mouse, model);
									case 'CreateConnection':
										var supplier = _n6.a.a.supplier;
										return _Utils_update(
											model,
											{
												dragMode: elm$core$Maybe$Just(
													author$project$Model$CreateConnection(
														{openEnd: newMouse, supplier: supplier}))
											});
									default:
										break _n6$3;
								}
							} else {
								break _n6$3;
							}
						}
						return model;
					case 'RealizeConnection':
						var nodeId = modeMessage.a.nodeId;
						var newNode = modeMessage.a.newNode;
						var mouse = modeMessage.a.mouse;
						return advanceModel(
							A4(author$project$Update$realizeConnection, model, nodeId, newNode, mouse));
					default:
						return _Utils_update(
							model,
							{dragMode: elm$core$Maybe$Nothing});
				}
		}
	});
var elm$core$Debug$log = _Debug_log;
var elm$url$Url$percentDecode = _Url_percentDecode;
var author$project$Main$init = function (rawUrl) {
	var expression = function () {
		var _n0 = A2(elm$core$String$split, '?expression=', rawUrl);
		if ((_n0.b && _n0.b.b) && (!_n0.b.b.b)) {
			var _n1 = _n0.b;
			var query = _n1.a;
			return elm$core$Maybe$Just(
				A2(elm$core$Debug$log, 'found query', query));
		} else {
			return elm$core$Maybe$Nothing;
		}
	}();
	var escapedExpression = A2(elm$core$Maybe$andThen, elm$url$Url$percentDecode, expression);
	var regex = A2(
		elm$core$Maybe$withDefault,
		'/\\s(?:the|for)/g',
		A2(elm$core$Debug$log, 'final expression', escapedExpression));
	return A2(
		author$project$Update$update,
		author$project$Update$SearchMessage(
			author$project$Update$FinishSearch(
				author$project$Update$ParseRegex(regex))),
		author$project$Model$initialValue);
};
var author$project$Build$constructRegexLiteral = function (regex) {
	return '/' + (regex.expression + ('/' + ((regex.flags.multiple ? 'g' : '') + ((regex.flags.caseInsensitive ? 'i' : '') + (regex.flags.multiline ? 'm' : '')))));
};
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$String$all = _String_all;
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Main$url = _Platform_outgoingPort('url', elm$json$Json$Encode$string);
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Main$update = F2(
	function (message, model) {
		var regex = A2(
			elm$core$Maybe$map,
			elm$core$Result$map(author$project$Build$constructRegexLiteral),
			model.history.present.cachedRegex);
		var newModel = A2(author$project$Update$update, message, model);
		if ((regex.$ === 'Just') && (regex.a.$ === 'Ok')) {
			var expression = regex.a.a;
			return _Utils_Tuple2(
				newModel,
				author$project$Main$url('?expression=' + expression));
		} else {
			return _Utils_Tuple2(newModel, elm$core$Platform$Cmd$none);
		}
	});
var author$project$IdMap$toList = function (idMap) {
	return elm$core$Dict$toList(idMap.dict);
};
var author$project$Update$Deselect = {$: 'Deselect'};
var author$project$Update$DismissCyclesError = {$: 'DismissCyclesError'};
var author$project$Update$DoNothing = {$: 'DoNothing'};
var author$project$Update$DragModeMessage = function (a) {
	return {$: 'DragModeMessage', a: a};
};
var author$project$Update$FinishDrag = {$: 'FinishDrag'};
var author$project$Update$MagnifyView = function (a) {
	return {$: 'MagnifyView', a: a};
};
var author$project$Update$Redo = {$: 'Redo'};
var author$project$Update$SetEditing = function (a) {
	return {$: 'SetEditing', a: a};
};
var author$project$Update$SetOutputLocked = function (a) {
	return {$: 'SetOutputLocked', a: a};
};
var author$project$Update$StartViewMove = function (a) {
	return {$: 'StartViewMove', a: a};
};
var author$project$Update$Undo = {$: 'Undo'};
var author$project$Update$UpdateDrag = function (a) {
	return {$: 'UpdateDrag', a: a};
};
var author$project$Update$UpdateExampleText = function (a) {
	return {$: 'UpdateExampleText', a: a};
};
var author$project$Update$UpdateMaxMatchLimit = function (a) {
	return {$: 'UpdateMaxMatchLimit', a: a};
};
var author$project$Update$UpdateView = function (a) {
	return {$: 'UpdateView', a: a};
};
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$Vec2$fromTuple = function (value) {
	return A2(author$project$Vec2$Vec2, value.a, value.b);
};
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (_n0.$ === 'Just') {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$map2 = _Json_map2;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var author$project$View$classes = F2(
	function (base, elements) {
		return elm$html$Html$Attributes$class(
			base + (' ' + A2(
				elm$core$String$join,
				' ',
				A2(
					elm$core$List$filterMap,
					function (_n0) {
						var condition = _n0.a;
						var _class = _n0.b;
						return condition ? elm$core$Maybe$Just(_class) : elm$core$Maybe$Nothing;
					},
					elements))));
	});
var elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var elm$json$Json$Decode$map6 = _Json_map6;
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$int = _Json_decodeInt;
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	elm$json$Json$Decode$map,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2(elm$json$Json$Decode$field, 'button', elm$json$Json$Decode$int));
var elm$json$Json$Decode$float = _Json_decodeFloat;
var mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'clientX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'clientY', elm$json$Json$Decode$float));
var elm$json$Json$Decode$bool = _Json_decodeBool;
var elm$json$Json$Decode$map3 = _Json_map3;
var mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	elm$json$Json$Decode$map3,
	mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2(elm$json$Json$Decode$field, 'altKey', elm$json$Json$Decode$bool),
	A2(elm$json$Json$Decode$field, 'ctrlKey', elm$json$Json$Decode$bool),
	A2(elm$json$Json$Decode$field, 'shiftKey', elm$json$Json$Decode$bool));
var mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'offsetX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'offsetY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'pageX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'pageY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'screenX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'screenY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7(elm$json$Json$Decode$map6, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, mpizenberg$elm_pointer_events$Internal$Decode$keys, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, mpizenberg$elm_pointer_events$Internal$Decode$clientPos, mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, mpizenberg$elm_pointer_events$Internal$Decode$pagePos, mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			elm$html$Html$Events$custom,
			event,
			A2(
				elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var author$project$View$conservativeOnMouse = F2(
	function (tag, handler) {
		return A3(
			mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
			tag,
			{preventDefault: false, stopPropagation: false},
			handler);
	});
var author$project$View$flattenList = function (list) {
	return A3(elm$core$List$foldr, elm$core$Basics$append, _List_Nil, list);
};
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$svg$Svg$rect = elm$svg$Svg$trustedNode('rect');
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var author$project$View$lockSvg = A2(
	elm$svg$Svg$svg,
	_List_fromArray(
		[
			elm$svg$Svg$Attributes$width('50'),
			elm$svg$Svg$Attributes$height('50'),
			elm$svg$Svg$Attributes$viewBox('0 0 10 10')
		]),
	_List_fromArray(
		[
			A2(
			elm$svg$Svg$path,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$id('bracket'),
					elm$svg$Svg$Attributes$d('M 3,3 v -1.5 c 0,-2 4,-2 4,0 v 4')
				]),
			_List_Nil),
			A2(
			elm$svg$Svg$rect,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$x('2'),
					elm$svg$Svg$Attributes$y('5'),
					elm$svg$Svg$Attributes$width('6'),
					elm$svg$Svg$Attributes$height('4'),
					elm$svg$Svg$Attributes$id('body')
				]),
			_List_Nil)
		]));
var elm$core$String$fromFloat = _String_fromNumber;
var author$project$View$magnifyAndOffset = F2(
	function (unit, transformView) {
		var transform = author$project$Model$viewTransform(transformView);
		return 'translate(' + (elm$core$String$fromFloat(transform.translate.x) + (unit + (',' + (elm$core$String$fromFloat(transform.translate.y) + (unit + (') ' + ('scale(' + (elm$core$String$fromFloat(transform.scale) + ')'))))))));
	});
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var author$project$View$magnifyAndOffsetHTML = function (transformView) {
	return A2(
		elm$html$Html$Attributes$style,
		'transform',
		A2(author$project$View$magnifyAndOffset, 'px', transformView));
};
var elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var author$project$View$magnifyAndOffsetSVG = function (transformView) {
	return elm$svg$Svg$Attributes$transform(
		A2(author$project$View$magnifyAndOffset, '', transformView));
};
var author$project$View$preventContextMenu = function (handler) {
	return A3(
		mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
		'contextmenu',
		{preventDefault: true, stopPropagation: false},
		handler);
};
var author$project$View$unwrapResult = function (result) {
	if (result.$ === 'Ok') {
		var a = result.a;
		return a;
	} else {
		var a = result.a;
		return a;
	}
};
var author$project$Model$codeTextWidth = A2(
	elm$core$Basics$composeR,
	elm$core$String$length,
	A2(
		elm$core$Basics$composeR,
		elm$core$Basics$mul(5),
		elm$core$Basics$toFloat));
var author$project$Model$stringWidth = function (length) {
	return A2(elm$core$Basics$max, 5, length) * ((length < 14) ? 13 : 9);
};
var author$project$Model$mainTextWidth = function (text) {
	return author$project$Model$stringWidth(
		elm$core$String$length(text));
};
var author$project$Model$symbolNames = {any: 'Anything', digit: 'Digit Char', end: 'End of Text', lineBreak: 'Linebreak Char', nonDigit: 'Non Digit Char', nonLineBreak: 'Non Linebreak Char', nonWhitespace: 'Non Whitespace Char', nonWord: 'Non Word Char', nonWordBoundary: 'Non Word Boundary', none: 'Nothing', start: 'Start of Text', tab: 'Tab Char', whitespace: 'Whitespace Char', word: 'Word Char', wordBoundary: 'Word Boundary'};
var author$project$Model$symbolProperty = F2(
	function (properties, symbol) {
		switch (symbol.$) {
			case 'WhitespaceChar':
				return properties.whitespace;
			case 'NonWhitespaceChar':
				return properties.nonWhitespace;
			case 'DigitChar':
				return properties.digit;
			case 'NonDigitChar':
				return properties.nonDigit;
			case 'WordChar':
				return properties.word;
			case 'NonWordChar':
				return properties.nonWord;
			case 'WordBoundary':
				return properties.wordBoundary;
			case 'NonWordBoundary':
				return properties.nonWordBoundary;
			case 'LinebreakChar':
				return properties.lineBreak;
			case 'NonLinebreakChar':
				return properties.nonLineBreak;
			case 'TabChar':
				return properties.tab;
			case 'Never':
				return properties.none;
			case 'Always':
				return properties.any;
			case 'Start':
				return properties.start;
			default:
				return properties.end;
		}
	});
var author$project$Model$symbolName = author$project$Model$symbolProperty(author$project$Model$symbolNames);
var author$project$Model$typeNames = {anyRepetition: 'Any Repetition', atLeastOne: 'At Least One', capture: 'Capture', charRange: 'Any of Char Range', charset: 'Any of Chars', exactRepetition: 'Exact Repetition', flags: 'Configuration', ifFollowedBy: 'If Followed By', ifNotFollowedBy: 'If Not Followed By', literal: 'Literal', maximumRepetition: 'Maximum Repetition', minimumRepetition: 'Minimum Repetition', notInCharRange: 'None of Char Range', notInCharset: 'None of Chars', optional: 'Optional', rangedRepetition: 'Ranged Repetition', sequence: 'Sequence', set: 'Any Of'};
var author$project$Model$nodeWidth = function (node) {
	switch (node.$) {
		case 'SymbolNode':
			var symbol = node.a;
			return author$project$Model$mainTextWidth(
				author$project$Model$symbolName(symbol));
		case 'CharSetNode':
			var chars = node.a;
			return (author$project$Model$mainTextWidth(author$project$Model$typeNames.charset) + author$project$Model$codeTextWidth(chars)) + 3;
		case 'NotInCharSetNode':
			var chars = node.a;
			return (author$project$Model$mainTextWidth(author$project$Model$typeNames.charset) + author$project$Model$codeTextWidth(chars)) + 3;
		case 'CharRangeNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.charRange);
		case 'NotInCharRangeNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.notInCharRange);
		case 'LiteralNode':
			var chars = node.a;
			return (author$project$Model$mainTextWidth(author$project$Model$typeNames.literal) + author$project$Model$codeTextWidth(chars)) + 3;
		case 'OptionalNode':
			return author$project$Model$stringWidth(10);
		case 'SetNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.set);
		case 'FlagsNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.flags);
		case 'IfFollowedByNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.ifFollowedBy);
		case 'ExactRepetitionNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.exactRepetition);
		case 'SequenceNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.sequence);
		case 'CaptureNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.capture);
		case 'IfNotFollowedByNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.ifNotFollowedBy);
		case 'AtLeastOneNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.atLeastOne);
		case 'AnyRepetitionNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.anyRepetition);
		case 'RangedRepetitionNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.rangedRepetition);
		case 'MinimumRepetitionNode':
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.minimumRepetition);
		default:
			return author$project$Model$mainTextWidth(author$project$Model$typeNames.maximumRepetition);
	}
};
var author$project$View$svgConnectionPath = F4(
	function (from, fromTangent, toTangent, to) {
		var vec2ToString = function (vec) {
			return elm$core$String$fromFloat(vec.x) + (',' + (elm$core$String$fromFloat(vec.y) + ' '));
		};
		var path = 'M' + (vec2ToString(from) + ('C' + (vec2ToString(fromTangent) + (vec2ToString(toTangent) + vec2ToString(to)))));
		return elm$svg$Svg$Attributes$d(path);
	});
var elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var author$project$View$bezierSvgConnectionpath = F2(
	function (from, to) {
		var tangentX2 = to.x + (elm$core$Basics$abs(to.x - from.x) * 0.4);
		var tangentX1 = from.x - (elm$core$Basics$abs(to.x - from.x) * 0.4);
		return A4(
			author$project$View$svgConnectionPath,
			from,
			A2(author$project$Vec2$Vec2, tangentX1, from.y),
			A2(author$project$Vec2$Vec2, tangentX2, to.y),
			to);
	});
var elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var author$project$View$viewConnectDrag = F4(
	function (viewTransformation, nodes, dragId, mouse) {
		var transform = author$project$Model$viewTransform(viewTransformation);
		var transformedMouse = A2(author$project$Vec2$inverseTransform, mouse, transform);
		var node = A2(
			elm$core$Maybe$andThen,
			function (id) {
				return A2(author$project$IdMap$get, id, nodes);
			},
			dragId);
		var nodePosition = A2(
			elm$core$Maybe$withDefault,
			A2(author$project$Vec2$Vec2, 0, 0),
			A2(
				elm$core$Maybe$map,
				function ($) {
					return $.position;
				},
				node));
		var nodeAnchor = A2(
			author$project$Vec2$Vec2,
			nodePosition.x + A2(
				elm$core$Maybe$withDefault,
				0,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeR,
						function ($) {
							return $.node;
						},
						author$project$Model$nodeWidth),
					node)),
			nodePosition.y + (0.5 * 25.0));
		return A2(
			elm$svg$Svg$path,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('prototype connection'),
					A2(author$project$View$bezierSvgConnectionpath, transformedMouse, nodeAnchor)
				]),
			_List_Nil);
	});
var author$project$Update$UpdateContents = function (a) {
	return {$: 'UpdateContents', a: a};
};
var elm$html$Html$span = _VirtualDom_node('span');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var author$project$View$viewExampleTexts = function (matches) {
	var render = function (matchPair) {
		return _List_fromArray(
			[
				elm$html$Html$text(matchPair.a),
				A2(
				elm$html$Html$span,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('match')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(matchPair.b)
					]))
			]);
	};
	return A2(elm$core$List$concatMap, render, matches);
};
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$json$Json$Decode$string = _Json_decodeString;
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var author$project$View$viewExampleText = function (example) {
	if (example.isEditing) {
		return A2(
			elm$html$Html$textarea,
			_List_fromArray(
				[
					elm$html$Html$Attributes$id('example-text'),
					elm$html$Html$Events$onInput(
					A2(elm$core$Basics$composeL, author$project$Update$UpdateExampleText, author$project$Update$UpdateContents))
				]),
			_List_fromArray(
				[
					elm$html$Html$text(example.contents)
				]));
	} else {
		var texts = A2(
			elm$core$Maybe$withDefault,
			_List_fromArray(
				[
					elm$html$Html$text(example.contents)
				]),
			A2(elm$core$Maybe$map, author$project$View$viewExampleTexts, example.cachedMatches));
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$id('example-text')
				]),
			texts);
	}
};
var author$project$Model$BoolProperty = F2(
	function (a, b) {
		return {$: 'BoolProperty', a: a, b: b};
	});
var author$project$Model$CharProperty = F2(
	function (a, b) {
		return {$: 'CharProperty', a: a, b: b};
	});
var author$project$Model$CharsProperty = F2(
	function (a, b) {
		return {$: 'CharsProperty', a: a, b: b};
	});
var author$project$Model$ConnectingProperties = F3(
	function (a, b, c) {
		return {$: 'ConnectingProperties', a: a, b: b, c: c};
	});
var author$project$Model$ConnectingProperty = F2(
	function (a, b) {
		return {$: 'ConnectingProperty', a: a, b: b};
	});
var author$project$Model$IntProperty = F2(
	function (a, b) {
		return {$: 'IntProperty', a: a, b: b};
	});
var author$project$Model$Property = F4(
	function (name, description, contents, connectOutput) {
		return {connectOutput: connectOutput, contents: contents, description: description, name: name};
	});
var author$project$Model$TitleProperty = {$: 'TitleProperty'};
var author$project$Model$symbolDescriptions = {any: 'Matches any char, including linebreaks and whitespace', digit: 'Match any numerical char, from `0` to `9`, excluding punctuation', end: 'The end of line if Multiline Matches are enabled, or the end of the text otherwise', lineBreak: 'Matches the linebreak, or newline, char `\\n`', nonDigit: 'Match any char but numerical ones, matching punctuation', nonLineBreak: 'Matches anything but the linebreak char `\\n`', nonWhitespace: 'Match any char that is not invisible, for example neither space nor linebreaks', nonWord: 'Match any char, but not alphabetical ones and not the underscore char `_`', nonWordBoundary: 'Matches anywhere but not where a word char has a whitespace neighbour', none: 'Matches nothing ever, really', start: 'The start of line if Multiline Matches are enabled, or the start of the text otherwise', tab: 'Matches the tab char `\\t`', whitespace: 'Match any invisible char, such as the space between words and linebreaks', word: 'Match any alphabetical chars, and the underscore char `_`', wordBoundary: 'Matches where a word char has a whitespace neighbour'};
var author$project$Model$symbolDescription = author$project$Model$symbolProperty(author$project$Model$symbolDescriptions);
var author$project$Model$typeDescriptions = {anyRepetition: 'Allow this expression to occur multiple times or not at all', atLeastOne: 'Allow this expression to occur multiple times', capture: 'Capture this expression for later use, like replacing', charRange: 'Matches any char between the lower and upper range bound', charset: 'Matches, where any char of the set is matched', exactRepetition: 'Match where an expression is repeated exactly n times', flags: 'Configure how the whole regex operates', ifFollowedBy: 'Match this expression only if the successor is also matched, without matching the successor itself', ifNotFollowedBy: 'Match this expression only if the successor is not matched, without matching the successor itself', literal: 'Matches where that exact sequence of chars is found', maximumRepetition: 'Match where an expression is repeated no more than n times', minimumRepetition: 'Match where an expression is repeated at least n times', notInCharRange: 'Matches any char outside of the range', notInCharset: 'Matches where not a single char of the set is matched', optional: 'Allow omitting this expression and match anyways', rangedRepetition: 'Only match if the expression is repeated in range', sequence: 'Matches, where all members in the exact order are matched one after another', set: 'Matches, where at least one of the options matches'};
var author$project$Model$maxChar = F2(
	function (a, b) {
		return (_Utils_cmp(a, b) > 0) ? a : b;
	});
var author$project$Model$minChar = F2(
	function (a, b) {
		return (_Utils_cmp(a, b) < 0) ? a : b;
	});
var author$project$Model$updateCharRangeFirst = F2(
	function (end, start) {
		return A2(
			author$project$Model$CharRangeNode,
			A2(author$project$Model$minChar, start, end),
			A2(author$project$Model$maxChar, start, end));
	});
var author$project$Model$updateCharRangeLast = F2(
	function (start, end) {
		return A2(
			author$project$Model$CharRangeNode,
			A2(author$project$Model$minChar, end, start),
			A2(author$project$Model$maxChar, start, end));
	});
var author$project$Model$updateExpression = F2(
	function (node, expression) {
		return _Utils_update(
			node,
			{expression: expression});
	});
var author$project$Model$updateFlagsExpression = F2(
	function (flags, newInput) {
		return author$project$Model$FlagsNode(
			_Utils_update(
				flags,
				{expression: newInput}));
	});
var author$project$Model$updateFlags = F2(
	function (expression, newFlags) {
		return author$project$Model$FlagsNode(
			{expression: expression, flags: newFlags});
	});
var author$project$Model$updateFlagsInsensitivity = F2(
	function (_n0, caseInsensitive) {
		var expression = _n0.expression;
		var flags = _n0.flags;
		return A2(
			author$project$Model$updateFlags,
			expression,
			_Utils_update(
				flags,
				{caseInsensitive: caseInsensitive}));
	});
var author$project$Model$updateFlagsMultiline = F2(
	function (_n0, multiline) {
		var expression = _n0.expression;
		var flags = _n0.flags;
		return A2(
			author$project$Model$updateFlags,
			expression,
			_Utils_update(
				flags,
				{multiline: multiline}));
	});
var author$project$Model$updateFlagsMultiple = F2(
	function (_n0, multiple) {
		var expression = _n0.expression;
		var flags = _n0.flags;
		return A2(
			author$project$Model$updateFlags,
			expression,
			_Utils_update(
				flags,
				{multiple: multiple}));
	});
var author$project$Model$updateMinimal = F2(
	function (node, minimal) {
		return _Utils_update(
			node,
			{minimal: minimal});
	});
var author$project$Model$updateNotInCharRangeFirst = F2(
	function (end, start) {
		return A2(
			author$project$Model$CharRangeNode,
			A2(author$project$Model$minChar, start, end),
			A2(author$project$Model$maxChar, start, end));
	});
var author$project$Model$updateNotInCharRangeLast = F2(
	function (start, end) {
		return A2(
			author$project$Model$CharRangeNode,
			A2(author$project$Model$minChar, end, start),
			A2(author$project$Model$maxChar, start, end));
	});
var author$project$Model$positive = elm$core$Basics$max(0);
var author$project$Model$updatePositiveCount = F2(
	function (node, count) {
		return _Utils_update(
			node,
			{
				count: author$project$Model$positive(count)
			});
	});
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var author$project$Model$updateRangedRepetitionMaximum = F2(
	function (repetition, count) {
		return author$project$Model$RangedRepetitionNode(
			_Utils_update(
				repetition,
				{
					maximum: author$project$Model$positive(count),
					minimum: A2(
						elm$core$Basics$min,
						author$project$Model$positive(count),
						repetition.minimum)
				}));
	});
var author$project$Model$updateRangedRepetitionMinimum = F2(
	function (repetition, count) {
		return author$project$Model$RangedRepetitionNode(
			_Utils_update(
				repetition,
				{
					maximum: A2(
						elm$core$Basics$max,
						author$project$Model$positive(count),
						repetition.maximum),
					minimum: author$project$Model$positive(count)
				}));
	});
var author$project$Model$updateSuccessor = F2(
	function (node, successor) {
		return _Utils_update(
			node,
			{successor: successor});
	});
var author$project$Model$nodeProperties = function (node) {
	switch (node.$) {
		case 'SymbolNode':
			var symbol = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$symbolName(symbol),
					author$project$Model$symbolDescription(symbol),
					author$project$Model$TitleProperty,
					true)
				]);
		case 'CharSetNode':
			var chars = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.charset,
					'Matches ' + A2(
						elm$core$String$join,
						', ',
						A2(
							elm$core$List$map,
							elm$core$String$fromChar,
							elm$core$String$toList(chars))),
					A2(author$project$Model$CharsProperty, chars, author$project$Model$CharSetNode),
					true)
				]);
		case 'NotInCharSetNode':
			var chars = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.notInCharset,
					'Matches any char but ' + A2(
						elm$core$String$join,
						', ',
						A2(
							elm$core$List$map,
							elm$core$String$fromChar,
							elm$core$String$toList(chars))),
					A2(author$project$Model$CharsProperty, chars, author$project$Model$NotInCharSetNode),
					true)
				]);
		case 'LiteralNode':
			var literal = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.literal,
					'Matches exactly `' + (literal + '` and nothing else'),
					A2(author$project$Model$CharsProperty, literal, author$project$Model$LiteralNode),
					true)
				]);
		case 'CaptureNode':
			var captured = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.capture,
					author$project$Model$typeDescriptions.capture,
					A2(author$project$Model$ConnectingProperty, captured, author$project$Model$CaptureNode),
					true)
				]);
		case 'CharRangeNode':
			var start = node.a;
			var end = node.b;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.charRange,
					'Match any char whose integer value is equal to or between ' + (elm$core$String$fromChar(start) + (' and ' + elm$core$String$fromChar(end))),
					author$project$Model$TitleProperty,
					true),
					A4(
					author$project$Model$Property,
					'First Char',
					'The lower range bound char, will match itself',
					A2(
						author$project$Model$CharProperty,
						start,
						author$project$Model$updateCharRangeFirst(end)),
					false),
					A4(
					author$project$Model$Property,
					'Last Char',
					'The upper range bound char, will match itself',
					A2(
						author$project$Model$CharProperty,
						end,
						author$project$Model$updateCharRangeLast(start)),
					false)
				]);
		case 'NotInCharRangeNode':
			var start = node.a;
			var end = node.b;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.notInCharRange,
					'Match any char whose integer value is neither equal to nor between ' + (elm$core$String$fromChar(start) + (' and ' + elm$core$String$fromChar(end))),
					author$project$Model$TitleProperty,
					true),
					A4(
					author$project$Model$Property,
					'First Char',
					'The lower range bound char, will not match itself',
					A2(
						author$project$Model$CharProperty,
						start,
						author$project$Model$updateNotInCharRangeFirst(end)),
					false),
					A4(
					author$project$Model$Property,
					'Last Char',
					'The upper range bound char, will not match itself ',
					A2(
						author$project$Model$CharProperty,
						end,
						author$project$Model$updateNotInCharRangeLast(start)),
					false)
				]);
		case 'SetNode':
			var options = node.a;
			return _List_fromArray(
				[
					A4(author$project$Model$Property, author$project$Model$typeNames.set, author$project$Model$typeDescriptions.set, author$project$Model$TitleProperty, true),
					A4(
					author$project$Model$Property,
					'Option',
					'Match if this or any other option is matched',
					A3(author$project$Model$ConnectingProperties, false, options, author$project$Model$SetNode),
					false)
				]);
		case 'SequenceNode':
			var members = node.a;
			return _List_fromArray(
				[
					A4(author$project$Model$Property, author$project$Model$typeNames.sequence, author$project$Model$typeDescriptions.sequence, author$project$Model$TitleProperty, true),
					A4(
					author$project$Model$Property,
					'Member',
					'A member of the sequence',
					A3(author$project$Model$ConnectingProperties, true, members, author$project$Model$SequenceNode),
					false)
				]);
		case 'FlagsNode':
			var flagsNode = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.flags,
					author$project$Model$typeDescriptions.flags,
					A2(
						author$project$Model$ConnectingProperty,
						flagsNode.expression,
						author$project$Model$updateFlagsExpression(flagsNode)),
					false),
					A4(
					author$project$Model$Property,
					'Multiple Matches',
					'Do not stop after the first match',
					A2(
						author$project$Model$BoolProperty,
						flagsNode.flags.multiple,
						author$project$Model$updateFlagsMultiple(flagsNode)),
					false),
					A4(
					author$project$Model$Property,
					'Case Insensitive',
					'Match as if everything had the same case',
					A2(
						author$project$Model$BoolProperty,
						flagsNode.flags.caseInsensitive,
						author$project$Model$updateFlagsInsensitivity(flagsNode)),
					false),
					A4(
					author$project$Model$Property,
					'Multiline Matches',
					'Allow every matches to be found across multiple lines',
					A2(
						author$project$Model$BoolProperty,
						flagsNode.flags.multiline,
						author$project$Model$updateFlagsMultiline(flagsNode)),
					false)
				]);
		case 'IfFollowedByNode':
			var followed = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.ifFollowedBy,
					author$project$Model$typeDescriptions.ifFollowedBy,
					A2(
						author$project$Model$ConnectingProperty,
						followed.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$IfFollowedByNode,
							author$project$Model$updateExpression(followed))),
					true),
					A4(
					author$project$Model$Property,
					'Successor',
					'What needs to follow the expression',
					A2(
						author$project$Model$ConnectingProperty,
						followed.successor,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$IfFollowedByNode,
							author$project$Model$updateSuccessor(followed))),
					false)
				]);
		case 'IfNotFollowedByNode':
			var followed = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.ifNotFollowedBy,
					author$project$Model$typeDescriptions.ifNotFollowedBy,
					A2(
						author$project$Model$ConnectingProperty,
						followed.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$IfNotFollowedByNode,
							author$project$Model$updateExpression(followed))),
					true),
					A4(
					author$project$Model$Property,
					'Successor',
					'What must not follow the expression',
					A2(
						author$project$Model$ConnectingProperty,
						followed.successor,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$IfNotFollowedByNode,
							author$project$Model$updateSuccessor(followed))),
					false)
				]);
		case 'OptionalNode':
			var option = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.optional,
					author$project$Model$typeDescriptions.optional,
					A2(
						author$project$Model$ConnectingProperty,
						option.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$OptionalNode,
							author$project$Model$updateExpression(option))),
					true),
					A4(
					author$project$Model$Property,
					'Prefer None',
					'Prefer not to match',
					A2(
						author$project$Model$BoolProperty,
						option.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$OptionalNode,
							author$project$Model$updateMinimal(option))),
					false)
				]);
		case 'AtLeastOneNode':
			var counted = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.atLeastOne,
					author$project$Model$typeDescriptions.atLeastOne,
					A2(
						author$project$Model$ConnectingProperty,
						counted.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$AtLeastOneNode,
							author$project$Model$updateExpression(counted))),
					true),
					A4(
					author$project$Model$Property,
					'Minimize Count',
					'Match as few occurences as possible',
					A2(
						author$project$Model$BoolProperty,
						counted.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$AtLeastOneNode,
							author$project$Model$updateMinimal(counted))),
					false)
				]);
		case 'AnyRepetitionNode':
			var counted = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.anyRepetition,
					author$project$Model$typeDescriptions.anyRepetition,
					A2(
						author$project$Model$ConnectingProperty,
						counted.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$AnyRepetitionNode,
							author$project$Model$updateExpression(counted))),
					true),
					A4(
					author$project$Model$Property,
					'Minimize Count',
					'Match as few occurences as possible',
					A2(
						author$project$Model$BoolProperty,
						counted.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$AnyRepetitionNode,
							author$project$Model$updateMinimal(counted))),
					false)
				]);
		case 'ExactRepetitionNode':
			var repetition = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.exactRepetition,
					'Match only if this expression is repeated exactly ' + (elm$core$String$fromInt(repetition.count) + ' times'),
					A2(
						author$project$Model$ConnectingProperty,
						repetition.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$ExactRepetitionNode,
							author$project$Model$updateExpression(repetition))),
					true),
					A4(
					author$project$Model$Property,
					'Count',
					'How often the expression is required',
					A2(
						author$project$Model$IntProperty,
						repetition.count,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$ExactRepetitionNode,
							author$project$Model$updatePositiveCount(repetition))),
					false)
				]);
		case 'RangedRepetitionNode':
			var counted = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.rangedRepetition,
					'Match only if the expression is repeated no less than ' + (elm$core$String$fromInt(counted.minimum) + (' and no more than ' + (elm$core$String$fromInt(counted.maximum) + ' times'))),
					A2(
						author$project$Model$ConnectingProperty,
						counted.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$RangedRepetitionNode,
							author$project$Model$updateExpression(counted))),
					true),
					A4(
					author$project$Model$Property,
					'Minimum',
					'Match only if the expression is repeated no less than ' + (elm$core$String$fromInt(counted.minimum) + ' times'),
					A2(
						author$project$Model$IntProperty,
						counted.minimum,
						author$project$Model$updateRangedRepetitionMinimum(counted)),
					false),
					A4(
					author$project$Model$Property,
					'Maximum',
					'Match only if the expression is repeated no more than ' + (elm$core$String$fromInt(counted.maximum) + ' times'),
					A2(
						author$project$Model$IntProperty,
						counted.maximum,
						author$project$Model$updateRangedRepetitionMaximum(counted)),
					false),
					A4(
					author$project$Model$Property,
					'Minimize Count',
					'Match as few occurences as possible',
					A2(
						author$project$Model$BoolProperty,
						counted.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$RangedRepetitionNode,
							author$project$Model$updateMinimal(counted))),
					false)
				]);
		case 'MinimumRepetitionNode':
			var counted = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.minimumRepetition,
					'Match only if the expression is repeated no less than ' + (elm$core$String$fromInt(counted.count) + ' times'),
					A2(
						author$project$Model$ConnectingProperty,
						counted.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MinimumRepetitionNode,
							author$project$Model$updateExpression(counted))),
					true),
					A4(
					author$project$Model$Property,
					'Count',
					'Minimum number of repetitions',
					A2(
						author$project$Model$IntProperty,
						counted.count,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MinimumRepetitionNode,
							author$project$Model$updatePositiveCount(counted))),
					false),
					A4(
					author$project$Model$Property,
					'Minimize Count',
					'Match as few occurences as possible',
					A2(
						author$project$Model$BoolProperty,
						counted.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MinimumRepetitionNode,
							author$project$Model$updateMinimal(counted))),
					false)
				]);
		default:
			var counted = node.a;
			return _List_fromArray(
				[
					A4(
					author$project$Model$Property,
					author$project$Model$typeNames.maximumRepetition,
					'Match only if the expression is repeated no more than ' + (elm$core$String$fromInt(counted.count) + ' times'),
					A2(
						author$project$Model$ConnectingProperty,
						counted.expression,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MaximumRepetitionNode,
							author$project$Model$updateExpression(counted))),
					true),
					A4(
					author$project$Model$Property,
					'Count',
					'Maximum number of repetitions',
					A2(
						author$project$Model$IntProperty,
						counted.count,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MaximumRepetitionNode,
							author$project$Model$updatePositiveCount(counted))),
					false),
					A4(
					author$project$Model$Property,
					'Minimize Count',
					'Match as few occurences as possible',
					A2(
						author$project$Model$BoolProperty,
						counted.minimal,
						A2(
							elm$core$Basics$composeL,
							author$project$Model$MaximumRepetitionNode,
							author$project$Model$updateMinimal(counted))),
					false)
				]);
	}
};
var author$project$View$NodeView = F2(
	function (node, connections) {
		return {connections: connections, node: node};
	});
var author$project$Model$propertyHeight = 25;
var author$project$View$viewNodeConnections = F3(
	function (nodes, props, nodeView) {
		var connectionLine = F4(
			function (from, width, to, index) {
				return A2(
					elm$svg$Svg$path,
					_List_fromArray(
						[
							elm$svg$Svg$Attributes$class('connection'),
							A2(
							author$project$View$bezierSvgConnectionpath,
							A2(author$project$Vec2$Vec2, to.x, to.y + ((index + 0.5) * author$project$Model$propertyHeight)),
							A2(author$project$Vec2$Vec2, from.x + width, from.y + (0.5 * author$project$Model$propertyHeight)))
						]),
					_List_Nil);
			});
		var connect = F3(
			function (supplierId, node, index) {
				var viewSupplier = function (supplierNodeView) {
					return A4(
						connectionLine,
						supplierNodeView.position,
						author$project$Model$nodeWidth(supplierNodeView.node),
						node.position,
						index);
				};
				var supplier = A2(author$project$IdMap$get, supplierId, nodes);
				return A2(elm$core$Maybe$map, viewSupplier, supplier);
			});
		var viewInputConnection = function (property) {
			var _n0 = property.contents;
			_n0$2:
			while (true) {
				switch (_n0.$) {
					case 'ConnectingProperty':
						if (_n0.a.$ === 'Just') {
							var supplier = _n0.a.a;
							return _List_fromArray(
								[
									A2(connect, supplier, nodeView)
								]);
						} else {
							break _n0$2;
						}
					case 'ConnectingProperties':
						var suppliers = _n0.b;
						return A2(
							elm$core$List$map,
							function (supplier) {
								return A2(connect, supplier, nodeView);
							},
							elm$core$Array$toList(suppliers));
					default:
						break _n0$2;
				}
			}
			return _List_fromArray(
				[
					elm$core$Basics$always(elm$core$Maybe$Nothing)
				]);
		};
		var flattened = author$project$View$flattenList(
			A2(elm$core$List$map, viewInputConnection, props));
		var indexed = A2(
			elm$core$List$indexedMap,
			F2(
				function (index, at) {
					return at(index);
				}),
			flattened);
		var filtered = A2(elm$core$List$filterMap, elm$core$Basics$identity, indexed);
		return filtered;
	});
var author$project$Update$AutoLayout = function (a) {
	return {$: 'AutoLayout', a: a};
};
var author$project$Update$DeleteNode = function (a) {
	return {$: 'DeleteNode', a: a};
};
var author$project$Update$DuplicateNode = function (a) {
	return {$: 'DuplicateNode', a: a};
};
var author$project$Update$StartNodeMove = function (a) {
	return {$: 'StartNodeMove', a: a};
};
var author$project$Update$StartPrepareEditingConnection = function (a) {
	return {$: 'StartPrepareEditingConnection', a: a};
};
var author$project$View$hasDragConnectionPrototype = F2(
	function (dragMode, nodeId) {
		if ((dragMode.$ === 'Just') && (dragMode.a.$ === 'CreateConnection')) {
			var supplier = dragMode.a.a.supplier;
			return _Utils_eq(nodeId, supplier);
		} else {
			return false;
		}
	});
var author$project$View$translate = F2(
	function (unit, position) {
		return A2(
			elm$html$Html$Attributes$style,
			'transform',
			'translate(' + (elm$core$String$fromFloat(position.x) + (unit + (',' + (elm$core$String$fromFloat(position.y) + (unit + ')'))))));
	});
var author$project$View$translateHTML = author$project$View$translate('px');
var author$project$Update$RealizeConnection = function (a) {
	return {$: 'RealizeConnection', a: a};
};
var author$project$Update$StartCreateConnection = function (a) {
	return {$: 'StartCreateConnection', a: a};
};
var author$project$Update$StartEditingConnection = function (a) {
	return {$: 'StartEditingConnection', a: a};
};
var author$project$Update$UpdateNodeMessage = F2(
	function (a, b) {
		return {$: 'UpdateNodeMessage', a: a, b: b};
	});
var elm$core$Array$length = function (_n0) {
	var len = _n0.a;
	return len;
};
var elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var elm$core$Elm$JsArray$slice = _JsArray_slice;
var elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = elm$core$Elm$JsArray$length(tail);
		var notAppended = (elm$core$Array$branchFactor - elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3(elm$core$Elm$JsArray$appendN, elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				elm$core$List$cons,
				elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3(elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				elm$core$List$cons,
				elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					elm$core$Array$Array_elm_builtin,
					len - from,
					elm$core$Array$shiftStep,
					elm$core$Elm$JsArray$empty,
					A3(
						elm$core$Elm$JsArray$slice,
						from - elm$core$Array$tailIndex(len),
						elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2(elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2(elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							elm$core$Elm$JsArray$slice,
							firstSlice,
							elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						elm$core$Array$builderToArray,
						true,
						A3(elm$core$List$foldl, elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = elm$core$Array$bitMask & (treeEnd >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_n0.$ === 'SubTree') {
				var sub = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _n0.a;
				return A3(elm$core$Elm$JsArray$slice, 0, elm$core$Array$bitMask & end, values);
			}
		}
	});
var elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_n0.$ === 'SubTree') {
					var sub = _n0.a;
					var $temp$oldShift = oldShift - elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = elm$core$Array$bitMask & (endIdx >>> shift);
		var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_n0.$ === 'SubTree') {
			var sub = _n0.a;
			var newSub = A3(elm$core$Array$sliceTree, shift - elm$core$Array$shiftStep, endIdx, sub);
			return (!elm$core$Elm$JsArray$length(newSub)) ? A3(elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				elm$core$Array$SubTree(newSub),
				A3(elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3(elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3(elm$core$Elm$JsArray$slice, 0, elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = elm$core$Array$tailIndex(end);
				var depth = elm$core$Basics$floor(
					A2(
						elm$core$Basics$logBase,
						elm$core$Array$branchFactor,
						A2(elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep);
				return A4(
					elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3(elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4(elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var elm$core$Array$translateIndex = F2(
	function (index, _n0) {
		var len = _n0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2(elm$core$Array$translateIndex, to, array);
		var correctFrom = A2(elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? elm$core$Array$empty : A2(
			elm$core$Array$sliceLeft,
			correctFrom,
			A2(elm$core$Array$sliceRight, correctTo, array));
	});
var author$project$View$insertIntoArray = F3(
	function (index, element, array) {
		var right = A3(
			elm$core$Array$slice,
			index,
			elm$core$Array$length(array),
			array);
		var left = A3(elm$core$Array$slice, 0, index, array);
		return elm$core$Array$fromList(
			_Utils_ap(
				elm$core$Array$toList(left),
				_Utils_ap(
					_List_fromArray(
						[element]),
					elm$core$Array$toList(right))));
	});
var author$project$View$removeFromList = F2(
	function (index, list) {
		return _Utils_ap(
			A2(elm$core$List$take, index, list),
			A2(elm$core$List$drop, index + 1, list));
	});
var author$project$View$removeFromArray = function (index) {
	return A2(
		elm$core$Basics$composeR,
		elm$core$Array$toList,
		A2(
			elm$core$Basics$composeR,
			author$project$View$removeFromList(index),
			elm$core$Array$fromList));
};
var author$project$View$onMouseWithStopPropagation = F2(
	function (eventName, eventHandler) {
		return A3(
			mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
			eventName,
			{preventDefault: false, stopPropagation: true},
			eventHandler);
	});
var author$project$View$stopMousePropagation = function (eventName) {
	return A2(
		author$project$View$onMouseWithStopPropagation,
		eventName,
		elm$core$Basics$always(author$project$Update$DoNothing));
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$checked = elm$html$Html$Attributes$boolProperty('checked');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var author$project$View$viewBoolInput = F2(
	function (value, onToggle) {
		return A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('checkbox'),
					elm$html$Html$Attributes$checked(value),
					A2(
					author$project$View$onMouseWithStopPropagation,
					'click',
					elm$core$Basics$always(onToggle)),
					author$project$View$stopMousePropagation('mousedown'),
					author$project$View$stopMousePropagation('mouseup')
				]),
			_List_Nil);
	});
var author$project$Model$insertWhitePlaceholder = A2(elm$core$String$replace, ' ', '␣');
var author$project$Model$removeWhitePlaceholder = A2(elm$core$String$replace, '␣', ' ');
var elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			elm$core$String$slice,
			-n,
			elm$core$String$length(string),
			string);
	});
var author$project$View$stringToChar = F2(
	function (fallback, string) {
		return A2(
			elm$core$Maybe$withDefault,
			fallback,
			A2(
				elm$core$Maybe$map,
				elm$core$Tuple$first,
				elm$core$String$uncons(
					A2(elm$core$String$right, 1, string))));
	});
var elm$html$Html$Attributes$placeholder = elm$html$Html$Attributes$stringProperty('placeholder');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var author$project$View$viewCharInput = F2(
	function (_char, onChange) {
		return A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$placeholder('a'),
					elm$html$Html$Attributes$value(
					author$project$Model$insertWhitePlaceholder(
						elm$core$String$fromChar(_char))),
					elm$html$Html$Events$onInput(
					A2(
						elm$core$Basics$composeL,
						A2(
							elm$core$Basics$composeL,
							onChange,
							author$project$View$stringToChar(_char)),
						author$project$Model$removeWhitePlaceholder)),
					elm$html$Html$Attributes$class('char input'),
					author$project$View$stopMousePropagation('mousedown'),
					author$project$View$stopMousePropagation('mouseup')
				]),
			_List_Nil);
	});
var author$project$View$viewCharsInput = F2(
	function (chars, onChange) {
		return A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$placeholder('chars'),
					elm$html$Html$Attributes$value(
					author$project$Model$insertWhitePlaceholder(chars)),
					elm$html$Html$Events$onInput(
					A2(elm$core$Basics$composeR, author$project$Model$removeWhitePlaceholder, onChange)),
					elm$html$Html$Attributes$class('chars input'),
					author$project$View$stopMousePropagation('mousedown'),
					author$project$View$stopMousePropagation('mouseup')
				]),
			_List_Nil);
	});
var elm$core$String$toInt = _String_toInt;
var author$project$View$stringToInt = F2(
	function (fallback, string) {
		return A2(
			elm$core$Maybe$withDefault,
			fallback,
			elm$core$String$toInt(string));
	});
var elm$html$Html$Attributes$min = elm$html$Html$Attributes$stringProperty('min');
var author$project$View$viewPositiveIntInput = F2(
	function (number, onChange) {
		return A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('number'),
					elm$html$Html$Attributes$value(
					elm$core$String$fromInt(number)),
					elm$html$Html$Events$onInput(
					A2(
						elm$core$Basics$composeL,
						onChange,
						author$project$View$stringToInt(number))),
					elm$html$Html$Attributes$class('int input'),
					author$project$View$stopMousePropagation('mousedown'),
					author$project$View$stopMousePropagation('mouseup'),
					elm$html$Html$Attributes$min('0')
				]),
			_List_Nil);
	});
var elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var elm$core$Array$indexedMap = F2(
	function (func, _n0) {
		var len = _n0.a;
		var tree = _n0.c;
		var tail = _n0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				elm$core$Elm$JsArray$indexedMap,
				func,
				elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * elm$core$Array$branchFactor;
					var mappedLeaf = elm$core$Array$Leaf(
						A3(elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2(elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			elm$core$Array$builderToArray,
			true,
			A3(elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var elm$core$Elm$JsArray$push = _JsArray_push;
var elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					elm$core$Elm$JsArray$push,
					elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, elm$core$Elm$JsArray$empty));
				return A2(elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, subTree));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(
						elm$core$Array$insertTailInTree,
						shift - elm$core$Array$shiftStep,
						index,
						tail,
						elm$core$Elm$JsArray$singleton(value)));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		var originalTailLen = elm$core$Elm$JsArray$length(tail);
		var newTailLen = elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + elm$core$Array$shiftStep;
				var newTree = A4(
					elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					elm$core$Elm$JsArray$singleton(
						elm$core$Array$SubTree(tree)));
				return A4(elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4(elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4(elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			elm$core$Array$unsafeReplaceTail,
			A2(elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var elm$html$Html$Attributes$title = elm$html$Html$Attributes$stringProperty('title');
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseenter', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseleave', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var author$project$View$viewProperties = F3(
	function (nodeId, dragMode, props) {
		var updateNode = author$project$Update$UpdateNodeMessage(nodeId);
		var rightConnector = function (active) {
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						author$project$View$classes,
						'right connector',
						_List_fromArray(
							[
								_Utils_Tuple2(!active, 'inactive')
							]))
					]),
				_List_Nil);
		};
		var propertyHTML = F7(
			function (attributes, directInput, name, description, connectableInput, left, right) {
				return A2(
					elm$html$Html$div,
					A2(
						elm$core$List$cons,
						A2(
							author$project$View$classes,
							'property',
							_List_fromArray(
								[
									_Utils_Tuple2(connectableInput, 'connectable-input')
								])),
						A2(
							elm$core$List$cons,
							elm$html$Html$Attributes$title(description),
							attributes)),
					_List_fromArray(
						[
							left,
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('title')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(name)
								])),
							directInput,
							right
						]));
			});
		var onLeave = F3(
			function (input, output, event) {
				return author$project$Update$DragModeMessage(
					function () {
						if ((dragMode.$ === 'Just') && (dragMode.a.$ === 'PrepareEditingConnection')) {
							var mouse = dragMode.a.a.mouse;
							if (input.$ === 'Just') {
								var supplier = input.a.supplier;
								var onChange = input.a.onChange;
								return ((_Utils_cmp(event.clientPos.a, mouse.x) < 0) && (!_Utils_eq(supplier, elm$core$Maybe$Nothing))) ? author$project$Update$StartEditingConnection(
									{
										mouse: author$project$Vec2$fromTuple(event.clientPos),
										node: onChange(elm$core$Maybe$Nothing),
										nodeId: nodeId,
										supplier: supplier
									}) : (output ? author$project$Update$StartCreateConnection(
									{
										mouse: author$project$Vec2$fromTuple(event.clientPos),
										supplier: nodeId
									}) : author$project$Update$FinishDrag);
							} else {
								return output ? author$project$Update$StartCreateConnection(
									{
										mouse: author$project$Vec2$fromTuple(event.clientPos),
										supplier: nodeId
									}) : author$project$Update$FinishDrag;
							}
						} else {
							return author$project$Update$UpdateDrag(
								{
									newMouse: author$project$Vec2$fromTuple(event.clientPos)
								});
						}
					}());
			});
		var mayStartConnectDrag = function () {
			_n5$2:
			while (true) {
				if (dragMode.$ === 'Just') {
					switch (dragMode.a.$) {
						case 'PrepareEditingConnection':
							var node = dragMode.a.a.node;
							return _Utils_eq(nodeId, node);
						case 'RetainPrototypedConnection':
							var node = dragMode.a.a.node;
							return _Utils_eq(nodeId, node);
						default:
							break _n5$2;
					}
				} else {
					break _n5$2;
				}
			}
			return false;
		}();
		var leftConnector = function (active) {
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						author$project$View$classes,
						'left connector',
						_List_fromArray(
							[
								_Utils_Tuple2(!active, 'inactive')
							]))
					]),
				_List_Nil);
		};
		var simpleInputProperty = F2(
			function (property, directInput) {
				return A7(
					propertyHTML,
					_List_fromArray(
						[
							mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
							A2(onLeave, elm$core$Maybe$Nothing, property.connectOutput))
						]),
					directInput,
					property.name,
					property.description,
					false,
					leftConnector(false),
					rightConnector(property.connectOutput));
			});
		var enableDisconnect = function () {
			_n4$2:
			while (true) {
				if (dragMode.$ === 'Just') {
					switch (dragMode.a.$) {
						case 'PrepareEditingConnection':
							return true;
						case 'RetainPrototypedConnection':
							return true;
						default:
							break _n4$2;
					}
				} else {
					break _n4$2;
				}
			}
			return false;
		}();
		var connectInputProperty = F3(
			function (property, currentSupplier, onChange) {
				var onLeaveHandlers = (enableDisconnect && mayStartConnectDrag) ? _List_fromArray(
					[
						mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
						A2(
							onLeave,
							elm$core$Maybe$Just(
								{onChange: onChange, supplier: currentSupplier}),
							property.connectOutput))
					]) : _List_Nil;
				var left = leftConnector(true);
				var connectOnEnter = F2(
					function (supplier, event) {
						return author$project$Update$DragModeMessage(
							author$project$Update$RealizeConnection(
								{
									mouse: author$project$Vec2$fromTuple(event.clientPos),
									newNode: onChange(
										elm$core$Maybe$Just(supplier)),
									nodeId: nodeId
								}));
					});
				var onEnter = function () {
					if ((dragMode.$ === 'Just') && (dragMode.a.$ === 'CreateConnection')) {
						var supplier = dragMode.a.a.supplier;
						return _Utils_eq(supplier, nodeId) ? _List_Nil : _List_fromArray(
							[
								mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter(
								connectOnEnter(supplier))
							]);
					} else {
						return _List_Nil;
					}
				}();
				return A7(
					propertyHTML,
					_Utils_ap(onEnter, onLeaveHandlers),
					A2(elm$html$Html$div, _List_Nil, _List_Nil),
					property.name,
					property.description,
					true,
					left,
					rightConnector(property.connectOutput));
			});
		var singleProperty = function (property) {
			var _n0 = property.contents;
			switch (_n0.$) {
				case 'BoolProperty':
					var value = _n0.a;
					var onChange = _n0.b;
					return _List_fromArray(
						[
							A2(
							simpleInputProperty,
							property,
							A2(
								author$project$View$viewBoolInput,
								value,
								updateNode(
									onChange(!value))))
						]);
				case 'CharsProperty':
					var chars = _n0.a;
					var onChange = _n0.b;
					return _List_fromArray(
						[
							A2(
							simpleInputProperty,
							property,
							A2(
								author$project$View$viewCharsInput,
								chars,
								A2(elm$core$Basics$composeR, onChange, updateNode)))
						]);
				case 'CharProperty':
					var _char = _n0.a;
					var onChange = _n0.b;
					return _List_fromArray(
						[
							A2(
							simpleInputProperty,
							property,
							A2(
								author$project$View$viewCharInput,
								_char,
								A2(elm$core$Basics$composeR, onChange, updateNode)))
						]);
				case 'IntProperty':
					var number = _n0.a;
					var onChange = _n0.b;
					return _List_fromArray(
						[
							A2(
							simpleInputProperty,
							property,
							A2(
								author$project$View$viewPositiveIntInput,
								number,
								A2(elm$core$Basics$composeR, onChange, updateNode)))
						]);
				case 'ConnectingProperty':
					var currentSupplier = _n0.a;
					var onChange = _n0.b;
					return _List_fromArray(
						[
							A3(connectInputProperty, property, currentSupplier, onChange)
						]);
				case 'ConnectingProperties':
					var countThem = _n0.a;
					var connectedProps = _n0.b;
					var onChange = _n0.c;
					var propCount = elm$core$Array$length(connectedProps);
					var onChangeStubProperty = function (newInput) {
						if (newInput.$ === 'Just') {
							var newInputId = newInput.a;
							return onChange(
								A2(elm$core$Array$push, newInputId, connectedProps));
						} else {
							return onChange(
								A2(
									author$project$View$removeFromArray,
									elm$core$Array$length(connectedProps) - 1,
									connectedProps));
						}
					};
					var onChangePropertyAtIndex = F2(
						function (index, newInput) {
							if (newInput.$ === 'Just') {
								var newInputId = newInput.a;
								return onChange(
									A3(author$project$View$insertIntoArray, index, newInputId, connectedProps));
							} else {
								return onChange(
									A2(author$project$View$removeFromArray, index, connectedProps));
							}
						});
					var count = F2(
						function (index, prop) {
							return countThem ? _Utils_update(
								prop,
								{
									name: prop.name + (' ' + elm$core$String$fromInt(index + 1))
								}) : prop;
						});
					var realProperties = elm$core$Array$toList(
						A2(
							elm$core$Array$indexedMap,
							F2(
								function (index, currentSupplier) {
									return A3(
										connectInputProperty,
										A2(count, index, property),
										elm$core$Maybe$Just(currentSupplier),
										onChangePropertyAtIndex(index));
								}),
							connectedProps));
					var stubProperty = A3(
						connectInputProperty,
						A2(count, propCount, property),
						elm$core$Maybe$Nothing,
						onChangeStubProperty);
					return _Utils_ap(
						realProperties,
						_List_fromArray(
							[stubProperty]));
				default:
					return _List_fromArray(
						[
							A7(
							propertyHTML,
							_List_fromArray(
								[
									mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
									A2(onLeave, elm$core$Maybe$Nothing, true))
								]),
							A2(elm$html$Html$div, _List_Nil, _List_Nil),
							property.name,
							property.description,
							false,
							leftConnector(false),
							rightConnector(property.connectOutput))
						]);
			}
		};
		return author$project$View$flattenList(
			A2(elm$core$List$map, singleProperty, props));
	});
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$View$viewNodeContent = F6(
	function (dragMode, selectedNode, outputNode, nodeId, props, nodeView) {
		var preventDefaultAndMayStopPropagation = F2(
			function (tag, handler) {
				return A2(
					elm$html$Html$Events$custom,
					tag,
					A2(elm$json$Json$Decode$map, handler, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
			});
		var onMouseDownAndStopPropagation = function (event) {
			return _Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton) ? {
				message: author$project$Update$DragModeMessage(
					author$project$Update$StartPrepareEditingConnection(
						{
							mouse: author$project$Vec2$fromTuple(event.clientPos),
							node: nodeId
						})),
				preventDefault: true,
				stopPropagation: true
			} : (_Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton) ? {
				message: author$project$Update$DragModeMessage(
					author$project$Update$StartNodeMove(
						{
							mouse: author$project$Vec2$fromTuple(event.clientPos),
							node: nodeId
						})),
				preventDefault: true,
				stopPropagation: true
			} : {message: author$project$Update$DoNothing, preventDefault: false, stopPropagation: false});
		};
		var onContextMenu = function (event) {
			return _Utils_eq(dragMode, elm$core$Maybe$Nothing) ? author$project$Update$DragModeMessage(
				author$project$Update$StartPrepareEditingConnection(
					{
						mouse: author$project$Vec2$fromTuple(event.clientPos),
						node: nodeId
					})) : author$project$Update$DoNothing;
		};
		var mayStopPropagation = F2(
			function (tag, handler) {
				return A2(
					elm$html$Html$Events$stopPropagationOn,
					tag,
					A2(elm$json$Json$Decode$map, handler, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
			});
		var mayDragConnect = function () {
			_n0$2:
			while (true) {
				if (dragMode.$ === 'Just') {
					switch (dragMode.a.$) {
						case 'PrepareEditingConnection':
							var node = dragMode.a.a.node;
							return _Utils_eq(nodeId, node);
						case 'RetainPrototypedConnection':
							var node = dragMode.a.a.node;
							return _Utils_eq(nodeId, node);
						default:
							break _n0$2;
					}
				} else {
					break _n0$2;
				}
			}
			return false;
		}();
		var duplicateAndStopPropagation = function (event) {
			return _Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton) ? _Utils_Tuple2(
				author$project$Update$DuplicateNode(nodeId),
				true) : _Utils_Tuple2(author$project$Update$DoNothing, false);
		};
		var deleteAndStopPropagation = function (event) {
			return _Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton) ? _Utils_Tuple2(
				author$project$Update$DeleteNode(nodeId),
				true) : _Utils_Tuple2(author$project$Update$DoNothing, false);
		};
		var contentWidth = elm$core$String$fromFloat(
			author$project$Model$nodeWidth(nodeView.node)) + 'px';
		var autolayoutAndStopPropagation = function (event) {
			return _Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton) ? _Utils_Tuple2(
				author$project$Update$AutoLayout(nodeId),
				true) : _Utils_Tuple2(author$project$Update$DoNothing, false);
		};
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'width', contentWidth),
					author$project$View$translateHTML(nodeView.position),
					A2(
					author$project$View$classes,
					'graph-node',
					_List_fromArray(
						[
							_Utils_Tuple2(
							A2(author$project$View$hasDragConnectionPrototype, dragMode, nodeId),
							'connecting'),
							_Utils_Tuple2(
							_Utils_eq(
								outputNode,
								elm$core$Maybe$Just(nodeId)),
							'output'),
							_Utils_Tuple2(
							_Utils_eq(
								selectedNode,
								elm$core$Maybe$Just(nodeId)),
							'selected'),
							_Utils_Tuple2(mayDragConnect, 'may-drag-connect')
						]))
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('properties'),
							A2(preventDefaultAndMayStopPropagation, 'mousedown', onMouseDownAndStopPropagation),
							author$project$View$preventContextMenu(onContextMenu)
						]),
					A3(author$project$View$viewProperties, nodeId, dragMode, props)),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('menu')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(mayStopPropagation, 'mousedown', duplicateAndStopPropagation),
									elm$html$Html$Attributes$class('duplicate button'),
									elm$html$Html$Attributes$title('Duplicate this Node')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$img,
									_List_fromArray(
										[
											elm$html$Html$Attributes$src('html/img/copy.svg')
										]),
									_List_Nil)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(mayStopPropagation, 'mousedown', deleteAndStopPropagation),
									elm$html$Html$Attributes$class('delete button'),
									elm$html$Html$Attributes$title('Delete this Node')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$img,
									_List_fromArray(
										[
											elm$html$Html$Attributes$src('html/img/bin.svg')
										]),
									_List_Nil)
								]))
						]))
				]));
	});
var author$project$View$viewNode = F5(
	function (dragMode, selectedNode, outputNode, nodes, _n0) {
		var nodeId = _n0.a;
		var nodeView = _n0.b;
		var props = author$project$Model$nodeProperties(nodeView.node);
		return A2(
			author$project$View$NodeView,
			A6(author$project$View$viewNodeContent, dragMode, selectedNode, outputNode, nodeId, props, nodeView),
			A3(author$project$View$viewNodeConnections, nodes, props, nodeView));
	});
var author$project$Update$NoResult = {$: 'NoResult'};
var author$project$Update$UpdateSearch = function (a) {
	return {$: 'UpdateSearch', a: a};
};
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'blur',
		elm$json$Json$Decode$succeed(msg));
};
var elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'focus',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$View$viewSearchBar = function (search) {
	return A2(
		elm$html$Html$input,
		_List_fromArray(
			[
				elm$html$Html$Attributes$placeholder(
				_Utils_eq(search, elm$core$Maybe$Nothing) ? 'Add Nodes' : 'Search Nodes  or  Enter A Regular Expression'),
				elm$html$Html$Attributes$type_('text'),
				elm$html$Html$Attributes$value(
				A2(elm$core$Maybe$withDefault, '', search)),
				elm$html$Html$Events$onFocus(
				author$project$Update$SearchMessage(
					author$project$Update$UpdateSearch(''))),
				elm$html$Html$Events$onInput(
				function (text) {
					return author$project$Update$SearchMessage(
						author$project$Update$UpdateSearch(text));
				}),
				elm$html$Html$Events$onBlur(
				author$project$Update$SearchMessage(
					author$project$Update$FinishSearch(author$project$Update$NoResult)))
			]),
		_List_Nil);
};
var author$project$Model$Always = {$: 'Always'};
var author$project$Model$Never = {$: 'Never'};
var author$project$Model$Prototype = F3(
	function (name, node, description) {
		return {description: description, name: name, node: node};
	});
var author$project$Model$symbolProto = F2(
	function (getter, symbol) {
		return A3(
			author$project$Model$Prototype,
			getter(author$project$Model$symbolNames),
			author$project$Model$SymbolNode(symbol),
			getter(author$project$Model$symbolDescriptions));
	});
var author$project$Model$typeProto = F2(
	function (getter, prototype) {
		return A3(
			author$project$Model$Prototype,
			getter(author$project$Model$typeNames),
			prototype,
			getter(author$project$Model$typeDescriptions));
	});
var author$project$Model$prototypes = _List_fromArray(
	[
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.whitespace;
		},
		author$project$Model$WhitespaceChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.nonWhitespace;
		},
		author$project$Model$NonWhitespaceChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.digit;
		},
		author$project$Model$DigitChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.nonDigit;
		},
		author$project$Model$NonDigitChar),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.charset;
		},
		author$project$Model$CharSetNode('AEIOU')),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.set;
		},
		author$project$Model$SetNode(
			elm$core$Array$fromList(_List_Nil))),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.literal;
		},
		author$project$Model$LiteralNode('the')),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.sequence;
		},
		author$project$Model$SequenceNode(
			elm$core$Array$fromList(_List_Nil))),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.charRange;
		},
		A2(
			author$project$Model$CharRangeNode,
			_Utils_chr('A'),
			_Utils_chr('Z'))),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.notInCharRange;
		},
		A2(
			author$project$Model$NotInCharRangeNode,
			_Utils_chr('A'),
			_Utils_chr('Z'))),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.notInCharset;
		},
		author$project$Model$NotInCharSetNode(';:!?')),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.optional;
		},
		author$project$Model$OptionalNode(
			{expression: elm$core$Maybe$Nothing, minimal: false})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.atLeastOne;
		},
		author$project$Model$AtLeastOneNode(
			{expression: elm$core$Maybe$Nothing, minimal: false})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.anyRepetition;
		},
		author$project$Model$AnyRepetitionNode(
			{expression: elm$core$Maybe$Nothing, minimal: false})),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.end;
		},
		author$project$Model$End),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.start;
		},
		author$project$Model$Start),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.wordBoundary;
		},
		author$project$Model$WordBoundary),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.nonWordBoundary;
		},
		author$project$Model$NonWordBoundary),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.rangedRepetition;
		},
		author$project$Model$RangedRepetitionNode(
			{expression: elm$core$Maybe$Nothing, maximum: 4, minimal: false, minimum: 2})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.minimumRepetition;
		},
		author$project$Model$MinimumRepetitionNode(
			{count: 2, expression: elm$core$Maybe$Nothing, minimal: false})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.maximumRepetition;
		},
		author$project$Model$MaximumRepetitionNode(
			{count: 4, expression: elm$core$Maybe$Nothing, minimal: false})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.exactRepetition;
		},
		author$project$Model$ExactRepetitionNode(
			{count: 3, expression: elm$core$Maybe$Nothing})),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.word;
		},
		author$project$Model$WordChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.nonWord;
		},
		author$project$Model$NonWordChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.lineBreak;
		},
		author$project$Model$LinebreakChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.nonLineBreak;
		},
		author$project$Model$NonLinebreakChar),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.tab;
		},
		author$project$Model$TabChar),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.flags;
		},
		author$project$Model$FlagsNode(
			{expression: elm$core$Maybe$Nothing, flags: author$project$Model$defaultFlags})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.capture;
		},
		author$project$Model$CaptureNode(elm$core$Maybe$Nothing)),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.none;
		},
		author$project$Model$Never),
		A2(
		author$project$Model$symbolProto,
		function ($) {
			return $.any;
		},
		author$project$Model$Always),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.ifFollowedBy;
		},
		author$project$Model$IfFollowedByNode(
			{expression: elm$core$Maybe$Nothing, successor: elm$core$Maybe$Nothing})),
		A2(
		author$project$Model$typeProto,
		function ($) {
			return $.ifNotFollowedBy;
		},
		author$project$Model$IfNotFollowedByNode(
			{expression: elm$core$Maybe$Nothing, successor: elm$core$Maybe$Nothing}))
	]);
var author$project$Update$InsertLiteral = function (a) {
	return {$: 'InsertLiteral', a: a};
};
var author$project$Update$InsertPrototype = function (a) {
	return {$: 'InsertPrototype', a: a};
};
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$core$String$toLower = _String_toLower;
var elm$html$Html$code = _VirtualDom_node('code');
var elm$html$Html$p = _VirtualDom_node('p');
var elm$regex$Regex$contains = _Regex_contains;
var author$project$View$viewSearch = function (query) {
	var render = function (prototype) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('button'),
					A3(
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
					'mousedown',
					{preventDefault: false, stopPropagation: false},
					function (_n2) {
						return author$project$Update$SearchMessage(
							author$project$Update$FinishSearch(
								author$project$Update$InsertPrototype(prototype.node)));
					})
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('name')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(prototype.name)
						])),
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(prototype.description)
						]))
				]));
	};
	var regex = A2(
		elm$core$Maybe$withDefault,
		elm$regex$Regex$never,
		A2(
			elm$regex$Regex$fromStringWith,
			{caseInsensitive: true, multiline: false},
			query));
	var lowercaseQuery = elm$core$String$toLower(query);
	var isEmpty = elm$core$String$isEmpty(query);
	var test = function (name) {
		return isEmpty || (A2(
			elm$core$String$contains,
			lowercaseQuery,
			elm$core$String$toLower(name)) || A2(elm$regex$Regex$contains, regex, name));
	};
	var matches = function (prototype) {
		return test(prototype.name);
	};
	var results = A2(
		elm$core$List$map,
		render,
		A2(elm$core$List$filter, matches, author$project$Model$prototypes));
	var asRegex = A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('button'),
				A3(
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
				'mousedown',
				{preventDefault: false, stopPropagation: false},
				function (_n1) {
					return author$project$Update$SearchMessage(
						author$project$Update$FinishSearch(
							author$project$Update$ParseRegex(query)));
				})
			]),
		_List_fromArray(
			[
				elm$html$Html$text('Insert regular expression `'),
				A2(
				elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Model$insertWhitePlaceholder(query))
					])),
				elm$html$Html$text('` as Nodes'),
				A2(
				elm$html$Html$p,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Add that regular expression by converting it to a network of Nodes')
					]))
			]));
	var asLiteral = A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('button'),
				A3(
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
				'mousedown',
				{preventDefault: false, stopPropagation: false},
				function (_n0) {
					return author$project$Update$SearchMessage(
						author$project$Update$FinishSearch(
							author$project$Update$InsertLiteral(query)));
				})
			]),
		_List_fromArray(
			[
				elm$html$Html$text('Insert literal `'),
				A2(
				elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Model$insertWhitePlaceholder(query))
					])),
				elm$html$Html$text('` as Node '),
				A2(
				elm$html$Html$p,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Add a Node which matches exactly `' + (query + '` and nothing else'))
					]))
			]));
	return isEmpty ? results : A2(
		elm$core$List$cons,
		asRegex,
		A2(elm$core$List$cons, asLiteral, results));
};
var author$project$View$viewSearchResults = function (search) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$id('results'),
				author$project$View$stopMousePropagation('wheel')
			]),
		A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(elm$core$Maybe$map, author$project$View$viewSearch, search)));
};
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$h1 = _VirtualDom_node('h1');
var elm$html$Html$header = _VirtualDom_node('header');
var elm$html$Html$nav = _VirtualDom_node('nav');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var elm$html$Html$Attributes$target = elm$html$Html$Attributes$stringProperty('target');
var elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var elm$html$Html$Lazy$lazy = elm$virtual_dom$VirtualDom$lazy;
var elm$svg$Svg$g = elm$svg$Svg$trustedNode('g');
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'click', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseup', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$defaultOptions = {preventDefault: true, stopPropagation: false};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$Event = F3(
	function (mouseEvent, deltaY, deltaMode) {
		return {deltaMode: deltaMode, deltaY: deltaY, mouseEvent: mouseEvent};
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaLine = {$: 'DeltaLine'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPage = {$: 'DeltaPage'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPixel = {$: 'DeltaPixel'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$deltaModeDecoder = function () {
	var intToMode = function (_int) {
		switch (_int) {
			case 1:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaLine;
			case 2:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPage;
			default:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPixel;
		}
	};
	return A2(elm$json$Json$Decode$map, intToMode, elm$json$Json$Decode$int);
}();
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$eventDecoder = A4(
	elm$json$Json$Decode$map3,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$Event,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder,
	A2(elm$json$Json$Decode$field, 'deltaY', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'deltaMode', mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$deltaModeDecoder));
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWithOptions = F2(
	function (options, tag) {
		return A2(
			elm$html$Html$Events$custom,
			'wheel',
			A2(
				elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$eventDecoder));
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWheel = mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWithOptions(mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$defaultOptions);
var author$project$View$view = function (untrackedModel) {
	var trackedModel = untrackedModel.history.present;
	var startViewMove = function (event) {
		return _Utils_eq(event.button, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton) ? author$project$Update$DragModeMessage(
			author$project$Update$StartViewMove(
				{
					mouse: author$project$Vec2$fromTuple(event.clientPos)
				})) : author$project$Update$Deselect;
	};
	var nodeViews = A2(
		elm$core$List$map,
		A4(author$project$View$viewNode, untrackedModel.dragMode, trackedModel.selectedNode, trackedModel.outputNode.id, trackedModel.nodes),
		author$project$IdMap$toList(trackedModel.nodes));
	var expressionResult = A2(
		elm$core$Maybe$map,
		elm$core$Result$map(author$project$Build$constructRegexLiteral),
		trackedModel.cachedRegex);
	var connections = author$project$View$flattenList(
		A2(
			elm$core$List$map,
			function ($) {
				return $.connections;
			},
			nodeViews));
	var _n0 = function () {
		var _n1 = untrackedModel.dragMode;
		_n1$2:
		while (true) {
			if (_n1.$ === 'Just') {
				switch (_n1.a.$) {
					case 'MoveNodeDrag':
						var mouse = _n1.a.a.mouse;
						return _Utils_Tuple3(true, elm$core$Maybe$Nothing, mouse);
					case 'CreateConnection':
						var supplier = _n1.a.a.supplier;
						var openEnd = _n1.a.a.openEnd;
						return _Utils_Tuple3(
							false,
							elm$core$Maybe$Just(supplier),
							openEnd);
					default:
						break _n1$2;
				}
			} else {
				break _n1$2;
			}
		}
		return _Utils_Tuple3(
			false,
			elm$core$Maybe$Nothing,
			A2(author$project$Vec2$Vec2, 0, 0));
	}();
	var moveDragging = _n0.a;
	var connectDragId = _n0.b;
	var mousePosition = _n0.c;
	var connectDragging = !_Utils_eq(connectDragId, elm$core$Maybe$Nothing);
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				A2(
				author$project$View$conservativeOnMouse,
				'mousemove',
				function (event) {
					return author$project$Update$DragModeMessage(
						author$project$Update$UpdateDrag(
							{
								newMouse: author$project$Vec2$fromTuple(event.clientPos)
							}));
				}),
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp(
				elm$core$Basics$always(
					author$project$Update$DragModeMessage(author$project$Update$FinishDrag))),
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
				elm$core$Basics$always(
					author$project$Update$DragModeMessage(author$project$Update$FinishDrag))),
				elm$html$Html$Attributes$id('main'),
				A2(
				author$project$View$classes,
				'',
				_List_fromArray(
					[
						_Utils_Tuple2(moveDragging, 'move-dragging'),
						_Utils_Tuple2(connectDragging, 'connect-dragging'),
						_Utils_Tuple2(trackedModel.exampleText.isEditing, 'editing-example-text')
					]))
			]),
		_List_fromArray(
			[
				A2(elm$html$Html$Lazy$lazy, author$project$View$viewExampleText, trackedModel.exampleText),
				A2(
				elm$svg$Svg$svg,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('connection-graph')
					]),
				_List_fromArray(
					[
						A2(
						elm$svg$Svg$g,
						_List_fromArray(
							[
								author$project$View$magnifyAndOffsetSVG(untrackedModel.view)
							]),
						connectDragging ? _Utils_ap(
							connections,
							_List_fromArray(
								[
									A4(author$project$View$viewConnectDrag, untrackedModel.view, trackedModel.nodes, connectDragId, mousePosition)
								])) : connections)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('node-graph'),
						A3(
						mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
						'mousedown',
						{preventDefault: false, stopPropagation: false},
						startViewMove),
						mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWheel(
						function (event) {
							return author$project$Update$UpdateView(
								author$project$Update$MagnifyView(
									{
										amount: (event.deltaY < 0) ? 1 : (-1),
										focus: author$project$Vec2$fromTuple(event.mouseEvent.clientPos)
									}));
						}),
						author$project$View$preventContextMenu(
						elm$core$Basics$always(author$project$Update$DoNothing))
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('transform-wrapper'),
								author$project$View$magnifyAndOffsetHTML(untrackedModel.view)
							]),
						A2(
							elm$core$List$map,
							function ($) {
								return $.node;
							},
							nodeViews))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('overlay')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$nav,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								elm$html$Html$header,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										elm$html$Html$img,
										_List_fromArray(
											[
												elm$html$Html$Attributes$src('html/img/logo.svg')
											]),
										_List_Nil),
										A2(
										elm$html$Html$h1,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text('Regex Nodes')
											])),
										A2(
										elm$html$Html$a,
										_List_fromArray(
											[
												elm$html$Html$Attributes$href('https://johannesvollmer.github.io/2019/announcing-regex-nodes/'),
												elm$html$Html$Attributes$target('_blank'),
												elm$html$Html$Attributes$rel('noopener noreferrer'),
												elm$html$Html$Attributes$title('johannesvollmer.github.io/announcing-regex-nodes')
											]),
										_List_fromArray(
											[
												elm$html$Html$text(' About ')
											])),
										A2(
										elm$html$Html$a,
										_List_fromArray(
											[
												elm$html$Html$Attributes$href('https://johannesvollmer.github.io/2019/announcing-regex-nodes/#basic-editor-functionality'),
												elm$html$Html$Attributes$target('_blank'),
												elm$html$Html$Attributes$rel('noopener noreferrer'),
												elm$html$Html$Attributes$title('johannesvollmer.github.io/basic-editor-functionality')
											]),
										_List_fromArray(
											[
												elm$html$Html$text(' Help ')
											])),
										A2(
										elm$html$Html$a,
										_List_fromArray(
											[
												elm$html$Html$Attributes$href('https://github.com/johannesvollmer/regex-nodes'),
												elm$html$Html$Attributes$target('_blank'),
												elm$html$Html$Attributes$rel('noopener noreferrer'),
												elm$html$Html$Attributes$title('github.com/johannesvollmer/regex-nodes')
											]),
										_List_fromArray(
											[
												elm$html$Html$text(' Github ')
											]))
									])),
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('example-options')
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$id('match-limit'),
												elm$html$Html$Attributes$title(
												'Display no more than ' + (elm$core$String$fromInt(trackedModel.exampleText.maxMatches) + ' Matches from the example text, in order to perserve responsivenes'))
											]),
										_List_fromArray(
											[
												elm$html$Html$text('Example Match Limit'),
												A2(
												author$project$View$viewPositiveIntInput,
												trackedModel.exampleText.maxMatches,
												A2(elm$core$Basics$composeL, author$project$Update$UpdateExampleText, author$project$Update$UpdateMaxMatchLimit))
											])),
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$id('edit-example'),
												elm$html$Html$Attributes$class('button'),
												elm$html$Html$Attributes$checked(trackedModel.exampleText.isEditing),
												mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
												elm$core$Basics$always(
													author$project$Update$UpdateExampleText(
														author$project$Update$SetEditing(!trackedModel.exampleText.isEditing)))),
												elm$html$Html$Attributes$title('Edit the Text which is displayed in the background')
											]),
										_List_fromArray(
											[
												elm$html$Html$text('Edit Example')
											]))
									]))
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$id('search')
							]),
						_List_fromArray(
							[
								author$project$View$viewSearchBar(untrackedModel.search),
								author$project$View$viewSearchResults(untrackedModel.search)
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$id('history')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('undo'),
										elm$html$Html$Attributes$title('Undo the last action'),
										A2(
										author$project$View$classes,
										'button',
										_List_fromArray(
											[
												_Utils_Tuple2(
												elm$core$List$isEmpty(untrackedModel.history.past),
												'disabled')
											])),
										mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
										elm$core$Basics$always(author$project$Update$Undo))
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$img,
										_List_fromArray(
											[
												elm$html$Html$Attributes$src('html/img/arrow-left.svg')
											]),
										_List_Nil)
									])),
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('redo'),
										elm$html$Html$Attributes$title('Undo the last action'),
										A2(
										author$project$View$classes,
										'button',
										_List_fromArray(
											[
												_Utils_Tuple2(
												elm$core$List$isEmpty(untrackedModel.history.future),
												'disabled')
											])),
										mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
										elm$core$Basics$always(author$project$Update$Redo))
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$img,
										_List_fromArray(
											[
												elm$html$Html$Attributes$src('html/img/arrow-left.svg')
											]),
										_List_Nil)
									]))
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$id('expression-result'),
								A2(
								author$project$View$classes,
								'',
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(expressionResult, elm$core$Maybe$Nothing),
										'no')
									]))
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$code,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										elm$html$Html$span,
										_List_fromArray(
											[
												elm$html$Html$Attributes$id('declaration')
											]),
										_List_fromArray(
											[
												elm$html$Html$text('const regex = ')
											])),
										elm$html$Html$text(
										author$project$View$unwrapResult(
											A2(
												elm$core$Maybe$withDefault,
												elm$core$Result$Ok('/(nothing)/'),
												expressionResult)))
									])),
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('lock'),
										A2(
										author$project$View$classes,
										'button',
										_List_fromArray(
											[
												_Utils_Tuple2(trackedModel.outputNode.locked, 'checked')
											])),
										mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
										elm$core$Basics$always(
											author$project$Update$SetOutputLocked(!trackedModel.outputNode.locked))),
										elm$html$Html$Attributes$title('Always show the regex of the selected Node')
									]),
								_List_fromArray(
									[author$project$View$lockSvg]))
							]))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('cycles-detected'),
						A2(
						author$project$View$classes,
						'notification button',
						_List_fromArray(
							[
								_Utils_Tuple2(trackedModel.cyclesError, 'show')
							])),
						mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
						elm$core$Basics$always(author$project$Update$DismissCyclesError))
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Some actions cannot be performed due to cycles in the node graph.'),
						A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('Make sure there are no cyclic connections. Click to dismiss.')
							]))
					]))
			]));
};
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$element = _Browser_element;
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$core$Platform$Sub$none = elm$core$Platform$Sub$batch(_List_Nil);
var author$project$Main$main = elm$browser$Browser$element(
	{
		init: function (flags) {
			return _Utils_Tuple2(
				author$project$Main$init(flags),
				elm$core$Platform$Cmd$none);
		},
		subscriptions: elm$core$Basics$always(elm$core$Platform$Sub$none),
		update: F2(
			function (message, model) {
				return A2(author$project$Main$update, message, model);
			}),
		view: author$project$View$view
	});
_Platform_export({'Main':{'init':author$project$Main$main(elm$json$Json$Decode$string)(0)}});}(this));