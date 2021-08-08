const Spec = [
    // Numbers:
    ['NUMBER', /^\d+/],

    // Strings:
    ['STRING', /^"[^"]*"/],
    ['STRING', /^'[^']*'/],
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
        return this._cursor < this._string.length;
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [tokenType, regexp] of Spec) {
            const tokenValue = this._match(regexp, string);

            if (tokenValue === null) {
                continue;
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
