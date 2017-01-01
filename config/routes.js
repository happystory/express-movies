const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');

module.exports = function(app) {
    app.use((req, res, next) => {
        res.locals.user = req.session.user;
        next();
    });

    // Index
    app.get('/', Index.index);


    // User
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/logout', User.logout);
    app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);

    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin', User.signinRequired, User.adminRequired, Movie.list);
    app.get('/admin/new', User.signinRequired, User.adminRequired, Movie.new);
    app.post('/admin/new', User.signinRequired, User.adminRequired, Movie.save);
    app.get('/admin/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.delete('/admin/list', User.signinRequired, User.adminRequired, Movie.del);
};
