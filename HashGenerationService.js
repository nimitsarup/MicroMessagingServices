const crypto = require('crypto');
// ACQUIRE AND CONNECT TO SOCKET
const pullSocket = require(`zmq`).socket(`pull`);
pullSocket.connect(`tcp://127.0.0.1:3000`);

const pushSocket = require(`zmq`).socket(`push`);
pushSocket.connect(`tcp://127.0.0.1:3001`);

pullSocket.on(`message`, function (msg) {
    const timestamp = Date.now().toString();
    console.log(timestamp + ` - Received: ${msg}`);

    var seqNumCheck = msg.toString().split(' ')[0];
    
    var sha256 = crypto.createHash('sha256').update(msg).digest("hex");
    pushSocket.send(seqNumCheck + "-" + sha256);
});