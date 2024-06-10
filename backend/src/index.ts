import express from "express";
import OpenTok from "opentok";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5001;

const apiKey = process.env.OPENTOK_API_KEY as string;
const apiSecret = process.env.OPENTOK_API_SECRET as string;
const opentok = new OpenTok(apiKey, apiSecret);

let sessionId: any = null;

// Create a single session when the server starts
opentok.createSession({}, (err, session) => {
  if (err) {
    console.error("Failed to create session:", err);
  } else {
    sessionId = session?.sessionId;
    console.log("Session created:", sessionId);
  }
});

// Use cors middleware with options
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get("/session", (req, res) => {
  if (!sessionId) {
    return res.status(500).send({ error: "Session not initialized" });
  }
  res.json({ sessionId });
});

app.get("/token/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  try {
    const token = opentok.generateToken(sessionId);
    res.json({ token });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
