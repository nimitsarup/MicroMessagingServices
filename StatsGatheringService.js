const { broker } = require('./ServiceBrokerDefinition');
const chalk = require('chalk');

broker.createService({
    name: "StatsGatheringService",

    started() {
        setInterval(() => {
            broker.call("TradeGenerationService.reportStats").then((args) => console.log(chalk.red.bold(JSON.stringify(args))));
            broker.call("HashGenerationService.reportStats").then((args) => console.log(chalk.yellow(JSON.stringify(args))));
        }, 5000);
    },

    /*events: {
		"StatEvent.TradeGeneratedEvent"(data) {
            //console.log(chalk.yellow.bold(`Trade ${data.id} generated at ${data.time}`));
            this.totalTrades = data.NumOfTradesGenerated;
        },
        
        "StatEvent.HashGeneratedEvent"(data) {
            //console.log(`Trade ${data.id} hash-generated at ${data.time}`);
            var tradeGenTime = data.id;
            if(tradeGenTime) {
                var tradeToHashGen = data.time - tradeGenTime;
                if (this.maxTradeToHashGen == 0) this.maxTradeToHashGen = tradeToHashGen;
                if (this.minTradeToHashGen == 0) this.minTradeToHashGen = tradeToHashGen;
                
                if(tradeToHashGen > this.maxTradeToHashGen) this.maxTradeToHashGen = tradeToHashGen;                
                if(tradeToHashGen < this.minTradeToHashGen) this.minTradeToHashGen = tradeToHashGen;
                
            }
        },
        
        "StatEvent.HashRecordedEvent"(data) {
            //console.log(`Trade ${data.id} hash-saved at ${data.time}`);
            var tradeGenTime = data.id;
            if(tradeGenTime) {
                var tradeToHashSave = data.time - tradeGenTime;
                if (this.maxTradeToHashRec == 0) this.maxTradeToHashRec = tradeToHashSave;
                if (this.minTradeToHashRec == 0) this.minTradeToHashRec = tradeToHashSave;
                
                if(tradeToHashSave > this.maxTradeToHashRec) this.maxTradeToHashRec = tradeToHashSave;                
                if(tradeToHashSave < this.minTradeToHashRec) this.minTradeToHashRec = tradeToHashSave;
                
            }
		},
    }*/
});

broker.start().then(() => broker.repl());