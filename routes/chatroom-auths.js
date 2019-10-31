const session       = require('express-session'); //for encrypting user login info
const ObjectID      = require('mongodb').ObjectID; //userId from db for serialization purposes
const LocalStrategy = require('passport-local'); //for authenticating user (sign-in)
const passport      = require('passport'); // for authenticating user (sign-in)
const bcrypt        = require('bcrypt'); //for encrypting user password

module.exports = function (app, db) {
  const DB_TABLE = db.collection("chatUsers");

  app.use(passport.initialize()); //sets up passport
  app.use(passport.session()); //sets up passport
  
  passport.use(new LocalStrategy(function(username, password, done) {
    DB_TABLE.findOne({ username: username }, function (err, user) {
      console.log('User '+ username +' attempted to log in.');
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
      return done(null, user);
      });
    }
      
  ));
    
  passport.serializeUser((user, done) => { //encrypts user info into a key
   done(null, user._id);
  });

  passport.deserializeUser((id, done) => { //decrypts key into user info
    DB_TABLE.findOne({_id: new ObjectID(id)}, function (err, doc) {
      done(null, doc);
    });
  });
}