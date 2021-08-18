module.exports = (test) => {
    // StatementList
    test(
        `
    'hello';

    42;
    
    `,
        {
            body: [
                {
                    expression: {
                        type: 'StringLiteral',
                        value: 'hello',
                    },
                    type: 'ExpressionStatement',
                },
                {
                    expression: {
                        type: 'NumericLiteral',
                        value: '42',
                    },
                    type: 'ExpressionStatement',
                },
            ],
            type: 'Program',
        }
    );
};
