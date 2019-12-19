"use strict";

var bcrypt = require("bcrypt"); //used to encrypt delete password field
var ObjectId = require("mongodb").ObjectId; //used to find item in mongodb by _id
var uniqid = require("uniqid"); //used to generate unique _id field for replies

const SALT_ROUNDS = 10; //used by bcrypt to generate hash

module.exports = function(app, db) {
  const DB_TABLE = db.collection("board");
  /*DB "board" collection structure:
      _id : thread id (auto generated)
      board: String - board name
      text: String - thread text
      delete_password: - String (encrypted) - password to delete thread
      created_on - String(Date)
      bumped_on - String(Date) - DateTime when thread last modified
      reported - boolean
      replies - Array:
                  _id - String - reply id generated using uniqid
                  text - String - reply text
                  delete_password - String(encrypted) - password to delete reply
                  created_on - String(Date)
                  reported - boolean
  */

  //starting page for messageboard app
  app.route("/messageboard").get(function(request, response) {
    response.sendFile(process.cwd() + "/dist/messageboard.html");
  });

  //page for individual board
  app.route("/messageboard/:board/").get(function(req, res) {
    res.sendFile(process.cwd() + "/dist/messageboard-board.html");
  });

  //page for individual thread
  app.route("/messageboard/r/:threadid").get(function(req, res) {
    res.sendFile(process.cwd() + "/dist/messageboard-thread.html");
  });

  //thread route/endpoints
  app.route("/messageboard/api/threads/:board")

    //GET - get latest ten most recent threads for a given board and include the three most recent replies in order of last bumped/changed for each thread
    .get(function(req, res) {
      var board = req.params.board;
      //console.log("board:", board);

      DB_TABLE
        .find({ board: board })
        .sort({ bumped_on: -1 }) //sorted by bumped_on field from latest to oldest
        .limit(10) //only show ten most recent threads
        .toArray((err, results) => {
          //console.log("results", results);
          let out = results.map(d => {
            //console.log("d", d);
            d.replies.sort((a, b) => { //sort replies in order of last bumped/changed
              a = new Date(a.bumped_on);
              b = new Date(b.bumped_on);
              return a > b ? -1 : a < b ? 1 : 0; //oldest first, newest last
            });
            let replycount = d.replies.length;
            let replies;
            if (replycount > 3) { //limit replies to the three most recent bumped repleis
              replies = [
                d.replies[replycount - 1], //last
                d.replies[replycount - 2], //2nd from last
                d.replies[replycount - 3]  //3rd from last
              ];
            } else { //if 3 or less replies, include all replies from most recent to oldest
              replies = d.replies.reverse();
            }
            replies = replies.map(r =>{ //only return desired data fields for each reply
              return {
                _id: r._id,
                text: r.text,
                created_on: r.created_on,
                reported: r.reported
              }
            });
            return { //only returned desired fields for each thread
              _id: d._id,
              board: d.board,
              text: d.text,
              created_on: d.created_on,
              bumped_on: d.bumped_on,
              replycount: replycount,
              replies: replies,
              reported: d.reported
            };
          });
          res.json(out); //output array of threads
        });
    })

    //POST - create a thread from given board, text, and pass values; and return newThread fields
    .post(function(req, res) {
      var board = req.params.board; //get board from url path
      //console.log("board", board);
      var text = req.body.text; //get text and pass from form body
      var pass = req.body.delete_password;
      //console.log("req.body", req.body);

      let newThread = { //database fields for thread
        board: board,
        text: text,
        delete_password: bcrypt.hashSync(pass, SALT_ROUNDS), //encrypt delete_password before storing in database
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        replies: []
      };

      DB_TABLE.insertOne(newThread, (err, document) => {
        if (err) throw err;
        //console.log("document", document.ops[0]._id);
        res.json({ //return new thread values
          _id: document.ops[0]._id, //get _id from database response
          board: newThread.board,
          text: newThread.text,
          created_on: newThread.created_on,
          replies: newThread.replies,
          reported: newThread.reported,
          replycount: 0
        });
      });
    })

    //PUT - update the reported value on a given thread respond with message of if update was successful
    .put(function(req, res) {
      var _id = req.body.thread_id;
      //console.log("thread_id", _id);
      let criteria;
      try {
        criteria = { _id: ObjectId(_id) }; //convert _id to database compatible _id field
      } catch (e) {
        res.send("_id error"); //send error message if incorrect _id format
        return;
      }
      if (!criteria) return; //stop if error found
      let update = { $set: { reported: true } }; //set reported field on thread to true

      DB_TABLE.findOneAndUpdate(
        criteria,
        update,
        (err, result) => {
          //console.log("result:", result);
          if (err || result.lastErrorObject.n == 0) { //if error or no value was updated, send error message
            res.send("could not update " + _id);
            return;
          }
          res.send("Thread reported successfully"); //success message
        }
      );
    })

    //DELETE - delete a given thread from database
    .delete(function(req, res) {
      var _id = req.body.thread_id; //_id and pass taken from form body
      var pass = req.body.delete_password;

      let criteria;
      try {
        criteria = { _id: ObjectId(_id) }; //convert _id to database compatible _id field
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;
      //console.log("_id:", _id);
      //console.log("delete pass:", pass);

      DB_TABLE.findOne(criteria, (err, document) => {
        //console.log("document:", document);
        if (err || document == [] || document == null) { //if thread not found, rerturn failure message
          res.send("could not delete " + _id);
          return;
        }

        if (bcrypt.compareSync(pass, document.delete_password)) { //unencrypt delete_passward and compare with pass given, if match -> delete thread
          //remove from database
          //console.log("TRUE!");
          DB_TABLE.deleteOne(
            { _id: new ObjectId(_id) },
            (er, doc) => {
              //alert("Successfully deleted theread");
              res.send("Delete successful");
            }
          );
        } else {
          //console.log("FALSE!");
          //alert("Delete password is incorrect");
          res.send("Incorrect delete password");
        }
      });
    }); //

  //Reply route/endpoints
  app.route("/messageboard/api/replies/:thread_id")

    //GET - get thread and it's replies for a given thread_id, return thread data
    .get(function(req, res) {
      var thread_id = req.params.thread_id; //thread _id taken from url path
      //console.log("req.query:", req.query);
      //console.log("req.params:", req.params);
      //console.log("thread_id:", thread_id);

      let criteria;
      try {
        criteria = { _id: ObjectId(thread_id) };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      DB_TABLE.findOne(criteria, (err, result) => {
        //console.log("result", result);
        if (err || result == [] || result == null) {
          res.send("could not find " + thread_id);
          return;
        }
        let replies = result.replies.map(d => { //for each reply found only return specified values
          return {
            _id: d._id,
            text: d.text,
            created_on: d.created_on,
            reported: d.reported
          };
        });
        let out = { //return thread values; replies are ordered from newest to oldest
          _id: result._id,
          board: result.board,
          created_on: result.created_on,
          text: result.text,
          reported: result.reported,
          replies: replies.reverse()
        };
        //console.log("replies out:", out);
        res.json(out);
      });
    })

    //POST - create reply in a given thread; return reply data
    .post(function(req, res) {
      var thread_id = req.params.thread_id;
      //console.log("thread_id:", thread_id);
      var text = req.body.text;
      var pass = req.body.delete_password;
      //console.log("req.body", req.body);

      let newReply = {
        _id: uniqid(), //create a unique id value for each reply
        text: text,
        delete_password: bcrypt.hashSync(pass, SALT_ROUNDS), //encrypt delete_password
        created_on: new Date(),
        reported: false
      };
      let criteria;
      try {
        criteria = { _id: ObjectId(thread_id) };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      let modify = {
        $push: { replies: newReply }, //add new reply to end of replies array
        $set: { bumped_on: new Date() } //update thread bumped_on value to current DateTime
      };

      DB_TABLE.findOneAndUpdate(
        criteria,
        modify,
        (err, document) => {
          if (err || document.lastErrorObject.n == 0) {
            res.send("could not find " + thread_id);
            return;
          }
          //console.log("document", document);
          res.json({ //return specified values for newly created reply
            _id: newReply._id,
            text: newReply.text,
            created_on: newReply.created_on,
            reported: newReply.reported
          });
        }
      );
    })

    //PUT - update reported field on a given reply; return message on whether successful or not
    .put(function(req, res) {
      var reply_id = req.body.reply_id;
      var thread_id = req.params.thread_id;

      let criteria;
      try {
        criteria = { _id: new ObjectId(thread_id), "replies._id": reply_id }; //search by thread _id field and reply_id field in replies array
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      let update = { $set: { "replies.$.reported": true } }; //set reported field in matched reply in replies array
      //console.log("criteria:", criteria);

      DB_TABLE.findOneAndUpdate(
        criteria,
        update,
        (err, result) => {
          //console.log("result:", result);
          if (err || result.lastErrorObject.n == 0) {
            res.send("could not report");
            return;
          }
          res.send("Reply reported successfully");
        }
      );
    })

    //DELETE - update a reply text to '[deleted]', return if sucessful or not
    .delete(function(req, res) {
      var reply_id = req.body.reply_id;
      var thread_id = req.params.thread_id;
      var pass = req.body.delete_password;
      //console.log("pass:", pass);
      //console.log("reply_id", reply_id);

      let criteria;
      try {
        criteria = { _id: new ObjectId(thread_id), "replies._id": reply_id };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      //console.log("criteria:", criteria);

      /*
        //code to delete reply from replies array instead of just updating it
        let criteria;
        try{
          criteria = {_id: new ObjectId(thread_id)};
        } catch (e){
          res.send("_id error");
          return
        }
        if(!criteria) return;
        
        
        //let update = {$pull: {replies: {_id: reply_id}}};
    */
      let update = { $set: { "replies.$.text": "[deleted]" } }; //update text value of reply in replies array to "[deleted]"

      DB_TABLE.findOne(criteria, (err, document) => { //first find thread and reply
        //console.log("document:", document.replies);

        let reply = document.replies.filter(t => t._id == reply_id)[0]; //get reply in return thread
        //console.log("thread:", thread);

        if (reply == null || reply == undefined) { //if no reply with given reply_id found, return error message
          res.send("could not find reply " + reply_id);
          return;
        }

        if (bcrypt.compareSync(pass, reply.delete_password)) { //unencrypt reply delete_passward
          //remove from database
          //console.log("TRUE!");
          DB_TABLE.findOneAndUpdate( //if given pass matches delete_pass, update reply
            criteria,
            update,
            (er, result) => {
              //console.log("result:", result);
              res.send("Delete successful");
            }
          );
        } else {
          //console.log("FALSE!");
          //alert("Delete password is incorrect");
          res.send("Incorrect delete password");
        }
      });
    });
};
