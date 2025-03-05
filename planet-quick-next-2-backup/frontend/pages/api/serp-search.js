// pages/api/serp-search.js
export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  // Use the SERPAPI endpoint for Google Shopping results.
  const SERPAPI_SEARCH_URL =
    'https://serpapi.com/search.json?engine=google_shopping&q=';
  // Use your SERPAPI key (for development, you may hard-code it, but use env vars in production)
  const SERPAPI_API_KEY =
    process.env.SERPAPI_API_KEY || 'bca10feedf46adb19a7f1b5957ad2853b37e45edd97029352722a77762821ade';

  const url = `${SERPAPI_SEARCH_URL}${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`;
  try {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch from SERPAPI: ${response.status}` });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from SERPAPI:', error);
    res.status(500).json({ error: 'Error fetching data from SERPAPI' });
  }
}