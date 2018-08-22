const {ServiceBroker} = require('moleculer');

const broker = new ServiceBroker({
    namespace: "ducatur",
    nodeID: "NODE-" + process.pid,
    requestTimeout: 1000,

    circuitBreaker: {
        enabled: false,
        maxFailures: 3
    },

    logger: console,
    logLevel: process.env.LOGLEVEL,
    logFormatter: "simple"
});

module.exports = { broker };