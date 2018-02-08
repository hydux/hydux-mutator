import * as P from 'parsimmon'

/////////////////////////////////////
let whitespace = P.regexp(/\s*/m)
// Several parsers are just strings with optional whitespace.
function word(str) {
  return P.string(str).thru(token)
}
function token(parser) {
  return parser.skip(whitespace)
}

// Turn escaped characters into real ones (e.g. '\\n' becomes '\n').
function interpretEscapes(str) {
  let escapes = {
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
  }
  return str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (_, escape) => {
    let type = escape.charAt(0)
    let hex = escape.slice(1)
    if (type === 'u') {
      return String.fromCharCode(parseInt(hex, 16))
    }
    if (escapes.hasOwnProperty(type)) {
      return escapes[type]
    }
    return type
  })
}

export default P.createLanguage({
  _: () => P.optWhitespace,
  letters: () => P.regexp(/[a-zA-Z0-9$_]+/).skip(whitespace).desc('letters'),
  lettersArray: r => r.lbracket.then(r.letters.sepBy(r.comma)).skip(r.rbracket).desc('letters array'),
  arg: r => r.letters.or(r.lettersArray).desc('arg'),
  lbracket: () => word('['),
  rbracket: () => word(']'),
  lparen: () => word('('),
  get: () => word('get'),
  rparen: () => word(')'),
  lbrace: () => word('{'),
  rbrace: () => word('}'),
  comma: () => word(','),
  dot: () => word('.'),
  semi: () => word(';'),
  arrow: () => word('=>'),
  param: r =>
    P.regexp(/"((?:\\.|.)*?)"/, 1)
      .map(value => ({
        type: 'string',
        value: interpretEscapes(value)
      }))
      .or(P.regexp(/'((?:\\.|.)*?)'/, 1).map(value => ({
        type: 'string',
        value: interpretEscapes(value)
      })))
      .or(P.regexp(/\d+/).map(value => ({
        type: 'number',
        value: Number(value)
      })))
      .or(r.letters.map(value => ({
        type: 'variable',
        value,
      }))),
  field: r => r._
    .then(r.dot.then(r.get).then(r.lparen).then(r.param).skip(r.rparen))
    .or(r.dot.then(r.letters.map(value => ({
      type: 'string',
      value
    }))))
    .or(r.lbracket.then(r.param).skip(r.rbracket)),
  fnKeyword: () => word('function'),
  return: () => word('return'),
  function: r => P.seqObj(
    r.fnKeyword,
    r.lparen,
    ['args', r.arg.sepBy(r.comma).desc('args')],
    r.rparen,
    r.lbrace,
    r.return,
    ['obj', r.letters],
    ['keyPath', r.field.sepBy(r._)],
    r.semi.or(r._),
    r.rbrace,
    P.eof,
  ),
  lambda: r => P.seqObj(
    r.lparen.or(r._),
    ['args', r.arg.sepBy(r.comma).desc('args')],
    r.rparen.or(r._),
    r.arrow,
    r.lbrace.or(r._),
    r.return.or(r._),
    ['obj', r.letters],
    ['keyPath', r.field.sepBy(r._)],
    r.semi.or(r._),
    r.rbrace.or(r._),
    P.eof,
  ),

  accessor: r => r.function.or(r.lambda)
})
