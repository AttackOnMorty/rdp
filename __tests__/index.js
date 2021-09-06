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
];

const parser = new Parser();

/**
 * For manual tests.
 */
function exec() {
    const program = `

    let y;

    let a, b;

    let c, d = 10;

    let x = 42;

    r = 10;

    `;

    const ast = parser.parse(program);

    console.log(JSON.stringify(ast, null, 2));
}

// Manual test:
exec();

const test = (program, expected) => {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
};

tests.forEach((testRun) => testRun(test));

console.log('All assertions passed!');
