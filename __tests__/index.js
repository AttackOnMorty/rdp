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
];

const parser = new Parser();

/**
 * For manual tests.
 */
function exec() {
    const program = `

    if (x > 1) {
        x = 1;
    } else {
        x += 1;
    }

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
