const { broker } = require('./ServiceBrokerDefinition');
const socket = require(`zmq`).socket(`push`);

broker.createService({
    name: "TradeGenerationService",

    started() {
        socket.bindSync(`tcp://127.0.0.1:3000`);
        var counter = 0;
        setInterval(function () {	
            console.log(`Sending ${counter}`);
            socket.send(`${counter++}` + " Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'");  
        }, 1000);
    }
});

broker.start().then(() => broker.repl());
