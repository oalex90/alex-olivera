'use strict';

var ObjectId = require('mongodb').ObjectId;
var uniqid = require("uniqid"); //used to generate unique _id field for notes
var request = require('request');

module.exports = function (app, db) {
  const DEFAULT_IMG_URL = "https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg";
  const DB_TABLE = db.collection("bookNotes");
  /*DB "bookNotes" collection structure:
      _id : book id (auto generated)
      user: String - username of user the book belongs to
      title: String - thread text
      created_on - String(Date)
      notes - Array:
                  _id - String - note id generated using uniqid
                  text - String - note text
                  created_on - String(Date)
                  is_favorited - boolean
  */
 
  app.route("/booknotes")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/booknotes.html');
  })

  app.route("/booknotes/api/tutorial")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/booknotesapi.html');
  })
  
  app.route('/booknotes/api')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": String, "user": String, "title": String, "created_on": String(Date), 
      //  "notes": [{"_id": String, "text": String, "created_on": String(Date), "is_favorited" boolean},...]},...]
      DB_TABLE.find().toArray((err, results)=>{
        res.json(results);
      });
    })
    
    .post(function (req, res){
    //response will contain new book object including atleast _id and title
      var title = req.body.title;
      var user = req.body.user;
      //console.log("req.body.title", req.body.title);
      if(title == null || title == ""){
        res.send("No title provided");
        return;
      }

      var newBook = {
        user: user,
        title: title,
        img: DEFAULT_IMG_URL,
        created_on: new Date(),
        notes: []
      };

      DB_TABLE.insertOne(newBook, (err, document)=>{
        if (err) throw err;
        //console.log("document", document.ops[0]);
        res.json(document.ops[0]);
      })
      
    })

    .put(function(req, res){
      //update property on a book
      var book_id = req.body.id;
      var img = req.body.img;
      var title = req.body.title;

      //console.log("img", img);
      //console.log("title", title);

      let criteria;
      try {
        criteria = { _id: new ObjectId(book_id)}; //search by book _id field
      } catch (e) {
        res.send("_id error");
        return;
      }
      if (!criteria) return;

      let update = {};

      if(img != null){
        if(img.match(/\.(jpeg|jpg|gif|png)$/) == null){
          res.send("invalid image type");
          return;
        }
        update = { $set: { img: img } }; //toggle is_favorited field in matched note in notes array
        //console.log("criteria:", criteria);
      } else if(title != null){
        update = { $set: { title: title } }; //update book title
      }

      DB_TABLE.findOneAndUpdate(
        criteria,
        update,
        {returnOriginal: false},
        (err, result) => {
          //console.log("result:", result);
          if (err || result.lastErrorObject.n == 0) {
            res.send("could not report");
            return;
          }
          res.json(result.value); //return modifiedBook
        }
      );
    })
    
    .delete(function(req, res){
        var bookid = req.body.id;
      //if successful response will be {"success": "delete successful"}
      let criteria;

      try{
          criteria = {_id: new ObjectId(bookid)};
      } catch (e){
          res.send("_id error");
          return;
      }
      if(!criteria) return;//

      DB_TABLE.deleteOne(criteria, (err, result)=>{
        //console.log("delete one result:", result.deletedCount);
        if (err || result.deletedCount == 0) {
          res.send("could not delete");
          return;
        };
        res.json({success: "delete successful"});
      });
    });



  app.route('/booknotes/api/:id')
  .get(function (req, res){
    //response will be individual book object
    //json res format: {"_id": String, "user": String, "title": String, "created_on": String(Date), 
      //  "notes": [{"_id": String, "text": String, "created_on": String(Date), "is_favorited" boolean},...]}
    var bookid = req.params.id;
    let criteria;

    try{
        criteria = {_id: new ObjectId(bookid)};
    } catch (e){
        res.send("_id error");
        return;
    }
    if(!criteria) return;

    //console.log("criteria:", criteria);

    DB_TABLE.findOne(criteria, (err, book)=>{
      //console.log("book:", book);
      if(err){
        res.send("_id error");
        return;
      }
      if(book == null){
        res.send("book does not exist");
        return;
      }
      res.json(book);
    });
  })

  .post(function(req, res){
  //add a new note. Response is the newly created note object
  //json res format: {"_id": String, "text": String, "created_on": String(Date), "is_favorited" boolean}
    var book_id = req.params.id;
    var text = req.body.text;

    var newNote = {
      _id: uniqid(), //create a unique id value for each note
      text: text,
      created_on: new Date(),
      is_favorited: false
    }
    // if(note == null || note == ""){
    //   res.send("No note provided");
    //   return;
    // }

    let criteria;

    try{
        criteria = {_id: new ObjectId(book_id)};
    } catch (e){
        res.send("_id error");
        return;
    }
    if(!criteria) return;

    let modify = {
      $push: { notes: newNote }, //add new note to end of notes array
    };

    DB_TABLE.findOneAndUpdate(
      criteria,
      modify,
      (err, document) => {
        if (err || document.lastErrorObject.n == 0) {
          res.send("could not find " + book_id);
          return;
        }
        //console.log("document", document.value);
        let modifiedBook = document.value;
        modifiedBook.notes.push(newNote);
        //console.log("modifiedBook",modifiedBook);
        res.json(modifiedBook);
      }
    );
  })

  .put(function(req, res){
    //update a note in a given book
    var book_id = req.params.id;
    var note_id = req.body.note_id;
    var currentValue = req.body.is_favorited;
    var note_text = req.body.note_text

    let criteria;
    try {
      criteria = { _id: new ObjectId(book_id), "notes._id": note_id }; //search by book _id field and note_id field in notes array
    } catch (e) {
      res.send("_id error");
      return;
    }
    if (!criteria) return;

    let update;
    if(currentValue != null){
      update = { $set: { "notes.$.is_favorited": !currentValue } }; //toggle is_favorited field in matched note in notes array
    }else if (note_text != null){
      update = {$set: { "notes.$.text": note_text } }; //set note text
    }

    DB_TABLE.findOneAndUpdate(
      criteria,
      update,
      {returnOriginal: false},
      (err, result) => {
        //console.log("result:", result);
        if (err || result.lastErrorObject.n == 0) {
          res.send("could not report");
          return;
        }
        res.json(result.value); //return modifiedBook
      }
    );

  })

  .delete(function(req, res){
    var book_id = req.params.id;
    var note_id = req.body.note_id;
    //console.log("note_id: ", note_id);

    let criteria;
    try {
      criteria = { _id: new ObjectId(book_id) }; //search by book _id field
    }catch (e){
      res.send("_id error");
      return;
    }
    if (!criteria) return;

    let update = { $pull: { notes: {_id: note_id}} }; //pull/remove note with matching note_id
    //console.log("criteria:", criteria);

    DB_TABLE.findOneAndUpdate(
      criteria,
      update,
      {returnOriginal: false},
      (err, result) => {
        //console.log("result:", result);
        if (err || result.lastErrorObject.n == 0) {
          res.send("could not report");
          return;
        }
        res.json(result.value);
      }
    );
  });
  
}