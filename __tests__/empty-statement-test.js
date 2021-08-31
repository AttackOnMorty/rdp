module.exports = (test) => {
    test(';', {
        type: 'Program',
        body: [
            {
                type: 'EmptyStatement',
            },
        ],
    });
};
