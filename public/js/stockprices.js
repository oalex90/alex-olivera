$(document).ready(function(){
  $('#testForm').submit(function(e) {
    console.log("double price button clicked");
    $.ajax({
      url: '/stockprices/api',
      type: 'get',
      data: $('#testForm').serialize(),
      success: function(data) {
        $('#jsonResult2').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#testForm2').submit(function(e) {
    console.log("single price button clicked");
    $.ajax({
      url: '/stockprices/api',
      type: 'get',
      data: $('#testForm2').serialize(),
      success: function(data) {
        $('#jsonResult1').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
});