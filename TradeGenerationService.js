const { broker } = require('./ServiceBrokerDefinition');
const socket = require(`zmq`).socket(`push`);
var NanoTimer = require('nanotimer');

broker.createService({
    name: "TradeGenerationService",

    actions: {
        reportStats(ctx){
            var elapsedTime = Date.now() - this.start;
            return { NumOfTradesGenerated: this.numTrades, ElapsedTimeMSecs: elapsedTime };
        }
    },

    started() {
        var _this = this;
        let lowResTimer = new NanoTimer();
        _this.numTrades = 0;
        _this.start = Date.now();
        socket.bindSync(`tcp://127.0.0.1:3000`);

        lowResTimer.setInterval(function () 
        {	
            _this.numTrades++;

            //broker.emit("StatEvent.TradeGeneratedEvent", { NumOfTradesGenerated: counter, ElapsedTime: elapsedTime }, ["StatsGatheringService"]);
            socket.send(Date.now() + " Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'");           
        }, '', '10u');
    }

});

broker.start().then(() => broker.repl());