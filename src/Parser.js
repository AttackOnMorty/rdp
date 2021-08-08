const { Tokenizer } = require('./Tokenizer');

class Parser {
    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    parse(string) {
        this._string = string;
        this._tokenizer.init(string);
        this._lookahead = this._tokenizer.getNextToken();

        return this.Program();
    }

    /**
     * Program
     *  : NumericLiteral
     *  ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.Literal(),
        };
    }

    /**
     * Literal
     *  : NumericLiteral
     *  | StringLiteral
     *  ;
     */
    Literal() {
        switch (this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
            default:
                throw new SyntaxError('Literal: unexpected literal production');
        }
    }

    /**
     * NumericLiteral
     *  : NUMBER
     *  ;
     */
    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: token.value,
        };
    }

    /**
     * StringLiteral
     *  : STRING
     *  ;
     */
    StringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if (token === null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}"`
            );
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected: "${tokenType}"`
            );
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

module.exports = {
    Parser,
};
