$(function() {
  let socket = io();
  let name = '';
  let nameInput = $('#name-input');
  let chatInput = $('#chat-input');

  // handle name when user hits enter on keyboard
  nameInput.keydown(function(event) {
    if (event.which == 13) {
      handleName();
    }
  });

  // handle name entered with when clicking enter button
  $('.submit-name').on('click', function(event) {
    handleName();
  });

  // ensure message not empty
  function handleName() {
    event.preventDefault();
    if (nameInput.val() !== '') {
      name = nameInput.val();
      nameInput.val('');
      $('.enter-name').hide();
      socket.emit('new:member', name);
    }
  }

  // handle message when user hits enter on keyboard
  chatInput.keydown(function(event) {
    if (event.which == 13) {
      handleMessage();
    }
  });

  // handle message entered with when clicking enter button
  $('.submit-chat-message').on('click', function(event) {
    handleMessage();
  });

  // ensure message not empty
  function handleMessage() {
    event.preventDefault();
    if (chatInput.val() !== '' && name !== '') {
      socket.emit('new:message', { name: name, msg: chatInput.val() });
      chatInput.val('');
    }
  }

  // handle receiving new messages
  socket.on('new:message', function(msgObject) {
    $('#messages').append(
      $('<div class="msg new-chat-message">').html(
        '<span class="member-name">' +
          msgObject.name +
          '</span>: ' +
          msgObject.msg
      )
    );
    $('.chat-window').scrollTop($('#messages').height());
  });

  // handle members joining
  socket.on('new:member', function(name) {
    $('#messages').append(
      $('<div class="msg new-member">').text(name + ' has joined the room')
    );
    $('.chat-window').scrollTop($('#messages').height());
  });
});
