/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Tag router.
 * list of API:
 *              Express
 *              isLoggedIn
 *              isAdmin
 *              fs - File System 내장모듈
 *              path - path system
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // File System
const path = require('path') //Path System

const { isAdmin } = require('./middlewares');
const { Game, Tag } = require('../models/index');

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Check tag folder in uploads directory
 * Functions: mkdirSync - 비동기 동기 make directory.
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
fs.readdir('uploads/tag', (error) => {
    if (error) {
        console.error('tag directory in uploads is not existed');
        fs.mkdirSync('uploads/tag');
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
            cb(null, 'uploads/tag'); // cb = call back
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
 * Last Update: 10/0/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/', async(req, res, next) => {
    try {
        const tags = await Tag.findAll({

        });

        return res.render('tag/index', {
            title: 'GAME LIST',
            user: req.user,
            listError: req.flash('listError'),
            tags,
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
 * Purpose: Sever Side rendering list of tags
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/', async(req, res, next) => {
    try {
        const tags = await Tag.findAll({

        });

        return res.render('tag/index', {
            title: 'TAG LIST',
            user: req.user,
            listError: req.flash('listError'),
            tags,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: GET
 * Middlewares: isAdmin
 * Purpose: Sever Side rendering Create tag
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/newTag', isAdmin, upload.single('img'), async(req, res, next) => {
    try {
        return res.render('tag/newTag', {
            title: 'TAG LIST',
            user: req.user,
            tagError: req.flash('tagError'),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isAdmin
 * Purpose: Sever Side rendering Create tag
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/newTag', isAdmin, upload.single('img'), async(req, res, next) => {
    try {
        const { title } = req.body;

        if(!title) {
            req.flash('tagError', 'There is no title');
            console.error("heelo");

            return res.redirect('/tag/newTag');
        }

        const tag = await Tag.create({
            title,
            img: req.file.filename,
        });

        return res.redirect('/tag/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isAdmin
 * Purpose: Sever Side searching tag games
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/search/:title', upload.single('img'), async(req, res, next) => {
    try {
        //parmes tag
        const tagTitle = req.params.title;

        //Find tag
        const tag = await Tag.findOne({
            where: { title: tagTitle }
        });

        //Find all gaems with tags.
        const games = await Game.findAll({
            include: [{
                model: Tag,
                where: { title: tagTitle }
            }]
        });

        return res.render('tag/gameList', {
            title: tagTitle + ' list',
            user: req.user,
            games,
            tag
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;