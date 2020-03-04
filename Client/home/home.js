var socket = io();

socket.on('player-number', function(playerNum) {
    $('#players').append('<li style="text-align:center; background: #eee"> you joined the game as player number ' + playerNum + '.</li>');

    // both the players are ready.
    if (playerNum === 2) {

        // generate a random number, range {1...1000}.
        const num = Math.floor((Math.random() * 1000) + 1);
        const addedNum = 0;
        const move = { addedNum, num };
        $('#moves').append('<li style="text-align: center; background: #eee"><b style="color: green"> player ' + 1 + ' generated' + num + '.</b></li>');
        socket.emit('move', move, 1);
    }
});

socket.on('player-connect', function(playerNum) {
    $('#players').append('<li style="text-align:center; background: #eee"> player ' + playerNum + ' connected.</li>');
});

socket.on('move', function(move, playerNum) {
    var color = (playerNum === 1) ? 'green' : 'blue';
    $('#moves').append('<li style="text-align: center; background: #eee;"><b style="color:' + color + '">added num: ' + move.addedNum + '<br />player ' + playerNum + ' generated' + move.num + '.</b></li>');
    socket.emit('move', move, playerNum);
});

socket.on('winner', function(msg) {
    $('#moves').append('<li style="text-align:center; background: lightcoral; margin-top: 10px;">' + msg + '</li>');
});