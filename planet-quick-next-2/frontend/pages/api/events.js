const connectDB = require('../../lib/mongodb');
const { Event } = require('../../lib/models');

module.exports = async (req, res) => {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const events = await Event.find().populate('coordinator'); // Populate the coordinator reference
        res.status(200).json({ data: events });
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
      }
      break;
    case 'POST':
      try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ data: event });
      } catch (error) {
        res.status(400).json({ error: 'Failed to create event' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};