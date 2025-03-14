import connectDB from '../../lib/dbConnect';
import { ShoppingList } from '../../lib/models';

// Connect to the database
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const shoppingLists = await ShoppingList.find()
          .populate('coordinator')
          .populate('event'); // Populate references
        res.status(200).json(shoppingLists);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shopping lists' });
      }
      break;
    case 'POST':
      try {
        const shoppingList = new ShoppingList(req.body);
        await shoppingList.save();
        res.status(201).json(shoppingList);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create shopping list' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}