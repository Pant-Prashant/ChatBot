import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Welcome from "./Welcome";
import Chat from "./Chat";
import SignUp from "./SignUp";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  let [username, setUsername] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome setUsername={setUsername} />}></Route>
        <Route path="/sign_up" element={<SignUp />}></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoute username={username}>
              <Chat username={username} />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
