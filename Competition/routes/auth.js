/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Purpose: Auth router.
 * list of API:
 * startedAt: 10/02/2019
 * Last Update: 11/09/2019
 * Version: 1.1
*****************************************************************************************************/
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mailer = require('nodemailer'); // mail system
const jwt = require('jsonwebtoken'); // json web token

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

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isNotLoggedIn,
 * Purpose: Logout
 * Last Update: 11/09/2019
 * Version: 1.1
*****************************************************************************************************/
router.get('/findPassword', isNotLoggedIn, (req, res, next) => {
    return res.render('auth/findPassword', {
        title: 'Find the password',
        user: req.user,
        passError: req.flash('passError'),
    });
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: post
 * Middlewares: isNotLoggedIn,
 * Purpose: findPassword
 * Last Update: 11/09/2019
 * Version: 1.1
*****************************************************************************************************/
router.post('/findPassword', isNotLoggedIn, async(req, res, next) => {
    try {
        //Data from body
        const { email } = req.body;

        //exUser
        const user = await User.findOne({
            where: { email }
        });

        // There is no user
        if(!user) {
            /*
            return res.status(406).json({
                error: 1,
                message: 'User is not existed',
            });
            */
           req.flash('passError', 'user is not existed');
           return res.redirect('/auth/findPassword');
        }

        const token = jwt.sign({
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '5m',
            issuer: 'Competiton site',
        });

        //https://myaccount.google.com/lesssecureapps
        const transpoter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmailId,
                pass: process.env.gmailPass,
            }
        });

        const option = {
            from: process.env.gmailId,
            to: user.email,
            subject: 'Test email from competiton',
            html: '<p>링크를 클릭해주세요</p>' +
            "<a href='http://127.0.0.1:8001/auth/changePassword?token=" + token + "'>링크</a>"
        }

        console.log(transpoter);

        transpoter.sendMail(option, (error, info) => {
            if(error) {
                console.error(error);
                req.flash('passError', 'Fail to send, please try again');
            } else {
                console.log('Email send: ' + info.response);
                req.flash('passError', 'Email is successful to send');
            }
        });
        /*
        return res.json({
            error: 0,
            message: 'Email is successful to send',
        });
        */
        return res.redirect('/auth/findPassword');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isNotLoggedIn,
 * Purpose: change password
 * Last Update: 11/09/2019
 * Version: 1.1
*****************************************************************************************************/
router.get('/changePassword', isNotLoggedIn, (req, res, next) => {
    //decode token
    const token = jwt.verify(req.query.token, process.env.JWT_SECRET);

    if(!token) {
        res.redirect('/');
    }

    return res.render('auth/changePassword', {
        title: 'Change the password',
        user: req.user,
        passError: req.flash('passError'),
        email: token.email,
        token: req.query.token,
    });
});

/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * RESTful API: get
 * Middlewares: isNotLoggedIn,
 * Purpose: change password
 * Last Update: 11/09/2019
 * Version: 1.1
*****************************************************************************************************/
router.post('/changePassword', isNotLoggedIn, async(req, res, next) => {
    try {
        // data from body
        const { password } = req.body;
        // token
        const token = jwt.verify(req.body.token, process.env.JWT_SECRET);

        //bcrypt for password
        const bash = await bcrypt.hash(password, 12);

        await User.update({
            isValidate: true,
            password: bash,
        }, {
            where: { email: token.email }
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;