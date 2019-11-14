"use strict";

var bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;
var uniqid = require("uniqid");

const SALT_ROUNDS = 10;

module.exports = function(app, db) {
  const DB_TABLE = db.collection("board");
  
  app.route("/messageboard").get(function(request, response) {
    response.sendFile(process.cwd() + "/dist/messageboard.html");
  });

  app.route("/messageboard/:board/").get(function(req, res) {
    res.sendFile(process.cwd() + "/dist/messageboard-board.html");
  });
  app.route("/messageboard/r/:postid").get(function(req, res) {
    res.sendFile(process.cwd() + "/dist/messageboard-thread.html");
  });

  app.route("/messageboard/api/threads/:board")
    .get(function(req, res) {
      var board = req.params.board;
      //console.log("board:", board);

      DB_TABLE
        .find({ board: board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .toArray((err, results) => {
          //console.log("results", results);
          let out = results.map(d => {
            //console.log("d", d);
            d.replies.sort((a, b) => {
              a = new Date(a.bumped_on);
              b = new Date(b.bumped_on);
              return a > b ? -1 : a < b ? 1 : 0;
            });
            let replycount = d.replies.length;
            let replies;
            if (replycount > 3) {
              replies = [
                d.replies[replycount - 1],
                d.replies[replycount - 2],
                d.replies[replycount - 3]
              ];
            } else {
              replies = d.replies.reverse();
            }
            replies = replies.map(r =>{
              return {
                _id: r._id,
                text: r.text,
                created_on: r.created_on,
                reported: r.reported
              }
            });
            return {
              _id: d._id,
              board: d.board,
              text: d.text,
              created_on: d.created_on,
              bumped_on: d.bumped_on,
              replycount: replycount,
              replies: replies
            };
          });
          res.json(out);
        });
    })

    .post(function(req, res) {
      var board = req.params.board;
      //console.log("board", board);
      var text = req.body.text;
      var pass = req.body.delete_password;
      //console.log("req.body", req.body);

      let newThread = {
        board: board,
        text: text,
        delete_password: bcrypt.hashSync(pass, SALT_ROUNDS),
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        replies: []
      };

      DB_TABLE.insertOne(newThread, (err, document) => {
        if (err) throw err;
        console.log("document", document.ops[0]._id);
        res.json({
          _id: document.ops[0]._id,
          board: newThread.board,
          text: newThread.text,
          created_on: newThread.created_on,
          replies: newThread.replies,
          replycount: 0
        });
      });
    })

    .put(function(req, res) {
      //console.log("req.body:", req.body);
      var _id = req.body.thread_id;
      //console.log("thread_id", _id);
      let criteria;
      try {
        criteria = { _id: ObjectId(_id) };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;
      let update = { $set: { reported: true } };

      DB_TABLE.findOneAndUpdate(
        criteria,
        update,
        (err, result) => {
          //console.log("result:", result);
          if (err || result.lastErrorObject.n == 0) {
            res.send("could not update " + _id);
            return;
          }
          res.send("Thread reported successfully");
        }
      );
    })

    .delete(function(req, res) {
      var _id = req.body.thread_id;
      var pass = req.body.delete_password;

      let criteria;
      try {
        criteria = { _id: ObjectId(_id) };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;
      //console.log("_id:", _id);
      //console.log("delete pass:", pass);

      DB_TABLE.findOne(criteria, (err, document) => {
        //console.log("document:", document);
        if (err || document == [] || document == null) {
          res.send("could not delete " + _id);
          return;
        }

        if (bcrypt.compareSync(pass, document.delete_password)) {
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

  app.route("/messageboard/api/replies/:thread_id")
    .get(function(req, res) {
      var thread_id = req.params.thread_id;
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
        let replies = result.replies.map(d => {
          return {
            _id: d._id,
            text: d.text,
            created_on: d.created_on,
            reported: d.reported
          };
        });
        let out = {
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

    .post(function(req, res) {
      var thread_id = req.params.thread_id;
      //console.log("thread_id:", thread_id);
      var text = req.body.text;
      var pass = req.body.delete_password;
      //console.log("req.body", req.body);

      let newReply = {
        _id: uniqid(),
        text: text,
        delete_password: bcrypt.hashSync(pass, SALT_ROUNDS),
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
        $push: { replies: newReply },
        $set: { bumped_on: new Date() }
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
          res.json({
            _id: newReply._id,
            text: newReply.text,
            created_on: newReply.created_on,
            reported: newReply.reported
          });
        }
      );
    })

    .put(function(req, res) {
      var reply_id = req.body.reply_id;
      var thread_id = req.params.thread_id;

      let criteria;
      try {
        criteria = { _id: new ObjectId(thread_id), "replies._id": reply_id };
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      let update = { $set: { "replies.$.reported": true } };
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
      let update = { $set: { "replies.$.text": "[deleted]" } };

      DB_TABLE.findOne(criteria, (err, document) => {
        //console.log("document:", document.replies);

        let thread = document.replies.filter(t => t._id == reply_id)[0];
        //console.log("thread:", thread);

        if (thread == null || thread == undefined) {
          res.send("could not find reply " + reply_id);
          return;
        }

        if (bcrypt.compareSync(pass, thread.delete_password)) {
          //remove from database
          //console.log("TRUE!");
          DB_TABLE.findOneAndUpdate(
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
