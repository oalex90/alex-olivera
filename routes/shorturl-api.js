'use strict';

var urlExistsDeep = require('url-exists-deep');

module.exports = function (app, db) {
  const DB_TABLE = db.collection("shorturl");
  const DB_INDEX = db.collection("shorturlIndex");
  
  app.route("/shorturl")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/shorturl.html');
  })
  .post(function (req, res) { //when form post button clicked, try to create shortend url
    var url = req.body.url; //use body-parser to get url from html form input
    
    urlExistsDeep(url).then((response)=>{ //use url-exists to determine if valid url
      if(response){ //if url is valid...
        console.log("url", response.href);
        url = response.href;
        DB_TABLE.findOne({url: url}, (err, data)=>{ //check if url value exists in Url model
          if (data){ //if document exists, display the exisiting short value for that url
            //console.log("found", data);
            res.json({original_url: url, short_url: data.short})

          } else{ //if document doesn't exists create a new document in Url model
            //console.log("no match found")
            let index = 1; //default value
            DB_INDEX.findOne({name: "index"},(err,data)=>{ //get index from Index model
              if(data){
                index = data.index + 1;
              }
              let update = {$set: {index: index}};
              DB_INDEX.updateOne({name: "index"}, update, {upsert: true}, (er,dat)=>{}) //update index value in Index model
              let newUrl = {url: url, short: index}; 
              DB_TABLE.insertOne(newUrl, (err,data)=>{ //create new Url document
                //console.log("data", data);
                res.json({original_url: url, short_url: index })
              })
            })
          }
        })
      }else{ //if invalid url, display error message
        res.json({error: "invalid URL"});
      }
    }).catch((e)=>{
      res.json({error: "invalid URL"});
    });
  });

  app.get("/shorturl/:number", (req,res)=>{ //when url with short value entered, go to corresponding url if exists
    let input = req.params.number; //get short value from url
    if(/^\d+$/.test(input)){ //if input is a number (does not contain anything but numbers)...
      DB_TABLE.findOne({short: parseInt(input)}, (err,data)=>{ //check if short value exists in Url model
        if (data){ //if exists, redirect to the corresponding url address
          res.redirect(data.url);
        } else{ // if doesn't exist, display error message
          res.json({error: "Invalid Path"});
        }
      })
    } else{ //if input is not a number, display error message
      res.json({error: "Invalid Path"});
    }
  });
  
}