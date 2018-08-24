const { broker } = require('./ServiceBrokerDefinition');
const DbService = require("moleculer-db");
const pullSocket = require(`zmq`).socket(`pull`);

broker.createService({
    name: "HashRecordingService",
    
    mixins: [DbService],
    settings: {
        fields: ["_id"]
    },

    started() {
        pullSocket.bindSync(`tcp://127.0.0.1:3001`);

        pullSocket.on(`message`, function (msg) {
            //console.log(`Storing: ${msg}`);

            var parts = msg.toString().split('-');
            broker.call("HashRecordingService.create", { _id: parts[1] })
                  .then(() => broker.emit("StatEvent.HashRecordedEvent", { id: parts[0], time: Date.now() }, ["StatsGatheringService"]));
        });

        // Report the number of commited rows every 5 seconds
        setInterval(() => this.broker.call("HashRecordingService.count").then((numrows) => console.log(`[ ${numrows} hashes commited to the database ]`)), 10000);

    }
});

broker.start().then(() => broker.repl());