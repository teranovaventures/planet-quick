import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db('planetquick');
    await db.collection('test').insertOne({ message: 'Hello MongoDB' });
    const result = await db.collection('test').findOne({ message: 'Hello MongoDB' });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}