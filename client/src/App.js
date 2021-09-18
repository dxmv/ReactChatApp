import React, { useEffect, useState } from 'react'
import Room from './Components/Room';


const ROOMS=["Video Games","Music","TV Shows","Movies"]

export default function App() {
  const [username,setUsername]=useState("");
  const [room,setRoom]=useState("Video Games");
  const [roomMessages,setRoomMessages]=useState({});
  const [joined,setJoined]=useState(false);
  const changeRoom=(e)=>{
    e.preventDefault();
    setJoined(prev=>!prev);
    
  }

  useEffect(async()=>{
    const obj={};
    ROOMS.forEach(el=>{
      obj[el]=[];
    });
    await setRoomMessages({...obj});
  },[]);

  return (
    <div className="container py-4 border mt-4">
      <div className="row">
      {joined?
        <Room room={room} username={username} changeRoom={changeRoom} existingMessages={roomMessages[room]}></Room>:
        <div className="d-flex flex-column align-items-center">
          <h1>CHAT APP</h1>
          <form className="form" onSubmit={changeRoom}>
            <div className="my-3">
              <label className="form-label">Name:</label>
              <input type="text" required value={username} className="form-control" onChange={e=>setUsername(e.target.value)}></input>
            </div>
            <div className="my-3">
              <label className="form-label">Room:</label>
              <select className="form-select" defaultValue={room} onChange={(e)=>setRoom(e.target.value)}>
                {ROOMS.map((newRoom,indx)=><option key={indx} value={newRoom}>{newRoom}</option>)}
              </select>
            </div>
            <button className="my-3 btn btn-primary">JOIN</button>
          </form>
        </div>
      }
      </div>
    </div>
  )
}
