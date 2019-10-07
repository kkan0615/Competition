exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('Login is required');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isAdmin == true) {
        next();
    } else {
        res.status(404).send('Only admin is allowed to access');
    }
};
