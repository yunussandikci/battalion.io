const fs = require('fs')
const http = require('http');
const GameManager = require('./manager/GameManager')

const PORT = process.env.PORT || 8181
const gameManager = new GameManager.GameManager();

const server = http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(fs.readFileSync('index.html'))
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', async function (socket) {
    gameManager.newPlayer(socket.id)

    socket.on("name", function (data) {
        gameManager.setPlayerName(socket.id, data);
    })

    socket.on('disconnect', function () {
        gameManager.removePlayer(socket.id);
    });

    socket.on('angle', function (data) {
        gameManager.setPlayerAngle(socket.id, data);
    })

    socket.on('shot', function () {
        gameManager.newShot(socket.id)
    })

    setInterval(function () {
        socket.emit("update", gameManager.getUpdateForSocket(socket.id));
    }, 1000 / 60);

});


setInterval(function () {
    gameManager.update()
}, 1000 / 60);


setInterval(function () {
    console.clear()
    console.log(`Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`)
}, 1000 );


server.listen(PORT);
console.log(`Server started on: ${PORT}`);