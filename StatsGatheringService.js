const { broker } = require('./ServiceBrokerDefinition');
const chalk = require('chalk');

// Trade -> Hash Generation
let minTradeToHashGen = 0;
let maxTradeToHashGen = 0;

// Trade -> Hash recording
let minTradeToHashRec = 0;
let maxTradeToHashRec = 0;

let statMap = new Map();

broker.createService({
    name: "StatsGatheringService",

    events: {
		"StatEvent.TradeGeneratedEvent"(data) {
            console.log(chalk.yellow.bold(`Trade ${data.id} generated at ${data.time}`));
            statMap.set(data.id, data.time);
        },
        
        "StatEvent.HashGeneratedEvent"(data) {
            console.log(`Trade ${data.id} hash-generated at ${data.time}`);
            var tradeGen = statMap.get(data.id);
            if(tradeGen) {
                var tradeToHashGen = date.time - tradeGen;
            }
        },
        
        "StatEvent.HashRecordedEvent"(data) {
            console.log(`Trade ${data.id} hash-saved at ${data.time}`);
		},
    },

    started() {
        setInterval(() => console.log("AHA"), 5000);
    }
});

broker.start().then(() => broker.repl());