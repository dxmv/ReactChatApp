import React, { useEffect, useRef, useState } from 'react'
import "../Styles/chat.css"
import { MdSend } from "react-icons/md";
import  io  from "socket.io-client";

const socket=io.connect('http://localhost:5000', {reconnect: true});

export default function Room({room,username,changeRoom,existingMessages}) {

  const [messages,setMessages]=useState([...existingMessages]);
  const [users,setUsers]=useState([]);

  const messageRef=useRef(null);
  const chatWindow=useRef(null);

  // Front End send message
  const sendMessage=(e)=>{
    e.preventDefault();
    const message={user:username,text:messageRef.current.value};
    messageRef.current.value="";
    socket.emit("send-message",{message,room});
  }

  const addMessage=async(message)=>{
    await setMessages(prev=>[...prev,message]);
    existingMessages.push(message);
  }

  // Join room
  useEffect(()=>{
    socket.emit("join-room",{room,username});
  },[])

  // Receive Message
  useEffect(()=>{
    if(socket===null)return;
    socket.on("receive-message",addMessage)
    chatWindow.current.scrollIntoView({ behavior: "smooth" })
    return ()=>socket.off("receive-message");
  },[messages])

  socket.on("room-users",async (roomUsers)=>{
    await setUsers([...roomUsers]);
  })

  return (
    <div>
      <h1>Room: {room}</h1>
      <div className="d-flex">
        <div className="col-10">
          <div id="chat-window" className="border px-3">
            {messages.map((message,indx)=>
              {
                if(message.user===""){
                  return (<p key={indx} className="chat-joined my-2">{message.text}</p>);
                }
                return(          
                <div className="message" key={indx}>
                  <p className="message-author">{message.user}</p>
                  <p className="message-text">{message.text}</p>
                </div>)
              }
            )}
            <div ref={chatWindow}/>
          </div>
          <form className="form mt-2" style={{position:"relative"}} onSubmit={sendMessage}>
            <input ref={messageRef} type="text" style={{width:"100%"}} placeholder="Message..." className="form-control"></input>
            <button type="submit" id="send-button"><MdSend/></button>
          </form>
        </div>
        <div className="col-2 px-2">
          <h5>Users ({users.length})</h5>
          <ul className="list-group" style={{overflowY:"scroll"}}>
              {users.map((user,indx)=>
                <li className="list-group-item" key={indx}>
                  {user.username}
                </li>)}
          </ul>
        </div>
      </div>
      <button className=" mt-3 btn btn-danger" onClick={(e)=>{
        socket.emit("leave",{room,username});
        changeRoom(e);
      }}>Quit</button>
    </div>
  )
}
