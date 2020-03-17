'use strict';

const sampleData = require('./sampleData');

var ObjectId = require('mongodb').ObjectId;
var uniqid = require("uniqid"); //used to generate unique _id field for notes

module.exports = function (app, db){ 

    const DB_TABLE_USER = db.collection("emoterUser")
    /*DB "emoterUser" collection structure:
            username: String - unique user identifier
            email: String - email of user (unique as well)
            password: String - encrypted password
            created_on - String(Date) user was created
            following - String[] usernames of users user is following
            folowers - String[] usernames of users following user
        */

    const DB_TABLE_EMOTE = db.collection("emoterEmote");
        /*DB "emoterEmote" collection structure:
            _id : emote id (auto generated)
            user: String - user the emote belongs to
            emote: String - emote text
            created_on - String(Date)
            likes - String[] user_id's that liked the emote
            replies - Array:
                        _id - String - reply id generated using uniqid
                        user_id - String - _id of user the reply belongs to
                        text - String - reply text
                        created_on - String(Date)
        */

    function ensureAuthenticated(req, res, next) {
        if (true) {return next();}
        //if (req.isAuthenticated() && req.user.hasOwnProperty("email")) {return next(); }
        res.redirect('/emoter/login');
   }

    app.get("/emoter", ensureAuthenticated, function(req,res){
        res.sendFile(process.cwd() + '/dist/emoter.html');
    });

    app.get("/emoter/login", (req, res)=>{
        res.sendFile(process.cwd() + '/dist/emoter-login.html');
    });

    app.get('/emoter/logout', function(req, res){
        req.logout();
        res.redirect('/emoter/login');
    });

    //app.route('/emoter/api')

    app.get("/emoter/data/sample", function(req,res){
        //TODO
    });

}