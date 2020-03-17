// server.js
// where your node app starts


require('dotenv').config();
// init project
const express           = require('express');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const MongoClient       = require('mongodb').MongoClient;
const app               = express();
const session           = require('express-session');
const sessionStore      = new session.MemoryStore();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const passportSocketIo  = require('passport.socketio');
const cookieParser      = require('cookie-parser');

const shorturlRoute        = require('./routes/shorturl-api.js');
const stockpricesRoute     = require('./routes/stockprices-api.js');
const booknotesRoute       = require('./routes/booknotes-api.js');
const booknotesAuths       = require('./routes/booknotes-auths.js');
const emoterRoute          = require('./routes/emoter-api.js');
const emoterAuths          = require('./routes/emoter-auths.js');
const issuetrackerRoute    = require('./routes/issuetracker-api.js');
const messageboardRoute    = require('./routes/messageboard-api.js');
const chatroomRoute        = require('./routes/chatroom-api.js');
const chatroomAuths        = require('./routes/chatroom-auths.js');
const clientsideRoute      = require('./routes/clientside-routes.js');

app.use(helmet());

app.use(express.static('dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ //set up express-session to encrypt user login info
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
  //cookie: {secure: true}
}));

app.use(function(req, res, next) {
  res.set('credentials', 'include'); //Needed in Safari to store session data
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
  
MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  var db = client.db();
  var currentUsers = 0;
  
  shorturlRoute(app, db);
  stockpricesRoute(app, db);
  booknotesAuths(app);
  booknotesRoute(app, db);
  emoterAuths(app);
  emoterRoute(app, db);
  issuetrackerRoute(app, db);
  messageboardRoute(app, db);
  chatroomAuths(app, db);
  chatroomRoute(app, db);
  clientsideRoute(app, db);
  
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          'express.sid',
    secret:       process.env.SESSION_SECRET,
    store:        sessionStore
  }));

  //start socket.io code  
  io.on('connection', socket => {
    console.log('user ' + socket.request.user.username + ' connected');
    currentUsers++;
    io.emit('user', {name: socket.request.user.username, currentUsers, connected: true});

    socket.on('disconnect', function(data){
      console.log('A user has disconnected');
      currentUsers--;
      io.emit('user', {name: socket.request.user.username, currentUsers, connected: false});
    });

    socket.on('chat message', function(data){
      io.emit('chat message', {name: socket.request.user.username, message: data})
    });
  });
  
  http.listen(process.env.PORT || 3000, function(req, res){
    console.log('Your app is listening on port 3000');
  });
  
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
  
});


