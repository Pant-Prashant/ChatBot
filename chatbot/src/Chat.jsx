import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import Messages from "./Messages.jsx";

function Chat() {
  const [userMessage, setUserMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [responseList, setResponseList] = useState([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, responseList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage.trim() === "") return;

    setMessageList([...messageList, userMessage]);
    setUserMessage("");
  };

  return (
    <div className="main-div">
      <div className="header">
        <div className="title">ChatBot</div>
        <div style={{ display: "flex" }}>
          <button>Home</button>
          <div
            style={{ height: "35px", width: "1px", background: "black" }}
          ></div>
          <button>Chat History</button>
        </div>
      </div>
      <div className="main-body">
        <div className="sidebar"></div>
        <div className="container">
          <div className="chat-area">
            <div className="area">
              <Messages messageList={messageList} responseList={responseList} />
              <div ref={bottomRef}></div>
            </div>
          </div>
          <div className="send-text">
            <form action="" className="form2" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask any question"
                className="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <button type="button" className="attach-file">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="18"
                  fill="currentColor"
                  className="bi bi-paperclip"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                </svg>
              </button>
              <button type="submit" className="submit">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="18"
                  fill="currentColor"
                  className="bi bi-arrow-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
