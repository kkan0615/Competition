/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: index page router!
 * list of API:
 *              Express
 *              isNotLoggedIn
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');

const { isNotLoggedIn } = require('./middlewares');
const { Game } = require('../models');

const router = express.Router();

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: None
 * Purpose: index page
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/', async(req, res, next) => {
    try {
        const newGames = await Game.findAll({

        });

        const upcomingGames = await Game.findAll({
            order: [
                ['participateDate', 'DESC']
            ]
        });

        return res.render('index', {
            title: 'Hello World',
            user: req.user,
            indexError: req.flash('indexError'),
            newGames,
            upcomingGames,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isNotLoggedIn
 * Purpose: Sever Side rendering login
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/login', isNotLoggedIn, (req, res, next) => {
    return res.render('auth/login', {
        title: 'login',
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isNotLoggedIn.
 * Purpose: Sever Side rendering join
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/join', isNotLoggedIn, (req, res, next) => {
    return res.render('auth/join', {
        title: 'Join to us!',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

/* Export Router */
module.exports = router;