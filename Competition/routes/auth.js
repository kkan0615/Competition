/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Auth router.
 * list of API:
 * Last Update: 10/29/2019
 * Version: 1.0
*****************************************************************************************************/
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Check game folder in uploads direct
 * Functions: mkdirSync - 비동기 동기 make directory.
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
fs.readdir('uploads/profile', (error) => {
    if (error) {
        console.error('Profile directory in uploads is not existed');
        fs.mkdirSync('uploads/profile');
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose:
 * Functions:
 * Last Update: 10/25/2019
 * Version: 1.0
*****************************************************************************************************/
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/profile'); // cb = call back
        },
        filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    })
})

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: POST
 * Middlewares: 후에 multer을 추가해 주세요.
 * Purpose: Create the User to Database
 * Last Update: 10/29/2019
 * Version: 1.0
*****************************************************************************************************/
router.post('/join', isNotLoggedIn, upload.single('img'), async(req, res, next) => {
    const { email, password, nickname, username } = req.body;
    try {
        const exUser = await User.findOne({ where: { username } });
        if(exUser) {
            req.flash('joinError', 'This username has been registered');
            return res.redirect('/auth/join');
        }
        const bash = await bcrypt.hash(password, 12);

        await User.create({
            username,
            email,
            nickname,
            password: bash,
            img: req.file.filename,
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