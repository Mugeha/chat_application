import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  const { fromEmail, toUsername, message } = req.body;

  try {
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newMessage = await Message.create({
      from: fromUser._id,
      to: toUser._id,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Message failed to send' });
  }
};

export const getMessages = async (req, res) => {
  const { fromEmail, toUsername } = req.body;

  try {
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { from: fromUser._id, to: toUser._id },
        { from: toUser._id, to: fromUser._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
