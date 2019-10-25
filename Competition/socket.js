/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Socket Manager javascript file
 * list of API:
 * Last Update: 10/21/2019
 * Version: 1.0
*****************************************************************************************************/
const SocketIO = require('socket.io'); // npm i socket.io
const axios = require('axios'); // npm i axios

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Check tag folder in uploads directory
 * Functions: Create Soket io
 * Last Update: 10/21/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io);
    const game = io.of('/game');
    const IndividualGame = io.of('/IndividualGame');

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    /**
     * Socket for Game
     */
    game.on('connection', (socket) => {
        console.log('Game namespace is connected');
        const req = socket.request;
        const { headers: { referer } } = req;
        //const gameId = referer.split('/')[referer.split('/'.length)];
        const gameId = referer.split('/')[4];
        //console.log(parseInt(gameId));

        socket.join(parseInt(gameId));

        //disconnet
        socket.on('disconnect', () => {
            console.log('Game namespace is disconnected');
            socket.leave(gameId);
        });
    });

    /**
     * Socket for IndividualGame
     */
    IndividualGame.on('connection', (socket) => {
        console.log('IndividualGame namespace is connected');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roundId = referer.split('/')[5];
        console.log("round Id:::" + roundId);

        socket.join(roundId);

        //disconnet
        socket.on('disconnect', () => {
            console.log('IndividualGame namespace is disconnected');
            socket.leave(roundId);
        });
    });
};
