const express = require('express');
const dotenv = require('dotenv');

// dotenv.config( { path: './.env.local' } );
dotenv.config( { } );
const ejs = require('ejs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', name => {
    console.log("new user", name)
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  socket.on('send', (msg) => {
    socket.broadcast.emit('receive', { msg: msg, name: users[socket.id] });
  });
  socket.on('disconnect', name => {
    console.log("user disconnected");
  });
});
const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(`listening on  ${port}`);
});