/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Chat router.
 * list of API:
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();
const { Game, Chat, User, Participant, IndividualGame, IndividualRound } = require('../models');
const { isLoggedIn } = require('./middlewares');

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isLoggedIn
 * Purpose: Game chat 받고 보내기
 * Last Update: 10/18/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/game/:id', isLoggedIn, async(req, res, next) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findOne({
            include: {
                model: User,
                as: 'manager'
            }
        });

        if(req.user.id != game.managerId) {
            const participant = await Participant.findOne({
                where: { userId: req.user.id }
            });

            if(!participant) {
                req.flash('chat error', 'You are not logged in');
                return res.redirect('/game/'+gameId);
            }
        }
        console.log(game);

        const chat = await Chat.create({
            userId: req.user.id,
            gameId,
            content: req.body.chat,
        }, {
            include:[{
                model: User,
            }]
        })
        req.app.get('io').of('/game').to(gameId).emit('chat', chat);
        return res.send();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * 나중에 만들 Tournament round chat!
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isLoggedIn
 * Purpose: Chat of Tournament
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/

router.post('/game/:gameId/:round/:number', isLoggedIn, async(req, res, next) => {
    try {
        const { gameId, round, number } = req.params;

        const game = await Game.findOne({
            include: {
                model: User,
                as: 'manager'
            },
            where: { id: gameId }
        });

        if(req.user.id != game.managerId) {
            const participant = await Participant.findOne({
                where: { userId: req.user.id }
            });

            if(!participant) {
                req.flash('chat error', 'You are not logged in');
                return res.redirect('/game/'+gameId);
            }
        }

        const individualGame = await IndividualGame.findOne({
            where: { individualRoundId: round }
        })

        const chat = await Chat.create({
            userId: req.user.id,
            individualRoundId: round,
            individualGameId: number,
            gameId,
            content: req.body.chat,
        }, {
            include:[{
                model: User,
            }]
        });

        console.log(chat);

        req.app.get('io').of('/IndividualGame').to(individualGame.id).emit('chat', chat);
        return res.send();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;