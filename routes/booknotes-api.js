'use strict';

var ObjectId = require('mongodb').ObjectId;

module.exports = function (app, db) {
  const DB_TABLE = db.collection("bookNotes");
 
  app.route("/booknotes")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/booknotes.html');
  })
  
  app.route('/booknotes/api')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      DB_TABLE.find().toArray((err, results)=>{
        // let output = results.map(book=>{
        //   return {
        //     _id: book._id,
        //     title: book.title,
        //     commentcount: book.comments.length
        //   }
        // })
        //console.log("results", results);
        res.json(results);
      });
    })
    
    .post(function (req, res){
    //response will contain new book object including atleast _id and title
      var title = req.body.title;
      //console.log("req.body.title", req.body.title);
      if(title == null || title == ""){
        res.send("No title provided");
        return;
      }
      var newBook = {
        title: title,
        comments: []
      }
      DB_TABLE.insertOne(newBook, (err, document)=>{
        if (err) throw err;
        //console.log("document", document);
        res.json({title: document.ops[0].title, _id: document.ops[0]._id, comments:[]});
      })
      
    })
    
    .delete(function(req, res){
      console.log("deleting all");
      //if successful response will be 'complete delete successful'
      DB_TABLE.deleteMany({}, (err, result)=>{
        console.log("delete all result:", result.result);
        if (err || result.result.n == 0) {
          res.send("could not delete");
          return;
        };
        res.json({success: "complete delete successful"});
      });
    });



  app.route('/booknotes/api/:id')
  .get(function (req, res){
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
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
  //json res format same as .get
    var bookid = req.params.id;
    var comment = req.body.comment;

    if(comment == null || comment == ""){
      res.send("No comment provided");
      return;
    }

    let criteria;

    try{
        criteria = {_id: new ObjectId(bookid)};
    } catch (e){
        res.send("_id error");
        return;
    }
    if(!criteria) return;
    let update = {$push: {comments: comment}};

    DB_TABLE.findOneAndUpdate(criteria, update, (err,result)=>{
      if(err){
        res.send("_id error");
        return;
      }
      if(result.value == null){
        res.send("book does not exist");
        return;
      }
      let book = result.value;
      book.comments.push(comment);
      //console.log("comment result", result.value);
      res.json(book);
    })

  })

  .delete(function(req, res){
    var bookid = req.params.id;
    //if successful response will be 'delete successful'
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
  
}