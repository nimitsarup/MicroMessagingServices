const { broker } = require('./ServiceBrokerDefinition');
const pullSocket = require(`zmq`).socket(`pull`);

broker.createService({
    name: "HashRecordingService",

    started() {
        pullSocket.bindSync(`tcp://127.0.0.1:3001`);

        pullSocket.on(`message`, function (msg) {
            console.log(`Storing: ${msg}`);
        });
    }
});

broker.start().then(() => broker.repl());