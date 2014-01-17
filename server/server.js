/**
 * Module dependencies.
 */

var neo4jDB = require('./neo4jDB'),
express = require("express"),
path = require("path"),
config = require('./config/configfile'),
routes = require('./config/routes.js'),
passportConfig = require('./config/passport'),
yummly = require('./middleware/callyummly.js'),
stylus = require('stylus'),
nib = require('nib');


var application_root = __dirname;

/**
 * Start the app.
 */

var app = express();
app.set('title', 'menuapp');
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.ids.facebook.secret }));
app.use(passportConfig.passport.initialize());
app.use(passportConfig.passport.session());
app.use(app.router);


// Installing nib
// function compile(str, path) {
//   return stylus(str)
//     .set('filename', path)
//     .set('compress', true)
//     .use(nib());
// }


app.use('/assets', express.static(__dirname + '/public/assets'));
app.use(stylus.middleware({
  src: __dirname + '/resources/',
  dest: __dirname + '/public/',
  debug: true,
  force: true,
}));


/**
 * Routes
 */

app.use('/', express.static( __dirname+ '/../app'));
app.use('/db', routes.dbcall );
app.use('/apisearch', routes.yumSearch );
app.use('/apiget', routes.yumGet );

/** 
 * FB auth routes 
 */

app.get('/login', function(req, res){
  res.send("log in here");
});

app.get('/auth/facebook',
  passportConfig.passport.authenticate('facebook'),
  function(req, res){
    console.log('hello');
});

app.get('/auth/facebook/callback',
passportConfig.passport.authenticate('facebook', {
  successRedirect: "/account",
  failureRedirect: '/login'
})
);

app.get('/account', ensureAuthenticated, function(req, res){
  res.send('hello world', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Start the app by listening on <port>
var port = config.port || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// //Initializing logger
// logger.init(app, passport, mongoose);

// //expose app
module.exports = app;
//testing something for auth
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
