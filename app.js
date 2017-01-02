const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// 不使用mpromise
mongoose.Promise = global.Promise;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';

app.locals.moment = require('moment');

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            } else if (stat.isDirectory()) {
                walk(newPath);
            }
        });
};
walk(models_path);

app.use(express.static(path.join(__dirname + '/public')));
// parse application/x-www-form-urlencoded 
// if extended is true, https://www.npmjs.com/package/qs#readme
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'imooc_movie', // session ID, the default value is 'connect.sid'
    secret: 'imooc', // This is the secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions' // Collection (default: sessions)
    })
}));
app.use(require('connect-multiparty')());

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
    // TODO 
    app.set('showStackError', true);
    app.use(logger('dev'));
    app.locals.pretty = true;
    // enable logging collection methods + arguments to the console
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port, function() {
    console.log('Imooc started on port ' + port);
});
