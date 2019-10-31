'use strict';

module.exports = function (app, db) {
  
  //games
  app.route("/roguelike")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/roguelike.html');
  });
  
  app.route("/gameoflife")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/gameoflife.html');
  });
  
  app.route("/simonsays")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/simonsays.html');
  });
  
  app.route("/tictactoe")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/tictactoe.html');
  });
  
  
  //clientside apps
  app.route("/drummachine")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/drummachine.html');
  });
  
  app.route("/pomodorotimer")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/pomodorotimer.html');
  });
  
  app.route("/calculator")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/calculator.html');
  });
  
  app.route("/recipebox")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/recipebox.html');
  });
  
  app.route("/quotegen")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/quotegen.html');
  });
  
  
  //data representation
  
  app.route("/twitchstatus")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/twitchstatus.html');
  });
  
  app.route("/treemap")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/treemap.html');
  });
  
  app.route("/quotegen")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/quotegen.html');
  });
  
  
  app.route("/choropleth")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/choropleth.html');
  });
  
  app.route("/heatmap")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/heatmap.html');
  });
  
  app.route("/forcedirected")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/forcedirected.html');
  });
  
  app.route("/barchart")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/barchart.html');
  });
  
  app.route("/scatterplot")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/scatterplot.html');
  });
  
  
  app.route("/simplereact")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/views/simplereact.html');
  });
}