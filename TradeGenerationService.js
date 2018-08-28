const { broker } = require('./ServiceBrokerDefinition');
const pushSocket = require(`zmq`).socket(`push`);
var NanoTimer = require('nanotimer');
var MicrosecondsTimer = require('microseconds');
const crypto = require('crypto');
const config_data = require('./ConfigData');

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
        pushSocket.bindSync(config_data.ZeroMqIpPort);

        // Generate a trade
        lowResTimer.setInterval(function () 
        {	
            _this.numTrades++;
            
            var timeNow = MicrosecondsTimer.now();
            var trade = "Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'";
            var sha256 = crypto.createHash('sha256').update(timeNow + "-" + trade).digest("hex");
            pushSocket.send( timeNow + "-" + sha256);          
                       
        }, '', config_data.TradeGenerationTime);
    }

});

broker.start().then(() => broker.repl());