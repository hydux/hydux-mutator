"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var P = require("parsimmon");
/////////////////////////////////////
var whitespace = P.regexp(/\s*/m);
// Several parsers are just strings with optional whitespace.
function word(str) {
    return P.string(str).thru(token);
}
function token(parser) {
    return parser.skip(whitespace);
}
// Turn escaped characters into real ones (e.g. '\\n' becomes '\n').
function interpretEscapes(str) {
    var escapes = {
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t'
    };
    return str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, function (_, escape) {
        var type = escape.charAt(0);
        var hex = escape.slice(1);
        if (type === 'u') {
            return String.fromCharCode(parseInt(hex, 16));
        }
        if (escapes.hasOwnProperty(type)) {
            return escapes[type];
        }
        return type;
    });
}
exports.default = P.createLanguage({
    _: function () { return P.optWhitespace; },
    letters: function () { return P.regexp(/[a-zA-Z0-9$_]+/).skip(whitespace).desc('letters'); },
    lettersArray: function (r) { return r.lbracket.then(r.letters.sepBy(r.comma)).skip(r.rbracket).desc('letters array'); },
    arg: function (r) { return r.letters.or(r.lettersArray).desc('arg'); },
    lbracket: function () { return word('['); },
    rbracket: function () { return word(']'); },
    lparen: function () { return word('('); },
    get: function () { return word('get'); },
    rparen: function () { return word(')'); },
    lbrace: function () { return word('{'); },
    rbrace: function () { return word('}'); },
    comma: function () { return word(','); },
    dot: function () { return word('.'); },
    semi: function () { return word(';'); },
    arrow: function () { return word('=>'); },
    param: function (r) {
        return P.regexp(/"((?:\\.|.)*?)"/, 1)
            .map(function (value) { return ({
            type: 'string',
            value: interpretEscapes(value)
        }); })
            .or(P.regexp(/'((?:\\.|.)*?)'/, 1).map(function (value) { return ({
            type: 'string',
            value: interpretEscapes(value)
        }); }))
            .or(P.regexp(/\d+/).map(function (value) { return ({
            type: 'number',
            value: Number(value)
        }); }))
            .or(r.letters.map(function (value) { return ({
            type: 'variable',
            value: value,
        }); }));
    },
    field: function (r) { return r._
        .then(r.dot.then(r.get).then(r.lparen).then(r.param).skip(r.rparen))
        .or(r.dot.then(r.letters.map(function (value) { return ({
        type: 'string',
        value: value
    }); })))
        .or(r.lbracket.then(r.param).skip(r.rbracket)); },
    fnKeyword: function () { return word('function'); },
    return: function () { return word('return'); },
    function: function (r) { return P.seqObj(r.fnKeyword, r.lparen, ['args', r.arg.sepBy(r.comma).desc('args')], r.rparen, r.lbrace, r.return, ['obj', r.letters], ['keyPath', r.field.sepBy(r._)], r.semi.or(r._), r.rbrace, P.eof); },
    lambda: function (r) { return P.seqObj(r.lparen.or(r._), ['args', r.arg.sepBy(r.comma).desc('args')], r.rparen.or(r._), r.arrow, r.lbrace.or(r._), r.return.or(r._), ['obj', r.letters], ['keyPath', r.field.sepBy(r._)], r.semi.or(r._), r.rbrace.or(r._), P.eof); },
    accessor: function (r) { return r.function.or(r.lambda); }
});
//# sourceMappingURL=parser.js.map