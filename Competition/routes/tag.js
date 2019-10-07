/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Tag router.
 * list of API:
 *              Express
 *              isLoggedIn
 *              isAdmin
 * Last Update: 10/06/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const router = express.Router();

const { isAdmin } = require('./middlewares');
const { Game, Tag } = require('../models/index');

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
router.get('/newTag', isAdmin, async(req, res, next) => {
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
router.post('/newTag', isAdmin, async(req, res, next) => {
    try {
        const { title } = req.body;
        if(!title) {
            req.flash('tagError', 'There is no title');
            return res.redirect('/newTag');
        }

        const tag = await Tag.create({
            title,
        });

        return res.redirect('/tag/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;