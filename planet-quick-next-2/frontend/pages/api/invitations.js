import connectDB from '../../lib/dbConnect';
import { Invitation } from '../../lib/models';

// Connect to the database
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const invitations = await Invitation.find()
          .populate('coordinator')
          .populate('event'); // Populate references
        res.status(200).json(invitations);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invitations' });
      }
      break;
    case 'POST':
      try {
        const invitation = new Invitation(req.body);
        await invitation.save();
        res.status(201).json(invitation);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create invitation' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}