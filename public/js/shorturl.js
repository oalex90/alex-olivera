$(document).ready(function() {
  $('#shorturlForm').on('submit', function(e) {
    var base_url = "https://alex-olivera.glitch.me/shorturl/";
    $.ajax({
      type: "POST",
      url: "/shorturl",
      data: $(this).serialize(),
      success: function(data) {
        if(data.short_url){
           $('#resultDisplay').html("<span>Shortened URL: <a href='"+base_url + data.short_url+"' target='_blank'>"+base_url + data.short_url+"</a></span>");
        } else{
          $('#resultDisplay').text("Invalid URL");
        }
      }
    });
    e.preventDefault();
  });
});