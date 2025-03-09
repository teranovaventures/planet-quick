import { scrapeProducts } from '../../components/scrape';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const products = await scrapeProducts(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape products' });
  }
}