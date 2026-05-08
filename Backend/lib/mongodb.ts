import { Db, MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  return uri;
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(getMongoUri());
    await client.connect();

    const db = client.db('codepath');
    await createIndexes(db);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function createIndexes(db: Db) {
  try {
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    await db.collection('roadmaps').createIndex({ user_id: 1 });
    await db.collection('roadmaps').createIndex({ created_at: -1 });

    await db.collection('modules').createIndex({ roadmap_id: 1 });

    await db.collection('progress').createIndex({ user_id: 1 });
    await db.collection('progress').createIndex({ module_id: 1 });

    await db.collection('leaderboard').createIndex({ rank: 1 });
    await db.collection('leaderboard').createIndex({ points: -1 });

    await db.collection('chat_history').createIndex({ user_id: 1 });
    await db.collection('chat_history').createIndex({ created_at: -1 });

    await db.collection('streaks').createIndex({ user_id: 1 }, { unique: true });

    await db.collection('badges').createIndex({ user_id: 1 });

    await db.collection('enrollments').createIndex({ user_id: 1 });
    await db.collection('enrollments').createIndex({ course_id: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

