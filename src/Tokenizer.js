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

        if (!isNaN(Number(string[0]))) {
            let number = '';
            // FIXME: this._cursor happens to be a counter start from 0
            while (!isNaN(Number(string[this._cursor]))) {
                number += string[this._cursor++];
            }
            return {
                type: 'NUMBER',
                value: number,
            };
        }

        if (string[0] === '"') {
            let s = '';
            // NOTE: Use do while to push first "
            do {
                s += string[this._cursor++];
            } while (string[this._cursor] !== '"' && !this.isEOF());
            s += string[this._cursor++];
            return {
                type: 'STRING',
                value: s,
            };
        }

        if (string[0] === "'") {
            let s = '';
            // NOTE: Use do while to push first '
            do {
                s += string[this._cursor++];
            } while (string[this._cursor] !== "'" && !this.isEOF());
            s += string[this._cursor++];
            return {
                type: 'STRING',
                value: s,
            };
        }

        return null;
    }
}

module.exports = {
    Tokenizer,
};
