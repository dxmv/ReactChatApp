const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const socketio=require("socket.io");
const UserManager=require("./User");
const userManager=new UserManager();
const app=express();
const server=http.createServer(app);
const io=socketio(server,{cors:{origin:"http://localhost:3000"}});

io.on("connection",socket=>{
  socket.on("join-room",({room,username})=>{
    userManager.addUser(socket.id,username,room);
    socket.join(room);
    const message={user:"",text:`${username} joined`};
    socket.broadcast.to(room).emit("receive-message",message);
    io.sockets.in(room).emit("room-users",userManager.getRoomUsers(room));
  });
  socket.on("send-message",({message,room})=>{
    io.sockets.in(room).emit("receive-message",message);
  })
  socket.on("leave",({room,username})=>{
    socket.leave(room);
    const message={user:"",text:`${username} disconnected`};
    userManager.leaveUser(username);
    socket.broadcast.to(room).emit("receive-message",message);
    socket.broadcast.to(room).emit("room-users",userManager.getRoomUsers(room));
  })
})

server.listen(5000);
