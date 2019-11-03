const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const RedisStore = require('connect-redis')(session); // Redis https://www.npmjs.com/package/redis-connection
const helmet = require('helmet');
const hpp = require('hpp');
const { sequelize } = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');
require('dotenv').config();

/* List of Router */
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const tagRouter = require('./routes/tag');
const chatRouter = require('./routes/chat');

/* WebSocket */
const WebSocket = require('./socket');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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
    /*
    **** Open this when you want to use redis ****
    store:new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
    }),
    */
});
if(process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
    sessionMiddleware.proxy = true;
} else {
    app.use(morgan('dev'));
}
app.set('port', process.env.PORT || 8001);
app.use(express.static(path.join(__dirname, 'public'))); // Most of css, js files will be in public directory.
app.use(sessionMiddleware);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // Set passport to session.

/* Set address */
app.use('/', indexRouter); // Index page router
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter); // Auth page router
app.use('/game', gameRouter); // Game page router
app.use('/tag', tagRouter); // Tag page router
app.use('/chat', chatRouter);

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'is wating you!');
});

WebSocket(server, app, sessionMiddleware)