const mongoose = require("mongoose");
var bodyParser = require('body-parser')
var cors = require('cors');
const Chat = require('./model/chat.js');
require('dotenv').config();
var mongoDB = process.env.mongoDB;


mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB failed to connect'))
db.on('connected', console.log.bind(console, 'MongoDB connected successfully'))

const express = require('express');
const app = express();

// const port = 8081;
const port = process.env.PORT;
app.use(cors());
app.use(function (req, res, next){
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "https://chatsweb.net/client");
    // res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
})
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use('/api', require('./route/request'));
const server =app.listen(port, ()=>{
    console.log(`Server Listening ${port}`)
});
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        // origin: process.env.socketIoOrigin,
        origin: '*'
    }
});
io.on("connection", (socket) =>{

    console.log("connected to socket.io");
    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        console.log("Socket UserID: "+userData._id);
        socket.emit("connected");
        io.emit("user joined", userData._id);
    });
    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log("user joined room: "+ room);
    })
    socket.on('new message', (newMessageReceived)=>{
        // console.log(newMessageReceived);
        var chat = newMessageReceived.chat
        var users = newMessageReceived.users
        console.log("emitted new message --- newMessageReceived.chat----"+ newMessageReceived.chat);
        // console.log("newMessageReceived.sender._id----"+ newMessageReceived.sender);
        // console.log(chat.users);
        if(!users){
            console.log("chat.users not defined")
        }else{
            console.log("users length: "+ users)
            users.forEach(user => {
                if(user !== newMessageReceived.sender){
                    console.log("chat-room=="+chat);
                    socket.in(chat).emit("message received", newMessageReceived);
                }
                // if(user == newMessageReceived.sender){
                //     return;
                // }else{
                //     console.log("chat-room=="+chat);
                //     socket.in(chat).emit("message received", newMessageReceived);
                // }
                
            });
        }
        
        // console.log("user joined room: "+ room);
    });
  
    socket.on('close chat', async (roomAndUserId)=>{
        let room = roomAndUserId.roomId
        let userIdFromReq = roomAndUserId.userId
        socket.leave(room);
      const selectedRoom = await Chat.findOne({ _id:room });      
      let filteredUsers = selectedRoom.users.filter((userId) => userId !== userIdFromReq)
      console.log("filteredUsers: "+filteredUsers)


    const publicGroup = await Chat.findOneAndUpdate({_id:room},{users:filteredUsers})

        console.log("user closed room: "+ room);
    })
    socket.off('setup', ()=>{
        console.log("user disconnected")
            socket.leave(userData._id);

    })
    // socket.on('output', (userData)=>{
    //     // socket.emit("connected")
    //         socket.emit('output', userData);

    // })
})

// io.on("connection", (socket) =>{
//     console.log("connected to main chat socket.io");
//     socket.on('main setup', (userId)=>{
//         socket.join(userId);
//         console.log("Socket UserID: "+userId);
//         socket.emit("main connected")
//     });
//     socket.on('join main chat', (room)=>{
//         socket.join(room);
//         console.log("user joined main room: "+ room);
//     })
//     socket.on('main new message', (newMainMessageReceived)=>{
//         // console.log(newMessageReceived);
//         var chat = newMainMessageReceived.chat
//         var users = newMainMessageReceived.users
//         console.log("main newMessageReceived.chat----"+ newMainMessageReceived.chat);
//         // console.log("newMessageReceived.sender._id----"+ newMessageReceived.sender);
//         // console.log(chat.users);
//         if(!users){
//             console.log("chat.users not defined")
//         }else{
//             console.log("users length: "+ users)
//             users.forEach(user => {
//                 if(user == newMainMessageReceived.sender){
//                     return;
//                 }else{
//                     console.log("chat-room=="+chat);
//                     socket.in(chat).emit("main message received", newMainMessageReceived);
//                 }
                
//             });
//         }
        
//         // console.log("user joined room: "+ room);
//     })

// })


// const mongo = require("mongodb").MongoClient;
// const client = require('socket.io')(8081).sockets;
// var mongoDB = 'mongodb://127.0.0.1/Hyundai';
// var cors = require('cors');

// mongo.connect(mongoDB, function(err, db){
//     if(err){
//         throw err;
//     }
//     console.log("Mongodb connected...")

//     client.on('connection', function(socket){
//         let chat = db.collection('privateMessages');

//         sendStatus = function(s){
//             socket.emit('status', s);

//         }

//         chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
//             if(err){
//                 throw err;
//             }
//             socket.emit('output', res);

//         });

//         socket.on('input', function(data){
//             let fromId = data.fromId;
//             let toId = data.toId;
//             let message = data.message;
//             if(fromId == '' || toId == '' || message ==''){
//                 sendStatus('please enter a name and message')
//             }else{
//                 chat.insert({fromId: fromId,toId:toId, message: message}, function(){
//                     client.emit('output', [data]);
//                     sendStatus({
//                         message: 'Message Sent',
//                         clear: true
//                     })
//                 })
//             }
//         })

//         socket.on('clear', function(data){
//             chat.remove({}, function(){
//                 socket.emit('cleared');
//             })
//         })
//     })

// });