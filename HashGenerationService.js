const { broker } = require('./ServiceBrokerDefinition');
const crypto = require('crypto');

broker.createService({
    name: "HashGenerationService",

    started() {
        const pullSocket = require(`zmq`).socket(`pull`);
        pullSocket.connect(`tcp://127.0.0.1:3000`);

        const pushSocket = require(`zmq`).socket(`push`);
        pushSocket.connect(`tcp://127.0.0.1:3001`);

        pullSocket.on(`message`, function (msg) {
            const timestamp = Date.now().toString();
            console.log(timestamp + ` - Received: ${msg}`);

            var seqNumCheck = msg.toString().split(' ')[0];
            
            var sha256 = crypto.createHash('sha256').update(msg).digest("hex");
            broker.emit("StatEvent.HashGeneratedEvent", { id: seqNumCheck, time: Date.now() }, ["StatsGatheringService"]);

            pushSocket.send(seqNumCheck + "-" + sha256);
        });
    }
});

broker.start().then(() => broker.repl());
