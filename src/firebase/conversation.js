import { useEffect, useRef, useState } from "react";
import { db, firestore } from "./firebase";
import room_generate from "./room_generate";
import DateTimeFormat from "./dateformat";
import attachImage from './attach.png'
import uploadFile from './upload.png';
import inprogressImage from './inprogress.gif';
import 'firebase/storage';

const Conversation = (props) => {
  const messagesEndRef = useRef(null)
  const { chanel, sender, receiver } = props
  const dbRef = db.ref();
  const [text, setText] = useState("")
  const [records, setRecords] = useState([])
  const [senderImage, setSenderImage] = useState("")
  const [receiverImage, setReceiverImage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null);
  const [inprogress, setInprogress] = useState(false);

  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const scrollbarStyles = `
  ::-webkit-scrollbar {
    display: none; /* Hide the scrollbar on Chrome, Safari, and Opera */
  }
  `;

  const textToSend = (e) => {
    setText(e.target.value)
  }

  const scrollToBottom = () => {
    console.log("scrolling...")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendToReceiver = (event) => {
    if (event.key === 'Enter' && text) {
      const payload = {
        "text": text,
        "chanel": chanel,
        "sender": sender,
        "receiver": receiver,
        "time": Date.now(),
      }
      dbRef.push(payload)
        .then(() => {
          console.log("Message sent.")
          setTimeout(() => {
            scrollToBottom()
          }, 1);
        })
        .catch(error => alert("Failed to send", error));
      setText("")
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setInprogress(true)
      const storageRef = firestore.ref();
      const fileRef = storageRef.child(selectedFile.name);
      const metadata = {
        contentLanguage: 'en',
        cacheControl: 'public,max-age=3600', // Example cache control value
        customMetadata: {
          key: 'value',
        },
      };

      fileRef
        .put(selectedFile, metadata)
        .then(async (snapshot) => {

          // Get the download URL
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('Download URL:', downloadURL);
            // Get the metadata
            snapshot.ref.getMetadata().then(async (metadata) => {
              console.log('Metadata:', metadata);
              //Sending to firebase
              const payload = {
                "text": text ? text : null,
                "chanel": chanel,
                "sender": sender,
                "receiver": receiver,
                "time": Date.now(),
                "downloadURL": downloadURL,
                "meta": metadata
              }
              dbRef.push(payload)
                .then(() => {
                  console.log("Message | Image sent.")
                  setText("")
                  setSelectedFile(null)
                  setInprogress(false)
                })
                .catch(error => {
                  console.log("Failed to send", error)
                  setInprogress(false)
                });
            });
          });
        }).catch(error => {
          console.log("Error : ", error)
          setInprogress(false)
        });
    }
  };


  useEffect(() => {
    const query = db.ref().orderByChild('chanel').equalTo(chanel);
    const handleDataChange = (snapshot) => {
      const matchingRecords = snapshot.val();
      if (matchingRecords !== null) {
        setRecords(matchingRecords);
        setTimeout(() => {
          scrollToBottom()
        }, 1)
      }
    };
    query.on('value', handleDataChange);
    return () => {
      query.off('value', handleDataChange);
      scrollToBottom()
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    room_generate.map(single => {
      if (single.userId === sender) {
        setSenderImage(single.image)
      }
      if (single.userId === receiver) {
        setReceiverImage(single.image)
      }

    })
  }, [sender, receiver])


  return (
    <div style={{ position: 'relative', display: "flex", margin: "10px", minHeight: "600px", minWidth: "70%", border: "1px solid #ADD8E6", borderRadius: "20px", background: "#ddd" }}>
      {/* Scroll top: <b>{scrollTop}</b> */}
      <div style={{
        position: "absolute",
        bottom: "50px",
        minHeight: "0px",
        maxHeight: "540px",
        scrollBehavior: "smooth",
        overflowY: "auto",
        width: "100%",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
        onScroll={handleScroll}
      >
        {records.length === 0 &&
          <div style={{ textAlign: "center", marginTop: "20px" }}> Start conversation</div>
        }
        {Object.keys(records).map((key) => (
          <div key={key} style={{ display: "flex", justifyContent: records[key].sender === sender ? "flex-start" : "flex-end", paddingLeft: "10px", margin: "10px" }}>
            {records[key].sender === sender &&
              <div
                style={{
                  height: "38px",
                  width: "40px",
                  marginRight: "10px"
                }}>
                <img src={require(`${senderImage}`)} alt="loading.." style={{ height: "35px", width: "35px", borderRadius: "50%" }} />
              </div>
            }
            <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "auto", height: "auto", textAlign: records[key].sender === sender ? "left" : "right", background: records[key].sender !== sender ? "#D5F5E3" : "white", borderBottomRightRadius: "5px", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", borderTopRightRadius: "5px", paddingLeft: "15px", paddingRight: "15px" }}>
              {records[key].sender !== sender && <div style={{ position: "absolute", top: "0px", right: "-5px", height: "8px", width: "10px", background: "#D5F5E3", borderTopRightRadius: "0%", borderBottomRightRadius: "100%" }}></div>}
              <div style={{ fontSize: "8px", paddingTop: "3px", color: "#2C3E50", width: "100%", paddingRight: "15px", }}><DateTimeFormat timestamp={records[key].time} /></div>
              {records[key].text && <div style={{ fontSize: "14px", color: "#000", width: "100%", paddingRight: "15px", }}>{records[key].text} </div>}
              {
                records[key]?.meta
                  ?
                  records[key].meta.contentType.indexOf('image') !== -1
                    ?
                    <div style={{ fontSize: "8px", paddingTop: "3px", paddingBottom: "10px", color: "#2C3E50", width: "100%", paddingRight: "15px", }}>
                      <img src={records[key].downloadURL} alt="loading" style={{ height: "200px", borderRadius: "5px" }} />
                    </div>
                    :
                    <div style={{ height: "30px", fontSize: "8px", paddingTop: "3px", color: "#2C3E50", width: "100%", paddingRight: "5px", marginTop: "5px" }}>
                      {records[key].sender === sender ? 'You sent' : 'Download'}
                      <a target="_blank" rel="noreferrer" href={records[key].downloadURL} style={{ background: "green", borderRadius: "2px", color: "white", padding: "5px", margin: "5px" }}>{records[key].meta.fullPath}</a>
                    </div>
                  :
                  null
              }
            </div>
            {records[key].sender !== sender &&
              <div
                style={{
                  height: "38px",
                  width: "40px",
                  marginRight: "10px",
                  marginLeft: "10px"
                }}>
                <img src={require(`${receiverImage}`)} alt="loading.." style={{ height: "35px", width: "35px", borderRadius: "50%" }} />
              </div>
            }
          </div>
        ))}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
        <style>{scrollbarStyles}</style>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", position: 'absolute', bottom: '0px', height: "35px", width: "100%", background: "#FFF", borderBottomLeftRadius: "18px", borderBottomRightRadius: "18px", paddingLeft: "0%", paddingRight: "0%" }}>
        <div style={{ marginLeft: "2%", width: "92%", }}>
          <input type="text" placeholder="Type your text" style={{ width: "100%", marginRight: "5px", height: "30px", borderRadius: "5px", border: "0px solid #ADD8E6", paddingLeft: "5px", paddingRight: "5px", outline: "none" }} onChange={textToSend} value={text} onKeyDown={sendToReceiver} />
        </div>
        {selectedFile === null &&
          <div style={{ width: "5%", marginRight: "1%", textAlign: "center" }}>
            <label htmlFor="file-upload">
              <img src={attachImage} alt="loading.." style={{ height: "20px" }} />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        }
        {selectedFile !== null && !inprogress &&
          <div style={{ width: "5%", marginRight: "1%", textAlign: "center" }}>
            <img onClick={handleUpload} src={uploadFile} alt="loading.." style={{ height: "20px" }} />
          </div>
        }
        {selectedFile !== null && inprogress &&
          <div style={{ width: "5%", marginRight: "1%", textAlign: "center" }}>
            <img src={inprogressImage} alt="loading.." style={{ height: "20px" }} />
          </div>
        }
      </div>
    </div>
  )
}

export default Conversation;