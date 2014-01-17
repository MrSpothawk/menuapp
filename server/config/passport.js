var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;



exports.passport.serializeUser(function(user, done) {
  done(null, user.id);
});

exports.passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

exports.passport.use(new exports.facebookStrategy({
 clientID: config.ids.facebook.clientID,
 clientSecret: config.ids.facebook.clientSecret,
 callbackURL: config.ids.facebook.callbackURL
},
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);