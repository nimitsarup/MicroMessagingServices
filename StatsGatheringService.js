const { broker } = require('./ServiceBrokerDefinition');
const chalk = require('chalk');
const config_data = require('./ConfigData');

broker.createService({
    name: "StatsGatheringService",

    started() {
        setInterval(() => {
            try {
                broker.call("TradeGenerationService.reportStats").then((args) => console.log(chalk.red.bold("TradeGenerationService - " + JSON.stringify(args))));
                
                // Loop through all instances of the recording services and fetch stats
                const endpoints = broker.registry.getActionEndpoints("HashRecordingService.reportStats");
                for(var i=0; i < endpoints.count(); i++)
                {
                    broker.call("HashRecordingService.reportStats").then((args) => console.log(chalk.green("HashRecordingService - " + JSON.stringify(args))));
                }
            }
            catch(err) {
                console.log(err);
            }
            console.log("\n");
        }, config_data.StatsCollectionTimer);
    },
});

broker.start().then(() => broker.repl());