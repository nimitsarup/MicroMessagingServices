const pullSocket = require(`zmq`).socket(`pull`);
pullSocket.bindSync(`tcp://127.0.0.1:3001`);

pullSocket.on(`message`, function (msg) {
    console.log(`Received: ${msg}`);
});