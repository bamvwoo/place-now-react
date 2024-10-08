import { connectToDatabase } from "../lib/mongodb.js";
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.VITE_PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_KEY,
  secret: process.env.VITE_PUSHER_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  const { database } = await connectToDatabase();
  const collection = database.collection("messages");

  if (req.method === 'GET') {
    const roomId = req.params.roomId;
    res.status(200).json([ {}, {}, {} ]);
  } else if (req.method === 'POST') {
    const { roomId, message } = req.body;

    // Pusher를 사용하여 특정 채널로 메시지 브로드캐스트
    await pusher.trigger(`${roomId}`, 'message', {
      message,
    });

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}