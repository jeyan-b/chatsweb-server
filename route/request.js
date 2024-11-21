const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Message = require('../model/message');
const Chat = require('../model/chat.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/privateMsgById', async function(req, res, next){

  try {
      const msgs = await Message.find({ 
        fromId : { "$in": [req.body.fromId, req.body.toId] },
    toId : { "$in": [req.body.fromId, req.body.toId] }
      });
        res.send(msgs);
      console.log(msgs);
    } catch (err) {
      console.log(err);
    }
  
  });
router.post('/publicMsg', async function(req, res, next){
  var newPublicMsg = new Message({
    sender: req.body.sender,
    chat: req.body.chat,
    content:req.body.content,
  });
  try {
      const msg = await newPublicMsg.save();
    //   const msgs = await Message.find({ 
    //     fromId : { "$in": [req.body.fromId, req.body.toId] },
    // toId : { "$in": [req.body.fromId, req.body.toId] }
    //   });
    //     res.send(msgs);

    const msgs = await Message.find({ chat:  req.body.chat});
    const chatRoom = await Chat.findOne({ _id: req.body.chat });

    console.log(msgs)
    let response = {
      chatRoom:chatRoom,
      messages: msgs
    }
        res.send(response);
      // console.log(msgs);
    } catch (err) {
      console.log(err);
    }
  
  });

router.post('/privateMsg', async function(req, res, next){
  var newPrivateMsg = new Message({
    sender: req.body.sender,
    chat: req.body.chat,
    content:req.body.content,
  });
  try {
      const msg = await newPrivateMsg.save();
    //   const msgs = await Message.find({ 
    //     fromId : { "$in": [req.body.fromId, req.body.toId] },
    // toId : { "$in": [req.body.fromId, req.body.toId] }
    //   });
    //     res.send(msgs);

    const msgs = await Message.find({ chat:  req.body.chat});
    const chatRoom = await Chat.findOne({ _id: req.body.chat });

    console.log(msgs)
    let response = {
      chatRoom:chatRoom,
      messages: msgs
    }
        res.send(response);
      // console.log(msgs);
    } catch (err) {
      console.log(err);
    }
  
  });
router.post('/openChat', async function(req, res, next){
  var newChat = new Chat({
    chatName: req.body.chatName,
    isGroupChat: req.body.isGroupChat,
    users:req.body.users,
    latestMessage:req.body.latestMessage,
    groupAdmin:req.body.groupAdmin,
  });
  try {
    // const user = await Chat.findOne({ userName: req.body.userName });
    const chats = await Chat.find();
    let filteredRoom=[];
    let reqUsersPossibilityOne = [req.body.users[0], req.body.users[1]].toString();
    let reqUsersPossibilityTwo = [req.body.users[1], req.body.users[0]].toString();

    chats.forEach(chatRoom => {
      console.log(chatRoom.users)
      if(chatRoom.users.toString() === reqUsersPossibilityOne || chatRoom.users.toString() === reqUsersPossibilityTwo){
        filteredRoom.push(chatRoom)
      }      
    });
    // console.log(chats);
    // console.log("================");
    console.log(filteredRoom);
    if(filteredRoom.length){
      // res.send(filteredRoom[0]);
      let id = filteredRoom[0]._id.toHexString();
      console.log(id.toString())
      const chats = await Message.find({ chat:  id.toString()});
      console.log(chats)
      let response = {
        chatRoom:filteredRoom[0],
        messages: chats
      }
      res.send(response);      
    }else{
      const newChatRoom = await newChat.save();
      let response = {
        chatRoom:newChatRoom,
        messages: []
      }
      res.send(response);
    }
    } catch (err) {
      console.log(err);
    }
  
  });
router.post('/openGroup', async function(req, res, next){
  var newChat = new Chat({
    chatName: req.body.chatName,
    isGroupChat: req.body.isGroupChat,
    users:req.body.users,
    latestMessage:req.body.latestMessage,
    groupAdmin:req.body.groupAdmin,
  });
  try {
    const newChatRoom = await newChat.save();
    let response = {
      chatRoom:newChatRoom,
      messages: []
    }
    res.send(response);
    } catch (err) {
      console.log(err);
    }
  
  });

// router.put('/updateDepartmentById/:id', async function(req, res, next){
//     try {
//         // const department = await Department.find({ id: req.params.id });
//         const department = await Department.findOneAndReplace({id:req.params.id},{name:req.body.name, id:req.body.id})
//         res.send(department);
//         console.log(department);
//       } catch (err) {
//         console.log(err);
//       }
// });

router.put('/openGroup/:id', async function(req, res, next){
  // var newChat = new Chat({
  //   chatName: req.body.chatName,
  //   isGroupChat: req.body.isGroupChat,
  //   users:req.body.users,
  //   latestMessage:req.body.latestMessage,
  //   groupAdmin:req.body.groupAdmin,
  // });
  console.log("Request data:" + req);
  try {
    // const newChatRoom = await newChat.save();
    const publicGroup = await Chat.findOneAndUpdate({_id:req.params.id},{users:req.body.users, latestMessage:req.body.latestMessage})
    console.log("publicGroup============"+publicGroup)
    let response = {
      chatRoom:publicGroup,
      messages: []
    }
    res.send(response);
    } catch (err) {
      console.log(err);
    }
  
  });

  router.get('/groupById/:id', async function(req, res, next){
    try {
      // const newChatRoom = await newChat.save();
      const groupById = await Chat.findOne({_id:req.params.id})
      console.log("publicGroup============"+groupById)
      let response = {
        chatRoom:groupById,
        messages: []
      }
      res.send(response);
      } catch (err) {
        console.log(err);
      }
    
    });

router.post('/registerUser', async function(req, res, next){
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    dob: req.body.dob,
    password:req.body.password,
    email: req.body.email,
    gender: req.body.gender,
    role:req.body.role,
    userStatus:req.body.userStatus,
  });
  try {
    const userNameCheck = await User.findOne({ userName: req.body.userName });
    if(userNameCheck){
      res.status(400);
      res.send('User name not available');
    }else{
      const user = await newUser.save();
      res.send(user);
      console.log(user);
    }  
    } catch (err) {
      console.log(err);
      // else{
        res.status(400);
        res.send('User not registered');
      // }
    }
  
  });

  router.post('/login', async function(req, res, next){
  try {
      const user = await User.findOne({ userName: req.body.userName });
      let bytes = CryptoJS.AES.decrypt(req.body.password, process.env.loginKey);
      let decodedPasswordFromUser = bytes.toString(CryptoJS.enc.Utf8)
      if(user){     
        let bytes1 = CryptoJS.AES.decrypt(user.password, process.env.loginKey);
      let decodedPasswordFromDB = bytes1.toString(CryptoJS.enc.Utf8)
        console.log(decodedPasswordFromDB  +"==="+ decodedPasswordFromUser)
        if(decodedPasswordFromDB === decodedPasswordFromUser){
          const user1 = await User.findOneAndUpdate({userName: req.body.userName},{isLoggedIn:true})
          const token = jwt.sign({userName: req.body.userName, id:user._id}, JWT_SECRET)
          res.status(200);
          res.json({status: 'ok', data : token})
        }else{
          res.status(400);
          res.send('Incorrect username or password');
        }
      }else{
        res.status(400);
        res.send('User not exist');
      }
      // console.log(user);
    } catch (err) {
      console.log(err);

    }
});

  router.post('/withoutLogin', async function(req, res, next){
    var newUser = new User({
      firstName: 'unknown',
      lastName: 'unknown',
      userName: req.body.userName,
      dob: 'unknown',
      password:'unknown',
      email: 'unknown',
      gender: req.body.gender,
      role:'Guest',
      userStatus:'Active',
      isLoggedIn: true
    });
    try {

      const userNameCheck = await User.findOne({ userName: req.body.userName });
      if(userNameCheck){
        res.status(400);
        res.send('User name not available');
      }else{
        const user = await newUser.save();
        const createdUser = await User.findOne({_id: user._id}).select('firstName lastName gender isLoggedIn userName _id role').exec();

        res.send(createdUser);
        console.log(createdUser);
      } 
      } catch (err) {
        console.log(err);
        // else{
          res.status(400);
          res.send('User not registered');
        // }
      }
});

router.post('/logout', async function(req, res, next){
  try {
      // const department = await Department.find({ id: req.params.id });
    
      const user = await User.findOne({ _id: req.body.userId });
      // res.send(user);
      if(user){
      const user1 = await User.findOneAndUpdate({_id: req.body.userId},{isLoggedIn:false})
        res.status(200);
        res.json({status: 'ok', data : 'Logged out successfully'})

      }else{
        res.status(400);
        res.send('User not exist');
      }
    } catch (err) {
      console.log(err);

    }
});

router.post('/userData', async function(req, res, next){
  try {
      // const department = await Department.find({ id: req.params.id });
      // console.log(req.params.userName)
      // const user = await User.findOne({ userName: req.body.userName });
      // res.send(user);
      const user = jwt.verify(req.body.token, JWT_SECRET)
      await User.findOne({ userName: user.userName }).then((data)=>{
        res.send({status:"ok", data: data})
      })
      .catch((error)=>{
        res.send({status:"error", data: error});
      });
      console.log(user);
    } catch (err) {
      console.log(err);

    }
});
  

router.get('/users', async function(req, res, next){
    try {
        const users = await User.find({}).select('firstName lastName gender isLoggedIn userName _id role').exec();
        res.send(users);
        console.log(users);
      } catch (err) {
        console.log(err);
      }
});

router.get('/userDataById/:id', async function(req, res, next){
  try {
      const user = await User.find({ _id: req.params.id}).select('firstName lastName userName dob email gender _id').exec();
      res.send(user);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
});

router.get('/groups', async function(req, res, next){
  try {
      const users = await Chat.find({ isGroupChat: true });
      res.send(users);
      console.log(users);
    } catch (err) {
      console.log(err);
    }
});

router.delete('/deleteUserById/:id', async function(req, res, next){
  try {
      const user = await User.findOneAndDelete({_id:req.params.id})
      res.send(user);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
});

router.put('/updateUserById/:id', async function(req, res, next){
  try {
      // const department = await Department.find({ id: req.params.id });
      const user = await User.findOneAndUpdate({_id:req.params.id},{dob:req.body.dob, email:req.body.email, firstName:req.body.firstName, gender:req.body.gender, lastName:req.body.lastName, userName:req.body.userName})
      res.send(user);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
});

router.get('/getUserById/:id', async function(req, res, next){
    try {
        const user = await User.find({ _id: req.params.id });
        
        res.send(user);
        console.log(user);
      } catch (err) {
        console.log(err);
      }
});

// router.put('/updateDepartmentById/:id', async function(req, res, next){
//     try {
//         // const department = await Department.find({ id: req.params.id });
//         const department = await Department.findOneAndReplace({id:req.params.id},{name:req.body.name, id:req.body.id})
//         res.send(department);
//         console.log(department);
//       } catch (err) {
//         console.log(err);
//       }
// });


// router.post('/department', async function(req, res, next){
// var newDepartment = new Department({
//     name: req.body.name,
//     id: req.body.id
// });
// try {
//     const department = await newDepartment.save();
//     res.send(department);
//     console.log(department);
//   } catch (err) {
//     console.log(err);
//   }

// });


// router.get('/employees', async function(req, res, next){
//   try {
//       const employee = await Employee.find({});
//       res.send(employee);
//       console.log(employee);
//     } catch (err) {
//       console.log(err);
//     }
// });


// router.delete('/deleteEmployeeById/:id', async function(req, res, next){
//   try {
//       const employee = await Employee.findOneAndDelete({_id:req.params.id})
//       res.send(employee);
//       console.log(employee);
//     } catch (err) {
//       console.log(err);
//     }
// });


// router.get('/getEmployeeById/:id', async function(req, res, next){
//   try {
//       const employee = await Employee.find({ id: req.params.departmentId });      
//       res.send(employee);
//       console.log(employee);
//     } catch (err) {
//       console.log(err);
//     }
// });



module.exports = router;