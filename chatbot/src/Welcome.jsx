import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome({ setUsername }) {
  let [name, setName] = useState("");
  let nevigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setUsername(name);
    nevigate("/chat");
  };

  return (
    <div className="main">
      <h1 className="welcome-message">Welcome to the chat bot!</h1>
      <h5 className="message">Enter your name to get started.</h5>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          className="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input type="submit" className="submit-button" />
      </form>
    </div>
  );
}

export default Welcome;
