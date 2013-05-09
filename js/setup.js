if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}
$(document).ready(function() {
  var userName = window.location.search.replace( "?username=", "" );

  // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  var ajaxQuery = function(){
    $.ajax('https://api.parse.com/1/classes/messages', {
      contentType: 'application/json',
      data: {order: "-createdAt"},
      success: function(data){
        var userWithNames = _.filter(data.results, function(item){
          return item.hasOwnProperty('username') && item.hasOwnProperty('text') && item.hasOwnProperty('objectId') && item.hasOwnProperty('createdAt') && item.hasOwnProperty('updatedAt');
        });
        console.log(userWithNames);
        $('#main ul').html("");
        _.each(userWithNames, function(item){
          var $message = $('<li></li>');
          $message.text(item.username + ": " + item.text);
          $message.addClass(item.username);
          $('#main ul').append($message);
        });

        // console.log(data);
      },
      timeout: 1000,
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
    setTimeout(function(){ajaxQuery();},1000);
  };

  ajaxQuery();
var looper = function(){
  $.ajax('https://api.parse.com/1/classes/messages', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({username:"forever", text: "forever"}),
    success: function(data) {
      console.log('success');
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

//setInterval(function(){looper();}, 100);


  $('#userText').on("keyup",function(e) {
    if(e.keyCode !== 13){
      return;
    } else {
      var message = {
        'username': userName,
        'text': $('#userText').val()
      };
      $('#userText').val("");
      $.ajax('https://api.parse.com/1/classes/messages', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(message),
        success: function(data) {
          console.log('success');
        },
        error: function(data) {
          console.log('Ajax request failed');
        }
      });
    }
  });
});
/*
cURL
REST http methods: use GET, PUT, DELETE.
use nouns, not action/verbs

1: create ul to append messages
2: get list of messages to show on page
3: filter messages when 

use jquery to create cookie holding array of objId.


*/