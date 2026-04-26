import "./Welcome.css";

function Welcome() {
  return (
    <div className="main">
      <h1 className="welcome-message">Welcome to the chat bot!</h1>
      <h5 className="message">Enter your name to get started.</h5>
      <form action="" className="form">
        <input type="text" placeholder="Name" className="name" />
        <input type="submit" className="submit-button" />
      </form>
    </div>
  );
}

export default Welcome;
