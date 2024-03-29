/**
 *  Numbers > Identifiers
 *  Equality(==) > Assignment(=)
 *  Equality(!=) > Logical(!)
 *  Assignment(+= -= *= /=) > Math(+ - * /)
 */

const Spec = [
    // -----------------------------------
    // Spaces:
    [/^\s/, null],

    // -----------------------------------
    // Comments:

    // Single-line comments
    [/^\/\/.*/, null],

    // Multi-line comments
    // TODO: why lazy match
    [/^\/\*[\s\S]*?\*\//, null],

    // -----------------------------------
    // Symbols, delimiters:
    [/^;/, ';'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^,/, ','],
    [/^\./, '.'],
    [/^\[/, '['],
    [/^\]/, ']'],

    // -----------------------------------
    // Keywords:
    [/^\blet\b/, 'let'],
    [/^\bif\b/, 'if'],
    [/^\belse\b/, 'else'],
    [/^\btrue\b/, 'true'],
    [/^\bfalse\b/, 'false'],
    [/^\bnull\b/, 'null'],
    [/^\bwhile\b/, 'while'],
    [/^\bdo\b/, 'do'],
    [/^\bfor\b/, 'for'],
    [/^\bdef\b/, 'def'],
    [/^\breturn\b/, 'return'],
    [/^\bclass\b/, 'class'],
    [/^\bextends\b/, 'extends'],
    [/^\bsuper\b/, 'super'],
    [/^\bthis\b/, 'this'],
    [/^\bnew\b/, 'new'],

    // -----------------------------------
    // Numbers:
    [/^\d+/, 'NUMBER'],

    // -----------------------------------
    // Identifiers:
    [/^\w+/, 'IDENTIFIER'],

    // -----------------------------------
    // Equality operators: ==, !=
    [/^[=!]=/, 'EQUALITY_OPERATOR'],

    // -----------------------------------
    // Logical operators: && ||
    [/^&&/, 'LOGICAL_AND'],
    [/^\|\|/, 'LOGICAL_OR'],
    [/^!/, 'LOGICAL_NOT'],

    // -----------------------------------
    // Assignment operators: =, *=, /=, +=, -=
    [/^=/, 'SIMPLE_ASSIGN'],
    [/^[*/+-]=/, 'COMPLEX_ASSIGN'],

    // -----------------------------------
    // Relational operators: >, >=, <, <=
    [/^[><]=?/, 'RELATIONAL_OPERATOR'],

    // -----------------------------------
    // Math operators: +, -, *, /:
    [/^[+-]/, 'ADDITIVE_OPERATOR'],
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],

    // -----------------------------------
    // Strings:

    // Double-quoted strings
    [/^"[^"]*"/, 'STRING'],

    // Single-quoted strings
    [/^'[^']*'/, 'STRING'],
];

class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    isEOF() {
        return this._cursor === this._string.length;
    }

    hasMoreTokens() {
        // this._cursor points to the current unhandled character. So the max value will be this._string.length - 1
        return this._cursor < this._string.length;
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);

            // Can't match this rule, continue
            if (tokenValue === null) {
                continue;
            }

            // Should skip token, e.g. whitespace
            if (tokenType === null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected token: ${string[0]}`);
    }

    _match(regexp, string) {
        const matched = regexp.exec(string);
        if (matched === null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];
    }
}

module.exports = {
    Tokenizer,
};
