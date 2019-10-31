/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: game router.
 * Router keyword : /game
 * list of API:
 *              Express
 *              multer - Upload files to specific directory
 *              fs - File System 내장모듈
 *              path
 *              isLoggedIn
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // File System
const path = require('path') //Path System

//From project
const { isLoggedIn } = require('./middlewares');
const { Game, Tag, Participant, User, Chat, IndividualRound, IndividualGame, News } = require('../models/index');

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Check game folder in uploads direct
 * Functions: mkdirSync - 비동기 동기 make directory.
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
fs.readdir('uploads/game', (error) => {
    if (error) {
        console.error('Game directory in uploads is not existed');
        fs.mkdirSync('uploads/game');
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose:
 * Functions:
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/game'); // cb = call back
        },
        filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    })
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares:
 * Purpose: Sever Side rendering list of games
 * Last Update: 10/04/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/', async(req, res, next) => {
    try {
        const games = await Game.findAll({

        });

        return res.render('game/index', {
            title: 'GAME LIST',
            user: req.user,
            listError: req.flash('listError'),
            games,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isLoggedIn
 * Purpose: Sever Side rendering create new game
 * Last Update: 10/08/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/newGame', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const tags = await Tag.findAll({});

        return res.render('game/newGame', {
            title: 'New Game',
            user: req.user,
            newGameError: req.flash('newGameError'),
            tags,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isLoggedIn
 * Purpose: Create new Game
 * Last Update: 10/12/2019
 * Version: 1.0
*****************************************************************************************************/
/* PLZ CHANGE TO ADD A TAGS IN TO GAME */
router.post('/newGame', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const { title, description, rule, option, optionTwo, max, timeToDate, participateDate, tag } = req.body;

        //Check time.
        if(new Date(timeToDate) < new Date(participateDate)) {
            req.flash('newGameError', 'Participate Date should be earlier than Date');
            return res.redirect('/game/newGame');;
        }
        //Create new game
        const game = await Game.create({
            title,
            img: null,
            description,
            rule,
            option,
            optionTwo,
            max,
            timeToDate,
            participateDate,
            img: req.file.filename  ,
            managerId: req.user.id,
        });

        //Check tag
        const exTag = await Tag.findOne({
            where: { id: tag }
        });
        //There is no tag.
        if(!exTag) {
            req.flash('newGameError', 'Sorry, there is no matched tag. \n Would like to create tag?');
            return res.redirect('/game/newGame');
        }
        //Add tag to game
        game.addTags(exTag);

        return res.redirect('/game/' + game.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares:
 * Purpose: Create new Game
 * Last Update: 10/09/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id', async(req, res, next) => {
    try {
        //Find detail of game.
        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager',
            }],
            where: { id: req.params.id }
        });

        if(!game) {
            req.flash('listError', 'There is no this game');
            res.redirect('/game/');
        }

        const chats = await Chat.findAll({
            include: [{
                model: User,
            }],
            where: { gameId: game.id }
        });

        const news = await News.findAll({
            where: { gameId: game.id }
        });

        return res.render('game/game', {
            title: game.title,
            user: req.user,
            listError: req.flash('listError'),
            game,
            chats,
            news,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares:
 * Purpose: List of Participations
 * Last Update: 10/09/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id/pList', async(req, res, next) => {
    try {
        //Find detail of game.
        const game = await Game.findOne({
            include: [{
                model: Participant,
                include: {
                    model: User,
                }
            }],
            where: { id: req.params.id }
        });

        if(!game) {
            req.flash('listError', 'There is no this game');
            res.redirect('/game/');
        }

        return res.render('game/pList', {
            title: game.title,
            user: req.user,
            plistError: req.flash('plistError'),
            game,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isLoggedIn
 * Purpose: Submit particiaption to game
 * Last Update: 10/09/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id/participate', isLoggedIn, async(req, res, next) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager'
            }],
            where: { id: gameId }
        });

        return res.render('game/participate', {
            title: 'Participate ' + game.title,
            user: req.user,
            partiError: req.flash('partiError'),
            game,
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isLoggedIn
 * Purpose: 참가자 Post로 받기
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/:id/participate', isLoggedIn, async(req, res, next) => {
    try {
        //Game Id from parameter
        const gameId = req.params.id;
        //Body properties
        const { option, optionTwo } = req.body;
        //Create new Participant

        const game = await Game.findOne({
            include: [{
                model: Participant,
            }],
            where: { id: gameId }
        });

        //Time is over!
        if(new Date(game.participateDate) < new Date()) {
            req.flash('partiError', 'Time is over!');
            return res.redirect('/game/'+gameId+'/participate');
        }

        if(parseInt(game.max) < game.participants.length + 1) {
            req.flash('partiError', 'Already max!');
            return res.redirect('/game/'+gameId+'/participate');
        }

        const player = await Participant.create({
            point: 0,
            gameId,
            userId: req.user.id,
            option,
            optionTwo,
        });

        return res.redirect('/game/' + gameId);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isLoggedIn
 * Purpose: 참가자 POST 거부
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/:id/participate/delete', isLoggedIn, async(req, res, next) => {
    try {
        //Game Id from parameter
        const gameId = req.params.id;
        //Body properties
        const { userId } = req.body;
        //Create new Participant

        const game = await Game.findOne({
            where: { id: gameId }
        });

        if(game.managerId != req.user.id){
            req.flash('plistError', 'Only Manager is allowed to delete');
            return res.redirect('/game/'+gameId+'/pList');
        }

        const player = await Participant.destroy({
            where: { id: userId }
        });

        return res.json({result: 'good' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isLoggedIn
 * Purpose: Tounament table
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id/tournamentList', async(req, res, next) => {
    try {
        const gameId = req.params.id;

        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager'
            }],
            where: { id: gameId }
        });

        const list = await IndividualRound.findAll({
            include: [{
                model: IndividualGame,
                include: [{
                    model: Participant,
                    as: 'firstPlayer',
                    include: {
                        model: User,
                    }
                }, {
                    model: Participant,
                    as: 'secondPlayer',
                    include: {
                        model: User,
                    }
                }],
                order: [
                ]
            }],
            where: { gameId },
            order: [
            ]
        });

        return res.render('game/tournament-list', {
            title: 'tournamentList',
            game,
            list,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isLoggedIn
 * Purpose: Start game when manager pressed
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id/start', isLoggedIn, async(req, res, next) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager',
            }],
            where: { id: gameId }
        });

        /*
         // 시간에 따른 시작 추가하기 여기다가
         */

        const players = await Participant.findAll({
            where: { gameId }
        });

        const round = await IndividualRound.create({
            number: 1,
            gameId,
        });
        let number = 1;
        for (let i = 0; i < players.length; i+= 2) {
            const first = players[i];
            const second = players[i+1];
            if( first && second ) {
                await IndividualGame.create({
                    individualRoundId: round.id,
                    number: number,
                    firstPlayerId: first.id,
                    firstPoint: 0,
                    secondPlayerId: second.id,
                    secondPoint: 0,
                });
            } else {
                await IndividualGame.create({
                    individualRoundId: round.id,
                    number: number,
                    firstPlayerId: first.id,
                    firstPoint: 0,
                    secondPlayerId: null,
                    secondPoint: 0,
                });
            }
            number++;
        }
        /*
        players.forEach(async(player) => {
            const games = await IndividualGame.findAll({
                where: { individualRoundId: round.id }
            });

            if(!games || games.length === 0) {
                await IndividualGame.create({
                    individualRoundId: round.id,
                    number: 1,
                    firstPlayerId: player.id,
                    firstPoint: 0,
                    secondPlayerId: null,
                    secondPoint: 0,
                });
            } else if(!games[games.length].secondPlayerId) {
                await IndividualGame.update({
                    secondPlayerId: player.id,
                }, {
                    where: { id: games[games.length].id }
                });
            } else {
                await IndividualGame.create({
                    number: games[games.length].number,
                    individualRoundId: round.id,
                    firstPlayerId: player.id,
                    firstPoint: 0,
                    secondPlayerId: null,
                    secondPoint: 0,
                });
            }
        });
        */
        const list = await IndividualGame.findAll({
            where: { individualRoundId: round.id }
        });
        console.log('********************************************************************************************');
        console.log(list);

        await News.create({
            content: 'Game is started! please check at tournament list',
            gameId,
        });

        return res.redirect('/game/'+gameId+'/tournamentList')
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isLoggedIn
 * Purpose: Tournament detail
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id/:round/:number', isLoggedIn, async(req, res, next) => {
    try {
        // Parameter variables
        const { id, round, number } = req.params;
        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager',
            }],
            where: { id }
        });

        // Individual Game detail
        const detail = await IndividualRound.findOne({
            include: [{
                model: IndividualGame,
                include: [{
                    model: Participant,
                    as: 'firstPlayer',
                    include: {
                        model: User,
                    }
                }, {
                    model: Participant,
                    as: 'secondPlayer',
                    include: {
                        model: User,
                    }
                }],
                order: [
                    ['number', 'DESC']
                ],
                where: { number }
            }],
            where: { number: round, gameId: game.id },
            order: [
                ['number', 'DESC']
            ]
        });

        // Chating history
        const chats = await Chat.findAll({
            include: [{
                model: User,
            }],
            where: { gameId: game.id, individualRoundId: round, individualGameId: number }
        });

        return res.render('game/tournament-detail', {
            title: 'tournament',
            game,
            detail,
            chats,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: post
 * Middlewares: isLoggedIn
 * Purpose: Tournament 승자 가리기
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/:id/:round/:number', isLoggedIn, async(req, res, next) => {
    try {
        // Parameter variables.
        const { id, round, number } = req.params;
        // Data from body.
        const { winnerId, firstPlayerPoint, secondPlayerPoint } = req.body;
        //Game find
        const game = await Game.findOne({
            include: [{
                model: User,
                as: 'manager',
            }],
            where: { id }
        });

        const exIndividualRound = await IndividualRound.findOne({
            where: { gameId: game.id, number: round }
        });

        //Update result of this game
        await IndividualGame.update({
            firstPoint : firstPlayerPoint,
            secondPlayerPoint: secondPlayerPoint,
        }, {
            where: { individualRoundId: exIndividualRound.id, number }
        });

        let newNum; // New Number for individualGame
        if (parseInt(number) % 2 == 1) {
            //odd 홀수
            newNum = parseInt(number) / 2 + 1;
        } else {
            //even 짝수
            newNum = parseInt(number) / 2;
        }
        console.log('******************************************************************************************');

        console.log('number: ' + parseInt(number) + ' newNum: ' + newNum);

        //Check ex individual game
        const exIndividualGame = await IndividualGame.findOne({
            where: { individualRoundId: parseInt(round) + 1, number: parseInt(newNum) }
        });

        console.log(exIndividualGame);

        if(!exIndividualGame) {
            // Game이 존재하지 않는다.
            const newIndividualRound = await IndividualRound.create({
                number: parseInt(round) + 1,
                gameId: game.id,
            });

            //Create new individualGame
            await IndividualGame.create({
                number: parseInt(newNum),
                firstPlayerId: req.user.id,
                firstPoint: 0,
                secondPoint: 0,
                secondPlayerId: null,
                individualRoundId: newIndividualRound.id,
            });
        } else {
            // Game이 존재할때
            //Update ex individualGame
            await IndividualGame.update({
                secondPlayerId: req.user.id,
            }, {
                where: { individualRoundId: parseInt(round) + 1, newNum: parseInt(newNum) }
            });
        }

        return res.redirect('/game/'+game.id + '/tournamentList');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;