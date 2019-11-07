$(document).ready(function() {
  
  let query = window.location.href.split('?')[1] || null;
  var base_url = window.location.origin + "/issuetracker/";
  //console.log("pathname", query);
  console.log("pathname", window.location.pathname);
  var currentProject = window.location.pathname.replace("/issuetracker/", "");
  console.log("currentProject", currentProject);
  var url = "/issuetracker/api/"+currentProject;
  url = query ? url + "?"+query : url;
  console.log("url", url);
  $('#projectTitle').text('All issues for: '+currentProject)
  $.ajax({
    type: "GET",
    url: url,
    success: function(data)
    {
      var issues= [];
      data.results.forEach(function(ele) {
        console.log(ele);
        var openstatus;
        (ele.open) ? openstatus = 'open' : openstatus = 'closed';
        var single = [
          '<div class="issue '+openstatus+'">',
          '<p class="id">id: '+ele._id+'</p>',
          '<h3>'+ele.issue_title+' -  ('+openstatus+')</h3>',
          '<br>',
          '<p>'+ele.issue_text+'</p>',
          '<p>'+ele.status_text+'</p>',
          '<br>',
          '<p class="id"><b>Created by:</b> '+ele.created_by+'  <b>Assigned to:</b> '+ele.assigned_to,
          '<p class="id"><b>Created on:</b> '+ele.created_on+'  <b>Last updated:</b> '+ele.updated_on,
          '<br><a href="#" class="closeIssue" id="'+ele._id+'">close?</a> <a href="#" class="deleteIssue" id="'+ele._id+'">delete?</a>',
          '</div>'

        ];
        issues.push(single.join(''));
      });
      $('#issueDisplay').html(issues.join(''));
    }
  });

  $('#newIssue').submit(function(e){
    console.log("newIssue...");
    e.preventDefault();
    $('#newIssue').attr('action', "/issuetracker/api/" + currentProject);
    $.ajax({
      type: "POST",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        console.log("success...");
        window.location.reload(true); }
    });
  });

  $('#issueDisplay').on('click','.closeIssue', function(e) {
    var url = "/issuetracker/api/"+currentProject;
    $.ajax({
      type: "PUT",
      url: url,
      data: {_id: $(this).attr('id'), open: false},
      success: function(data) { alert(data); window.location.reload(true); }
    });
    e.preventDefault();
  });
  $('#issueDisplay').on('click','.deleteIssue', function(e) {
    var url = "/issuetracker/api/"+currentProject;
    $.ajax({
      type: "DELETE",
      url: url,
      data: {_id: $(this).attr('id')},
      success: function(data) { alert(data); window.location.reload(true); }
    });
    e.preventDefault();
  });
  
  
  $('#issuetrackerForm').on('submit', function(e) {
    let input = $('#project_input').val().toLowerCase();
    input = input.replace(/^\s+/g, ''); // remove spaces from beginning
    input = input.replace(/\s+$/g, ''); // remove spaces from end
    input = input.replace(/\s/g, '_'); // convert spaces to underscores
    input = input.replace(/_+/g, '_'); // remove duplicate underscores
    
    window.location.href = base_url + input;
    e.preventDefault();
  });
});