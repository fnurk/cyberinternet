const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
const port = 3000;

app.use(express.static('public'));

let members = [];

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

io.on('connection', function(socket){
    socket.on('disconnect', function(){

    });
    socket.on('chat_msg', function(msg){
        console.log('user: ' + msg.user + '  message: ' + msg.message )
        io.emit("chat_msg", msg)
    })
    socket.on('user_conn', function(msg){
        console.log(msg.user + ' conneced!' )
        members.push(msg)
        io.emit("user_list", {"users" : members})
    })
    socket.on('user_disc', function(msg){
        members = members.filter(user => user.user != msg.user)
        console.log(members)
        console.log(msg.user + ' disconnected!' )
        io.emit("user_list", {"users" : members})
    })
  });

http.listen(port, () =>
 console.log(`Listening on port ${port}!`));