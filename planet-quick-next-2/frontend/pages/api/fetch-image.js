import { promises as fs } from 'fs';
import path from 'path';

// Ensure server-side execution in Next.js API route
export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Debug environment variable
    console.log('Environment variable GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

    // Explicitly load credentials from file if environment variable is not set
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/Users/nadirmalik/Desktop/planetquick/planet-quick-next-2/service-account-key.json';
    console.log('Using credentials path:', credentialsPath);

    const vision = require('@google-cloud/vision');
    if (!vision || !vision.ImageAnnotatorClient) {
      throw new Error('ImageAnnotatorClient not found in @google-cloud/vision module');
    }
    console.log('Successfully loaded @google-cloud/vision module');

    const visionClient = new vision.ImageAnnotatorClient({
      keyFilename: credentialsPath,
    });
    console.log('VisionClient initialized with credentials from:', credentialsPath);

    // Verify project and authentication
    const [projectId] = await visionClient.getProjectId();
    console.log('Detected project ID:', projectId);

    // Use a public image related to the query (for testing purposes)
    // We'll search for an image URL using a simple web search fallback if Vision fails
    const testImageUrl = `https://source.unsplash.com/200x200/?${query}`; // Unsplash provides query-based images
    console.log('Using test image URL:', testImageUrl);

    // Perform web detection
    const [webResult] = await visionClient.webDetection({
      image: { source: { imageUri: testImageUrl } },
    });
    console.log('WebDetection response:', webResult);

    const webDetection = webResult.webDetection;
    let imageUrl = webDetection?.bestGuessLabels[0]?.label.toLowerCase().includes(query.toLowerCase())
      ? webDetection?.visuallySimilarImages[0]?.url
      : null;

    if (!imageUrl) {
      console.warn('No image found via web detection for query:', query);
      // Fallback: Perform label detection to confirm the image content
      const [labelResult] = await visionClient.labelDetection({
        image: { source: { imageUri: testImageUrl } },
      });
      console.log('LabelDetection response:', labelResult);

      const labels = labelResult.labelAnnotations.map(label => label.description.toLowerCase());
      console.log('Detected labels:', labels);

      if (labels.some(label => label.includes(query.toLowerCase()))) {
        imageUrl = testImageUrl; // Use the Unsplash image if it matches the query
      } else {
        // Final fallback: Use a direct Unsplash URL for the query
        imageUrl = `https://source.unsplash.com/200x200/?${query}`;
        console.log('Falling back to Unsplash direct URL:', imageUrl);
      }
    }

    if (!imageUrl) {
      console.warn('No image found after all attempts for query:', query);
      return res.status(200).json({ imageUrl: null });
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Google Vision API error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({ error: 'Failed to fetch image from Google Vision', details: error.message });
  }
}