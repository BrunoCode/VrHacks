var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var temp = 0;
var connected = false;
var all_chat = [];
var app_title = '';
var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:3000');
});
app.use(express.static(__dirname + '/public'));


app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
function saveMsg(msg) {
    all_chat.push(msg);
    if(all_chat.length > 10) {
      all_chat.shift();
    }
}

io.on('connection', function(client){
  console.log('new user connection');
  temp += 1;
  if(temp > 1) {
    client.broadcast.emit('connection',{hello: 'there are now ' + temp +
    ' in the conversation', num_users: temp, new_user: false, all_msg: all_chat,admin:false});
    client.emit('connection',{hello: 'welcome to the conversation, you are user number ' +
     temp + '.' , num_users: temp, new_user: true, all_msg: all_chat,admin:false});
  } else {
    client.emit('connection',{hello: 'welcome to your new conversation!',
    num_users: temp, new_user: true, all_msg: all_chat,admin:true});
  }
  client.on('chat message', function(msg){
    client.broadcast.emit('chat message', msg);
    saveMsg(msg);
  });
  client.on('disconnect', function(){
    temp -= 1;
    console.log('user disconnected');
  });
});
