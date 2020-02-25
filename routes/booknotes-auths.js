const passport      = require('passport'); // for authenticating user (sign-in)
const GitHubStrategy = require('passport-github2').Strategy;
const DummyStrategy = require('passport-dummy').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (app) {

    app.use(passport.initialize()); //sets up passport
    app.use(passport.session()); //sets up passport

    passport.serializeUser((user, done) => { //encrypts user info into a key
        done(null, user);
    });

    passport.deserializeUser((obj, done) => { //decrypts key into user info
        done(null, obj);
    });

    passport.use(new DummyStrategy(
        function(done) {
        return done(null, {email: 'guest', name: 'Guest'});
        }
    ));
   
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + '/booknotes/auth/github/callback',
      scope: 'user:email'
    },
      function(accessToken, refreshToken, profile, cb) { //cb = callback
          //console.log("email: ", profile);
          let email = profile.emails[0].value;
          let name = profile._json.name;
          return cb(null, {email, name});
      }
    ));
  
    passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + '/booknotes/auth/linkedin/callback',
      scope: ['r_liteprofile', 'r_emailaddress'],
      state: true
    },
    function(token, tokenSecret, profile, cb) {
      //console.log("name: ", profile.name.givenName);
      //console.log("email: ", profile.emails[0].value);
  
      let email = profile.emails[0].value;
      let name = profile.name.givenName;
      return cb(null, {email, name});
    }
    ));
  
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + '/booknotes/auth/google/callback',
    },
    function(accessToken, refreshToken, profile, cb) {
        //console.log("profile:", profile);
        //console.log("name: ", profile.name.givenName);
        //console.log("email: ", profile.emails[0].value);
    
        let email = profile.emails[0].value;
        let name = profile.name.givenName;
        return cb(null, {email, name});
    }
    ));
      
    app.get('/booknotes/auth/github',
    passport.authenticate('github'));
  
    app.get('/booknotes/auth/linkedin',
    passport.authenticate('linkedin'));
  
    app.get('/booknotes/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
    app.get("/booknotes/auth/guest",
      passport.authenticate('dummy', { 
        failureRedirect: '/booknotes/login',
        successRedirect: "/booknotes" 
    }));
  
    app.get('/booknotes/auth/github/callback', 
    passport.authenticate('github', { 
      failureRedirect: '/booknotes/login',
      successRedirect: "/booknotes" 
    }));
  
    app.get('/booknotes/auth/linkedin/callback', 
    passport.authenticate('linkedin', { 
      failureRedirect: '/booknotes/login',
      successRedirect: "/booknotes" 
    }));
  
    app.get('/booknotes/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/booknotes/login',
      successRedirect: "/booknotes" 
    }));

}