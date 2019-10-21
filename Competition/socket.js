/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Tag router.
 * list of API:
 * Last Update: 10/14/2019
 * Version: 1.0
*****************************************************************************************************/
const SocketIO = require('socket.io'); // npm i socket.io
const axios = require('axios'); // npm i axios

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Check tag folder in uploads directory
 * Functions: Create Soket io
 * Last Update: 10/14/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io);
    const game = io.of('/game');
    const individualRound = io.of('/individualRound');

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    game.on('connection', (socket) => {
        console.log('Game namespace is connected');
        const req = socket.request;
        const { headers: { referer } } = req;
        //const gameId = referer.split('/')[referer.split('/'.length)];
        const gameId = referer.split('/')[4];
        //console.log(parseInt(gameId));

        socket.join(parseInt(gameId));

        socket.on('disconnect', () => {
            console.log('Game namespace is disconnected');
            socket.leave(gameId);
        });
    });

    individualRound.on('connection', (socket) => {
        console.log('individualRound namespace is connected');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roundId = referer.split('/')[referer.split('/'.length) - 1];
        socket.join(roundId);

        socket.on('disconnect', () => {
            console.log('individualRound namespace is disconnected');
            socket.leave(roundId);
        });
    });
};
