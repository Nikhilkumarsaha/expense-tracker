import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB connection string to .env.local');
}

const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority" as const,
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect()
        .then(client => {
          console.log('MongoDB connected successfully');
          return client;
        })
        .catch(error => {
          console.error('MongoDB connection error:', error);
          console.error('Connection details:', {
            uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'),
            options
          });
          throw error;
        });
    } catch (error) {
      console.error('Error creating MongoDB client:', error);
      throw error;
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected successfully');
        return client;
      })
      .catch(error => {
        console.error('MongoDB connection error:', error);
        console.error('Connection details:', {
          uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'),
          options
        });
        throw error;
      });
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
}

export default clientPromise;