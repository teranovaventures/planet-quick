import connectDB from '../../lib/dbConnect';
import { User } from '../../lib/models';
import bcrypt from 'bcrypt';

// Connect to the database
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
      break;
    case 'POST':
      try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}