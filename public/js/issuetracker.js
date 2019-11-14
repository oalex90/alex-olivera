import '../css/serverapps.scss';
import $ from 'jquery';

var base_url = window.location.origin + "/issuetracker/";

$(document).ready(function() { 
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