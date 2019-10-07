/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: game router.
 * list of API:
 *              Express
 *              isLoggedIn
 * Last Update: 10/05/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('./middlewares');
const { Game, Tag } = require('../models/index');

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
 * Last Update: 10/05/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/newGame', isLoggedIn, async(req, res, next) => {
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
 * Last Update: 10/05/2019
 * Version: 1.0
*****************************************************************************************************/
/* PLZ CHANGE TO ADD A TAGS IN TO GAME */
router.post('/newGame', isLoggedIn, async(req, res, next) => {
    try {
        //There is no img yet, try to add it later
        const { title, description, rule, option, optionTwo, max, timeToDate, participateDate } = req.body;

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
            managerId: req.user.id,
        });

        return res.redirect('/game/' + game.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isLoggedIn
 * Purpose: Create new Game
 * Last Update: 10/05/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id', isLoggedIn, async(req, res, next) => {
    try {
        const game = await Game.findOne({
            id: req.query.id
        });

        if(!game) {
            req.flash('listError', 'There is no this game');
            res.redirect('/game/');
        }

        return res.render('game/game', {
            title: game.title,
            user: req.user,
            listError: req.flash('listError'),
            game,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;