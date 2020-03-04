var express = require('express');
var app = express();
var path = require('path');
var config = require('./config/config.js');
var io = require('socket.io').listen(app.listen(config.port));

app.get('/', function(req, res){
    app.use(express.static(path.join(__dirname,'../../Client/home')));
    res.sendFile(path.join(__dirname, '../../Client/home','home.html'));
});

const connections = [null, null];

io.on('connection', function (socket) {

    // Find an available player number
    let playerIndex = -1;
    for (let i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
            break;
        }
    }
    // Ignore more than 2 players
    if (playerIndex === -1) return;

    // Tell the connecting client what player number they are
    const playerNum = parseInt(playerIndex.toString()) +1;
    socket.emit('player-number', playerNum);

    // Tell everyone else what player number just connected
    socket.broadcast.emit('player-connect', playerNum);
    connections[playerIndex] = socket;

    socket.on('move', function (data, playerNum) {

        // set playerNum to the player, generating the resulting number.
        playerNum = playerNum === 1 ? 2: 1;

        let num = data.num;
        let addedNum = 0;

        if(num%3 === 0) {
            num = num/3;
        } else if((num+1)%3 === 0) {
            addedNum = 1;
            num = (num+1)/3;
        } else {
            addedNum = -1;
            num = (num-1)/3;
        }

        if(num === 1) {
            io.emit('winner', 'player ' + playerNum + ' is the winner!!!');
        } else {
            const move = { addedNum, num };
            // Emit the move to all other players
            socket.broadcast.emit('move', move, playerNum);
        }
    });

    socket.on('disconnect', function() {
        console.log(`Player ${playerNum} Disconnected`);
        connections[playerIndex] = null;
    });


});

console.log('Server listening on port ' + config.port);
module.exports = app;

