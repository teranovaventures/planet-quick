import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters' });
  }

  const SERP_API_KEY = '021CBFF9A2BE43D5973AB872E9F6AA34'; // Store in .env for security

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key: SERP_API_KEY,
        engine: 'google_shopping',
        q: query,
        location: 'United States',
        hl: 'en',
        gl: 'us',
      },
    });

    console.log('SerpAPI Proxy Response:', response.data);

    if (!response.data.shopping_results || response.data.shopping_results.length === 0) {
      return res.status(200).json([{ name: 'No products found', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
    }

    const products = response.data.shopping_results.map(item => ({
      name: item.title || 'N/A',
      price: parseFloat(item.price?.replace('$', '') || '0') || 0,
      image: item.thumbnail || '/placeholder.png',
      size: item.specifications?.find(spec => spec.key === 'Size')?.value || 'N/A',
      quantity: 1,
    })).filter(p => p.name !== 'N/A' && p.price > 0).slice(0, 5);

    res.status(200).json(products.length > 0 ? products : [{ name: 'No products found', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
  } catch (error) {
    console.error('SerpAPI Proxy Error:', error.message, error.response?.data || 'No response data');
    res.status(500).json([{ name: 'Error fetching products', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
  }
}