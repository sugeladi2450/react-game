// AST-based expression evaluator (Lexer -> Parser -> AST -> Eval)
// Supports: numbers, + - * /, parentheses (), unary +/-, whitespace.

export const TokenType = {
  Number: "Number",
  Plus: "Plus",
  Minus: "Minus",
  Star: "Star",
  Slash: "Slash",
  LParen: "LParen",
  RParen: "RParen",
  EOF: "EOF",
};

/**
 * @typedef {{ type: string, lexeme: string, value?: number, pos: number }} Token
 */

export class Lexer {
  /** @param {string} input */
  constructor(input) {
    this.input = input ?? "";
    this.i = 0;
  }

  peek() {
    return this.i < this.input.length ? this.input[this.i] : "\0";
  }

  advance() {
    const ch = this.peek();
    this.i += 1;
    return ch;
  }

  isDigit(ch) {
    return ch >= "0" && ch <= "9";
  }

  skipWhitespace() {
    while (true) {
      const ch = this.peek();
      if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
        this.advance();
        continue;
      }
      break;
    }
  }

  readNumber() {
    const start = this.i;
    let sawDot = false;

    while (true) {
      const ch = this.peek();
      if (this.isDigit(ch)) {
        this.advance();
        continue;
      }
      if (ch === "." && !sawDot) {
        sawDot = true;
        this.advance();
        continue;
      }
      break;
    }

    const lexeme = this.input.slice(start, this.i);
    // Reject standalone "." (no digits)
    if (lexeme === ".") {
      throw new Error(`Invalid number '.' at position ${start}`);
    }
    const value = Number(lexeme);
    if (!Number.isFinite(value)) {
      throw new Error(`Invalid number '${lexeme}' at position ${start}`);
    }

    return { type: TokenType.Number, lexeme, value, pos: start };
  }

  /** @returns {Token} */
  nextToken() {
    this.skipWhitespace();
    const pos = this.i;
    const ch = this.peek();

    if (ch === "\0") {
      return { type: TokenType.EOF, lexeme: "", pos };
    }

    if (this.isDigit(ch) || ch === ".") {
      return this.readNumber();
    }

    switch (ch) {
      case "+":
        this.advance();
        return { type: TokenType.Plus, lexeme: "+", pos };
      case "-":
        this.advance();
        return { type: TokenType.Minus, lexeme: "-", pos };
      case "*":
        this.advance();
        return { type: TokenType.Star, lexeme: "*", pos };
      case "/":
        this.advance();
        return { type: TokenType.Slash, lexeme: "/", pos };
      case "(":
        this.advance();
        return { type: TokenType.LParen, lexeme: "(", pos };
      case ")":
        this.advance();
        return { type: TokenType.RParen, lexeme: ")", pos };
      default:
        throw new Error(`Unexpected character '${ch}' at position ${pos}`);
    }
  }

  /** @returns {Token[]} */
  tokenize() {
    const tokens = [];
    while (true) {
      const t = this.nextToken();
      tokens.push(t);
      if (t.type === TokenType.EOF) break;
    }
    return tokens;
  }
}

// AST node constructors
export const NodeType = {
  NumberLiteral: "NumberLiteral",
  UnaryExpr: "UnaryExpr",
  BinaryExpr: "BinaryExpr",
};

export function numberLiteral(value) {
  return { type: NodeType.NumberLiteral, value };
}

export function unaryExpr(op, expr) {
  return { type: NodeType.UnaryExpr, op, expr };
}

export function binaryExpr(op, left, right) {
  return { type: NodeType.BinaryExpr, op, left, right };
}

export class Parser {
  /** @param {Token[]} tokens */
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  current() {
    return this.tokens[this.pos];
  }

  match(type) {
    if (this.current().type === type) {
      this.pos += 1;
      return true;
    }
    return false;
  }

  consume(type, message) {
    const t = this.current();
    if (t.type === type) {
      this.pos += 1;
      return t;
    }
    throw new Error(`${message} at position ${t.pos}`);
  }

  // Grammar (recursive descent):
  // expr   -> term ((+|-) term)*
  // term   -> factor ((*|/) factor)*
  // factor -> (+|-) factor | primary
  // primary-> number | '(' expr ')'

  parse() {
    const ast = this.parseExpr();
    this.consume(TokenType.EOF, "Expected end of input");
    return ast;
  }

  parseExpr() {
    let node = this.parseTerm();
    while (true) {
      if (this.match(TokenType.Plus)) {
        const right = this.parseTerm();
        node = binaryExpr("+", node, right);
        continue;
      }
      if (this.match(TokenType.Minus)) {
        const right = this.parseTerm();
        node = binaryExpr("-", node, right);
        continue;
      }
      break;
    }
    return node;
  }

  parseTerm() {
    let node = this.parseFactor();
    while (true) {
      if (this.match(TokenType.Star)) {
        const right = this.parseFactor();
        node = binaryExpr("*", node, right);
        continue;
      }
      if (this.match(TokenType.Slash)) {
        const right = this.parseFactor();
        node = binaryExpr("/", node, right);
        continue;
      }
      break;
    }
    return node;
  }

  parseFactor() {
    if (this.match(TokenType.Plus)) {
      // unary +
      return unaryExpr("+", this.parseFactor());
    }
    if (this.match(TokenType.Minus)) {
      // unary -
      return unaryExpr("-", this.parseFactor());
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const t = this.current();
    if (this.match(TokenType.Number)) {
      return numberLiteral(t.value);
    }
    if (this.match(TokenType.LParen)) {
      const node = this.parseExpr();
      this.consume(TokenType.RParen, "Expected ')'");
      return node;
    }
    throw new Error(`Expected number or '(' at position ${t.pos}`);
  }
}

export function evalAst(node) {
  switch (node.type) {
    case NodeType.NumberLiteral:
      return node.value;
    case NodeType.UnaryExpr: {
      const v = evalAst(node.expr);
      if (node.op === "+") return +v;
      if (node.op === "-") return -v;
      throw new Error(`Unknown unary operator '${node.op}'`);
    }
    case NodeType.BinaryExpr: {
      const a = evalAst(node.left);
      const b = evalAst(node.right);
      switch (node.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        default:
          throw new Error(`Unknown binary operator '${node.op}'`);
      }
    }
    default:
      throw new Error(`Unknown node type '${node.type}'`);
  }
}

export function evaluateExpression(input) {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const value = evalAst(ast);
  if (!Number.isFinite(value)) {
    throw new Error("Computation resulted in a non-finite number");
  }
  return value;
}
