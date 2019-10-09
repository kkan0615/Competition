const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { sequelize } = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');
require('dotenv').config();

/* List of Router */
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const tagRouter = require('./routes/tag');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
});
app.set('port', process.env.PORT || 8001);
app.use(express.static(path.join(__dirname, 'public'))); // Most of css, js files will be in public directory.
app.use(sessionMiddleware);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // Set passport to session.

app.use('/', indexRouter); // Index page router
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter); // Auth page router
app.use('/game', gameRouter); // Game page router
app.use('/tag', tagRouter); // Tag page router

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'is wating you!');
});