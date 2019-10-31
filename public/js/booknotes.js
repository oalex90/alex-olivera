$(document).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  $.getJSON('/booknotes/api', function(data) {
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];
  var buttons = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/booknotes/api/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      buttons = [];
      buttons.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      buttons.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      buttons.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
 
      $('#detailComments').html(comments.join('') + buttons.join(''));
      
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/booknotes/api/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/booknotes/api/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.push('<li>' +newComment+ '</li>');//adds new comment to top of list
        $('#detailComments').html(comments.join('') + buttons.join(''));
      }
    });
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/booknotes/api',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/booknotes/api',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        console.log("success?");
        $('#display').html("");
        $('#detailTitle').html("<p>Select a book to see it's details and comments</p>");
        $('#detailComments').html("");
      }
    });
  });
});