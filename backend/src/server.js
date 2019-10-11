const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const app = express();

const server = http.Server(app);
const io = socketio(server);

//db connect
mongoose.connect('mongodb+srv://node:node@cluster0-muid3.mongodb.net/nodeDb?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const connectedUsers = {};

io.on('connection', socket => {
    
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;

});

app.use((req, res, next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..','uploads')));
app.use(routes);
server.listen(3333);
