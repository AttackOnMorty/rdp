const assert = require('assert');
const { Parser } = require('../src/Parser');
const tests = [
    require('./literals-test'),
    require('./statement-list-test'),
    require('./block-test'),
    require('./empty-statement-test'),
    require('./math-test'),
    require('./assignment-test'),
    require('./variable-test'),
    require('./if-test'),
    require('./relational-test'),
    require('./equality-test'),
    require('./unary-test'),
    require('./while-test'),
    require('./do-while-test'),
    require('./for-test'),
    require('./function-declaration-test'),
    require('./member-test'),
    require('./call-test'),
    require('./class-test'),
];

const parser = new Parser();

/**
 * For manual tests.
 */
function exec() {
    const program = `

    class Point {
      def constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      def calc() {
        return this.x + this.y;
      }
    }

    `;

    const ast = parser.parse(program);

    console.log(JSON.stringify(ast, null, 4));
}

// Manual test:
exec();

const test = (program, expected) => {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
};

tests.forEach((testRun) => testRun(test));

console.log('All assertions passed!');
