import { useEffect, useState } from "react";

import room_generate from "./room_generate";
import Conversation from "./conversation";

const Chat = () => {

  const [sender, setSender] = useState("")
  const [receiver, setReceiver] = useState("")
  const [receivers, setReceivers] = useState([]);
  const [chanel, setChanel] = useState("")



  const onSenderSet = (id) => {
    setSender(id)
    setReceivers([])
    setReceiver("")
    setChanel("")
    const filter = room_generate.filter(single => {
      return single.userId !== id
    })
    setReceivers(filter)
  }

  const onReceiverSet = (id) => {
    setChanel("")
    setReceiver(id)
  }

  const setChanelId = () => {
    let chanel = sender < receiver ? `${sender}_${receiver}` : `${receiver}_${sender}`
    setChanel(chanel)
  }


  useEffect(() => {
    if (receiver !== "") setChanelId()
  }, [receiver])

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", fontSize: "22px", borderBottom: "5px solid #ddd", padding: "10px" }}>
        Firebase one to one chat application
      </div>

      <div style={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
        <div style={{ margin: "10px", }}>
          <span style={{ fontSize: "15px", fontWeight: "700" }}>Sender</span>
          <button onClick={() => onSenderSet(100)} style={{ background: sender === 100 ? "green" : "white", margin: "10px", borderRadius: "10px" }}>A</button>
          <button onClick={() => onSenderSet(200)} style={{ background: sender === 200 ? "green" : "white", margin: "10px", borderRadius: "10px" }}>B</button>
          <button onClick={() => onSenderSet(300)} style={{ background: sender === 300 ? "green" : "white", margin: "10px", borderRadius: "10px" }}>C</button>
          <button onClick={() => onSenderSet(400)} style={{ background: sender === 400 ? "green" : "white", margin: "10px", borderRadius: "10px" }}>D</button>

        </div>

        {receivers.length > 0 &&
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px", }}>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>Receiver</span> {receivers.length > 0 ? '' : 'Please select sender'}
            {receivers.map(single => {
              return (
                <button onClick={() => onReceiverSet(single.userId)} style={{ background: receiver === single.userId ? "#ADD8E6" : "white", margin: "10px", borderRadius: "10px" }}>{single.name}</button>
              );
            })}
          </div>
        }
      </div>

      {chanel !== "" &&
        <Conversation chanel={chanel} sender={sender} receiver={receiver} />
      }
    </div>
  )
}

export default Chat;