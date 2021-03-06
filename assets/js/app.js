/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */
function renderList(){
    socket.request('/item',function(items){
      var title = $('#list :first-child')[0].outerHTML;
      $('#list').html(title);
      $(items).each(function(idx,item){
        $('#list').append('<li>'+item.name+"</li>");
      });
      $('#list').listview('refresh');
    });
};

// remove Item
$('#list').on('click',function(e){
  var text = $(e.target).text();
  socket.request('/item/find?name='+text,{},function(items){
    socket.request('/item/destroy/'+items[0].id);
  });
});

// add Item
$('#item').on('keypress',function(e){
  if(e.which==13){
      var text = $('#item').val();
      socket.request('/item/create?name='+text,function(){
        $('#item').val('');
      });
  }
});

(function (io) {
  
  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {
    renderList();
    socket.on('message', function messageReceived(message) {
      renderList();
    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);
