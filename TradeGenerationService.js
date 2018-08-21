// ACQUIRE AND BIND TO SOCKET
const socket = require(`zmq`).socket(`push`);
socket.bindSync(`tcp://127.0.0.1:3000`);

var counter = 0;

setInterval(function () {	
    socket.send(`${counter++}` + " Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'");  
}, 500);