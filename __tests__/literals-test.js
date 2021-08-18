module.exports = (test) => {
    // NumericLiteral
    test('42', {
        type: 'Program',
        body: {
            type: 'NumericLiteral',
            value: 42,
        },
    });

    // StringLiteral
    test('"hello"', {
        type: 'Program',
        body: {
            type: 'StringLiteral',
            value: '42',
        },
    });

    // StringLiteral
    test("'hello'", {
        type: 'Program',
        body: {
            type: 'StringLiteral',
            value: '42',
        },
    });
};
