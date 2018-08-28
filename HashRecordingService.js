const { broker } = require('./ServiceBrokerDefinition');
const DbService = require("moleculer-db");
const pullSocket = require(`zmq`).socket(`pull`);
var MicrosecondsTimer = require('microseconds');
const config_data = require('./ConfigData');

broker.createService({
    name: "HashRecordingService",

    actions: {
        reportStats(ctx){
            return { NumberOfTradesProcessed: this.numTrades, MinTradeToHashRecord : this.minDuration, MaxTradeToHashRecord: this.maxDuration, Node: broker.nodeID.trim() };
        }
    },
    
    mixins: [DbService],
    settings: {
        fields: ["_id", "hash"]
    },

    started() {
        var _this = this;
        _this.minDuration = 0;
        _this.maxDuration = 0;
        _this.numTrades = 0;
        
        pullSocket.connect(config_data.ZeroMqIpPort);

        pullSocket.on(`message`, function (msg) {
            _this.numTrades++;
            var parts = msg.toString().split('-');
            broker.call("HashRecordingService.create", { _id: parts[0], hash: parts[1] })
            .then(() => {                    
                    var timeTaken = MicrosecondsTimer.now() - parts[0];
                    if (_this.maxDuration == 0) _this.maxDuration = timeTaken;
                    if (_this.minDuration == 0) _this.minDuration = timeTaken;
                    
                    if(timeTaken < _this.minDuration) _this.minDuration = timeTaken;
                    if(timeTaken > _this.maxDuration) _this.maxDuration = timeTaken;

                    // Avoid outliers (spikes)
                    if(_this.maxDuration > (10 * _this.minDuration)) _this.maxDuration = 0;
                });
        });
    }
});

broker.start().then(() => broker.repl());