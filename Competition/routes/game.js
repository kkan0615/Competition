/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: game router.
 * list of API:
 *              Express
 * Last Update: 10/03/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();

const { } = require('./middlewares');
const { Game } = require('../models/index');

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

module.exports = router;