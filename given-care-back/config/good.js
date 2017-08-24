'use-strict';

module.exports = {
    ops: {
        interval: 1000
    },
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                log: '*',
                response: '*',
                request: ['error', 'warn', 'info'],
                error: '*'
            }]
        }, {
            module: 'good-console',
            args: [
                {
                    format: 'YYYY-MM-DD HH:mm:ss.SSS'
                }
            ]
        }, 'stdout']
    }
};