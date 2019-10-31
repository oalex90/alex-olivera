'use strict';

const passport      = require('passport'); // for authenticating user (sign-in)
const bcrypt        = require('bcrypt'); //for encrypting user password

module.exports = function (app, db) {
  const DB_TABLE = db.collection("chatUsers");
  
  function ensureAuthenticated(req, res, next) { //middleware to verify user is logged in
    if(req.isAuthenticated()){
      return next();
    }
    console.log("User not logged in. Redirecting to login screen")
    res.redirect('/chatroom/login');
  };
  
  app.route('/chatroom/login')
    .get((req, res) => {
      res.sendFile(process.cwd() + '/views/chatroom-login.html');
    })
    .post(passport.authenticate('local', { failureRedirect: '/chatroom/login' }),(req, res) => {
      res.redirect('/chatroom'); //redirect to chatroom if successful. Stay at login screen if unsuccessful
    });

  app.route('/chatroom')
    .get(ensureAuthenticated, (req,res) => {
      console.log("req.user:", req.user);
      res.render(process.cwd() + '/views/chatroom.ejs', {user: req.user});
  });

  app.route('/chatroom/logout')
    .get((req, res) =>{
      req.logout();
      res.redirect('/chatroom/login');
  });

  app.route('/chatroom/register')
    .post((req, res, next) => {
        DB_TABLE.findOne({ username: req.body.username }, function (err, user) {
            if(err) {
                next(err);
            } else if (user) {
                console.log("user already exists");
                res.redirect('/chatroom/login');
            } else {
                console.log("creating user");
                DB_TABLE.insertOne(
                  {username: req.body.username,
                   password: bcrypt.hashSync(req.body.password, 12)},
                  (err, doc) => {
                      if(err) {
                          res.redirect('/chatroom/login');
                      } else {
                        user = {
                          _id: doc.ops._id,
                          name: doc.username
                        }
                        console.log("doc", doc.ops);
                        next(null, user);
                      }
                  }
                )
            }
        })},
      passport.authenticate('local', { failureRedirect: '/chatroom/login' }),
      (req, res, next) => {
          res.redirect('/chatroom');
      }
  );
  
}