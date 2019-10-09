/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: game router.
 * list of API:
 *              Express
 *              multer - Upload files to specific directory
 *              fs - File System 내장모듈
 *              path
 *              isLoggedIn
 * Last Update: 10/08/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // File System
const path = require('path') //Path System

const { isLoggedIn } = require('./middlewares');
const { Game, Tag } = require('../models/index');

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
})

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
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
/* PLZ CHANGE TO ADD A TAGS IN TO GAME */
router.post('/newGame', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const { title, description, rule, option, optionTwo, max, timeToDate, participateDate, tag } = req.body;

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

        const exTag = await Tag.findOne({
            where: { id: tag }
        });

        if(!exTag) {
            req.flash('newGameError', 'Sorry, there is no matched tag. \n Would like to create tag?');
            return res.redirect('/game/newGame');
        }
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
 * Middlewares: isLoggedIn
 * Purpose: Create new Game
 * Last Update: 10/08/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/:id', isLoggedIn, async(req, res, next) => {
    try {
        //Find detail of game.
        const game = await Game.findOne({
            where: { id: req.params.id }
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