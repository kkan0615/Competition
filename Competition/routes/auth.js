const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: 후에 multer을 추가해 주세요.
 * Purpose: Create the User to Database
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/join', isNotLoggedIn, async(req, res, next) => {
    const { email, password, img, nickname } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if(exUser) {
            req.flash('joinError', 'This email has been registered');
            return res.redirect('/join/userJoin');
        }
        const bash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            nickname,
            password: bash,
            img: null,
        });

        return res.redirect('/');
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: isNotLoggedIn,
 * Purpose: Login
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if(!user) {
            req.flash('loginError', info.message);
            return res.redirect('/login');
        }

        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/login');
        });



    }) (req, res, next);
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isLoggedIn,
 * Purpose: Logout
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;