import "./App.css";
import Welcome from "./Welcome";

function App() {
  return (
    /*<Welcome />*/
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
            <div className="area"></div>
          </div>
          <div className="send-text">
            <form action="" className="form2">
              <input
                type="text"
                placeholder="Ask any question"
                className="text"
              />
              <button className="attach-file">Attach</button>
              <input type="submit" name="" id="" className="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
