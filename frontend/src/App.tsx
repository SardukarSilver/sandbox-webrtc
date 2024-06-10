import React, { useState, useEffect } from "react";
import JoinScreen from "./components/JoinScreen";
import ChatScreen from "./components/ChatScreen";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<"join" | "call">("join");
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState("");
  const [camera, setCamera] = useState<string>("");
  const [mic, setMic] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.REACT_APP_OPENTOK_API_KEY as string;

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("http://localhost:5001/session");
        const sessionData = await sessionRes.json();
        setSessionId(sessionData.sessionId);

        const tokenRes = await fetch(
          `http://localhost:5001/token/${sessionData.sessionId}`
        );
        const tokenData = await tokenRes.json();
        setToken(tokenData.token);
        setError(null);
      } catch (error) {
        setError("Failed to fetch session data");
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  const handleJoin = async (selectedCamera: string, selectedMic: string) => {
    setCamera(selectedCamera);
    setMic(selectedMic);
    if (!error) {
      setCurrentScreen("call");
    }
  };

  const handleLeave = async () => {
    setCurrentScreen("join");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {currentScreen === "join" ? (
        <JoinScreen onJoin={handleJoin} />
      ) : (
        <ChatScreen
          sessionId={sessionId}
          token={token}
          apiKey={apiKey}
          camera={camera}
          mic={mic}
          onLeave={handleLeave}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default App;
