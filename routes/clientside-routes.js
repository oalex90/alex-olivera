'use strict';

module.exports = function (app, db) {
  
  //games
  app.route("/roguelike")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/roguelike.html');
  });
  
  app.route("/gameoflife")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/gameoflife.html');
  });
  
  app.route("/simonsays")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/simonsays.html');
  });
  
  app.route("/tictactoe")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/tictactoe.html');
  });
  
  
  //clientside apps
  app.route("/drummachine")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/drummachine.html');
  });
  
  app.route("/pomodorotimer")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/pomodorotimer.html');
  });
  
  app.route("/calculator")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/calculator.html');
  });
  
  app.route("/recipebox")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/recipebox.html');
  });
  
  app.route("/quotegen")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/quotegen.html');
  });
  
  
  //data representation
  
  app.route("/twitchstatus")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/twitchstatus.html');
  });
  
  app.route("/treemap")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/treemap.html');
  });
  
  app.route("/quotegen")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/quotegen.html');
  });
  
  
  app.route("/choropleth")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/choropleth.html');
  });
  
  app.route("/heatmap")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/heatmap.html');
  });
  
  app.route("/forcedirected")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/forcedirected.html');
  });
  
  app.route("/barchart")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/barchart.html');
  });
  
  app.route("/scatterplot")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/scatterplot.html');
  });
  
  
  app.route("/simplereact")
  .get(function(request, response) {
    response.sendFile(process.cwd() + '/dist/simplereact.html');
  });
}