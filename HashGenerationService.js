const { broker } = require('./ServiceBrokerDefinition');
const crypto = require('crypto');

broker.createService({
    name: "HashGenerationService",

    actions: {
        reportStats(ctx){
            return { NumberOfTradesProcessed: this.numTrades, MinTradeToHashGen : this.minDuration, MaxTradeToHashGen: this.minDuration, Node: broker.nodeID.trim() };
        }
    },

    started() {
        var _this = this;
        _this.minDuration = 0;
        _this.maxDuration = 0;
        _this.numTrades = 0;

        const pullSocket = require(`zmq`).socket(`pull`);
        pullSocket.connect(`tcp://127.0.0.1:3000`);

        const pushSocket = require(`zmq`).socket(`push`);
        pushSocket.connect(`tcp://127.0.0.1:3001`);

        pullSocket.on(`message`, function (msg) {
            var tradeGenTime = msg.toString().split(' ')[0];            
            var sha256 = crypto.createHash('sha256').update(msg).digest("hex");
            _this.numTrades++;

            //broker.emit("StatEvent.HashGeneratedEvent", { id: tradeGenTime, time: Date.now() }, ["StatsGatheringService"]);
            var timeTaken = Date.now() - tradeGenTime;
            if (_this.maxDuration == 0) _this.maxDuration = timeTaken;
            if (_this.minDuration == 0) _this.minDuration = timeTaken;
            
            if(timeTaken > _this.maxDuration) _this.maxDuration = timeTaken;                
            if(timeTaken < _this.minDuration) _this.minDuration = timeTaken;
            
            pushSocket.send(timeTaken + "-" + sha256);
        });
    }
});

broker.start().then(() => broker.repl());
