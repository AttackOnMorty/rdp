const { Tokenizer } = require('./Tokenizer');

class Parser {
    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    parse(string) {
        this._string = string;
        this._tokenizer.init(string);
        this._currentToken = this._tokenizer.getNextToken();

        return this.Program();
    }

    /**
     * Program
     *   : StatementList
     *   ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.StatementList(),
        };
    }

    /**
     * StatementList
     *   : Statement
     *   | StatementList Statement
     *   ;
     */
    StatementList(stopLookahead = null) {
        const statementList = [this.Statement()];
        while (
            this._currentToken !== null &&
            this._currentToken.type !== stopLookahead
        ) {
            statementList.push(this.Statement());
        }
        return statementList;
    }

    /**
     * Statement
     *   : ExpressionStatement
     *   | BlockStatement
     *   | EmptyStatement
     *   ;
     */
    Statement() {
        switch (this._currentToken.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    /**
     * EmptyStatement
     *   : ';'
     *   ;
     */
    EmptyStatement() {
        this._eat(';');
        return {
            type: 'EmptyStatement',
        };
    }

    /**
     * BlockStatement
     *   : '{' OptStatementList '}'
     *   ;
     */
    BlockStatement() {
        this._eat('{');

        const body =
            this._currentToken.type !== '}' ? this.StatementList('}') : [];

        this._eat('}');

        return {
            type: 'BlockStatement',
            body,
        };
    }

    /**
     * ExpressionStatement
     *   : Expression ';'
     *   ;
     */
    ExpressionStatement() {
        const expression = this.Expression();
        // Every expression must end with ';'
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression,
        };
    }

    /**
     * Expression
     *   : AdditiveExpression
     *   ;
     */
    Expression() {
        return this.AdditiveExpression();
    }

    /**
     * AdditiveExpression
     *   : MultiplicativeExpression
     *   | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
     *   ;
     */
    AdditiveExpression() {
        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR'
        );
    }

    /**
     * AdditiveExpression
     *   : PrimaryExpression
     *   | AdditiveExpression ADDITIVE_OPERATOR PrimaryExpression
     *   ;
     */
    MultiplicativeExpression() {
        return this._BinaryExpression(
            'PrimaryExpression',
            'MULTIPLICATIVE_OPERATOR'
        );
    }

    /**
     * Generic binary expression.
     */
    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();

        while (this._currentToken.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            };
        }

        return left;
    }

    /**
     * PrimaryExpression
     *   : Literal
     *   | ParenthesizedExpression
     *   ;
     */
    PrimaryExpression() {
        switch (this._currentToken.type) {
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.Literal();
        }
    }

    /**
     * ParenthesizedExpression
     *   : '(' Expression ')'
     *   ;
     */
    ParenthesizedExpression() {
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }

    /**
     * Literal
     *   : NumericLiteral
     *   | StringLiteral
     *   ;
     */
    Literal() {
        switch (this._currentToken.type) {
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
     *   : NUMBER
     *   ;
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
     *   : STRING
     *   ;
     */
    StringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    }

    _eat(tokenType) {
        const token = this._currentToken;

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

        this._currentToken = this._tokenizer.getNextToken();

        return token;
    }
}

module.exports = {
    Parser,
};
