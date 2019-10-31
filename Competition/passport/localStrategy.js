const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy ({
        usernameField: 'username',
        //usernameField: 'email', // async의 useranme-> email, where email로 변경
        passwordField: 'password',
    }, async (username, password, done) => {
        try {
            const exUser = await User.findOne({ where: { username } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: 'Email or Password is not correct '});
                }
            } else {
                done(null, false, { message: 'Email or Passowrd is not correct' });
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};