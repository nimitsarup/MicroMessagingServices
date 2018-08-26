const { broker } = require('./ServiceBrokerDefinition');
const socket = require(`zmq`).socket(`push`);
var NanoTimer = require('nanotimer');
var MicrosecondsTimer = require('microseconds');


broker.createService({
    name: "TradeGenerationService",

    actions: {
        reportStats(ctx){
            var elapsedTime = MicrosecondsTimer.now() - this.start;
            return { NumOfTradesGenerated: this.numTrades, ElapsedTimeMicroSecs: elapsedTime };
        }
    },

    started() {
        var _this = this;
        let lowResTimer = new NanoTimer();
        _this.numTrades = 0;
        _this.start = MicrosecondsTimer.now();
        socket.bindSync(`tcp://127.0.0.1:3000`);

        // Generate a trade
        lowResTimer.setInterval(function () 
        {	
            _this.numTrades++;

            var timeNow = MicrosecondsTimer.now();
            //broker.emit("StatEvent.TradeGeneratedEvent", { NumOfTradesGenerated: counter, ElapsedTime: elapsedTime }, ["StatsGatheringService"]);
            socket.send( timeNow + "- Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'");          
            
            //console.log("Sending -> " + timeNow);
            
        }, '', '1m');
    }

});

broker.start().then(() => broker.repl());