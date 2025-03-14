import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:admin123@127.0.0.1:27017/planetquick?authSource=admin';
const client = new MongoClient(uri);

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient && cachedClient.isConnected()) {
    return cachedClient;
  }
  try {
    await client.connect();
    cachedClient = client;
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;