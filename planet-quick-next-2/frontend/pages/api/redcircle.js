import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters' });
  }

  const REDCIRCLE_API_KEY = 'E2F2E3783F764081A71BB17AE8094491'; // Your valid key

  try {
    const response = await axios.get('https://api.redcircleapi.com/request', {
      params: {
        api_key: REDCIRCLE_API_KEY,
        type: 'search',
        search_term: query,
        // Optionally add category_id (e.g., '5zja3' for office supplies) if desired
        // category_id: '5zja3',
      },
    });

    console.log('RedCircle Proxy Response:', JSON.stringify(response.data, null, 2));

    if (!response.data.search_results || response.data.search_results.length === 0) {
      return res.status(200).json([{ name: 'No products found', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
    }

    const products = response.data.search_results.map(item => {
      const price = item.offers?.primary?.price || 0;
      return {
        name: item.product.title || 'N/A',
        price: parseFloat(price) || 0,
        image: item.product.main_image || '/placeholder.png',
        size: item.product.feature_bullets?.find(bullet => bullet.includes('pack') || bullet.includes('ct'))?.match(/\d+\s*(pack|ct)/i)?.[0] || 'N/A',
        quantity: 1,
      };
    }).filter(p => p.name !== 'N/A' && p.price > 0).slice(0, 5);

    res.status(200).json(products.length > 0 ? products : [{ name: 'No products found', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
  } catch (error) {
    console.error('RedCircle Proxy Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data || 'No response data',
    });
    res.status(500).json({
      error: `Failed to fetch products from RedCircle: ${error.message}`,
      products: [{ name: 'Error fetching products', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }],
    });
  }
}