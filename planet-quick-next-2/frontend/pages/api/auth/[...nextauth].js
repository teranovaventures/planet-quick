import connectDB from '../../lib/mongodb';
import { User } from '../../lib/models';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await connectDB();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or username' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ user: { id: user._id, username: user.username, email: user.email }, jwt: 'mock-jwt' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}