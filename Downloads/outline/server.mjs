// server.mjs
import express from "express";
import { AccessToken,RoomServiceClient,Room } from "livekit-server-sdk";
import cors from "cors";
import bodyParser from 'body-parser';

const livekitHost = 'wss://treepig-xfr1lc4a.livekit.cloud';
const key = "APIRN7cNN67ZwcG";
const secret = "hgzqrcbcyjytm2FJZq306njCOL3vtBTpS8hWqmLuB2B";
const roomService = new RoomServiceClient(livekitHost, key, secret);

const createToken = async (roomName,participantName) => {
  const at = new AccessToken(key, secret, {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });
  return at.toJwt();
};

const createRoom = async (roomName) => {
  const opts = {
    name: roomName,
    emptyTimeout: 10 * 60, // 10 minutes
    maxParticipants: 20,
  };
  const room = await roomService.createRoom(opts);
  console.log('room created', room);
  return room;
};

const app = express();
const port = 4001;
app.use(cors()); // 配置跨域
app.use(bodyParser.json());
app.post("/getToken", async (req, res) => {
  const { roomName, participantName } = req.body;
  createToken(roomName,participantName).then((token) => {
    res.send(token);
  });
});
app.post("/createRoom", async (req, res) => {
  const { roomName} = req.body;
  createRoom(roomName).then((room) => {
    res.send(room);
  });
});
app.get("/listRoom", async (req, res) => {
    roomService.listRooms().then((rooms) => {
      res.send(rooms);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
