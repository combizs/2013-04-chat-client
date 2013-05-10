if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}
$(document).ready(function() {
  var getFriends = function (){
    $.ajax('https://api.parse.com/1/classes/users', {
      type: 'GET',
      contentType: 'application/json',
      data: {"where": '{"username": "'+userName+'"}', order: "-createdAt"},
      success: function (data) {
        friends = data.friendlist ? data.friendlist : {};
        console.log(friends);
      }
    });
  };
  var userName = window.location.search.replace( "?username=", "" );

  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });
  var friends = {};
  getFriends();
  var ajaxQuery = function() {
    var roomName = $('#room').val();
    $.ajax('https://api.parse.com/1/classes/messages', {
      contentType: 'application/json',
      data: {"where": '{"roomname": "'+roomName+'"}', order: "-createdAt"},
      success: function(data) {
        var userWithNames = _.filter(data.results, function(item) {
          return item.hasOwnProperty('username') && item.hasOwnProperty('text');
        });
        $('#main ul').html("");
        _.each(userWithNames, function(item) {
          var $message = $('<li></li>');
          $message.addClass("chat");
          $message.text(item.username + ": " + item.text);
          $message.addClass(item.username);
          $message.on("click", function() {
            var newFriend = $(this).attr('class').split(' ')[1];
            if (!friends[newFriend]) {
              friends[newFriend] = true;
            }
            else {
              friends[newFriend] = false;
            }
            makeFriendsObj();
            console.log(friends);
          });
          if(friends[item.username]) {
            $message.addClass("bold");
          }
          $('#main ul').append($message);
        });
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
    setTimeout(function(){ ajaxQuery(); }, 1000);
  };

  ajaxQuery();

  var makeFriendsObj = function(){
    var friendList = {
      'username': userName,
      'friendlist': friends
    };
    $.ajax('https://api.parse.com/1/classes/friends', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(friendList),
      success: function(data) {
        console.log('success');
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
  };

  var submit = function() {
    var roomName = $('#room').val();
    var message = {
      'username': userName,
      'text': $('#userText').val(),
      'roomname': roomName
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
  };

  $('#userText').on("keyup", function(e) {
    if(e.keyCode !== 13){
      return;
    } else {
      submit();
    }
  });
  $('.submit').on("click", function(e) {
    submit();
  });
});