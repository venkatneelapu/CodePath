const { MongoClient } = require('mongodb');
const dns = require('dns');
const { syncEnv } = require('./sync-env');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const env = syncEnv();
const uri = env.MONGODB_URI || 'mongodb://localhost:27017/codepath';

const SAMPLE_COURSES = [
  {
    title: 'Web Development Basics',
    description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration_hours: 40,
    created_at: new Date(),
  },
  {
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns and best practices',
    category: 'Frontend',
    difficulty: 'Advanced',
    duration_hours: 30,
    created_at: new Date(),
  },
  {
    title: 'Database Design & MongoDB',
    description: 'Learn to design efficient and scalable document databases',
    category: 'Databases',
    difficulty: 'Intermediate',
    duration_hours: 25,
    created_at: new Date(),
  },
  {
    title: 'Node.js & Backend Architecture',
    description: 'Build fast, scalable REST APIs and backend microservices',
    category: 'Backend',
    difficulty: 'Beginner',
    duration_hours: 35,
    created_at: new Date(),
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Master DSA for coding interviews and real-world system design',
    category: 'Computer Science',
    difficulty: 'Advanced',
    duration_hours: 50,
    created_at: new Date(),
  },
];

async function initializeDatabase() {
  console.log('🚀 Connecting to MongoDB Atlas at:', uri.replace(/:([^:@]+)@/, ':****@'));
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('codepath');
    console.log('✅ Connected successfully to MongoDB Atlas!\n');

    const collections = [
      'users',
      'sessions',
      'roadmaps',
      'modules',
      'progress',
      'courses',
      'enrollments',
      'leaderboard',
      'streaks',
      'badges',
      'chat_history',
      'quizzes',
    ];

    console.log('📚 Setting up collections & indexes...');
    for (const name of collections) {
      try {
        await db.createCollection(name);
        console.log(`  ✓ Created collection: ${name}`);
      } catch (err) {
        if (err.code !== 48) {
          console.log(`  ✓ Collection already exists: ${name}`);
        }
      }
    }

    // Create Indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('roadmaps').createIndex({ user_id: 1 });
    await db.collection('leaderboard').createIndex({ points: -1 });

    // Seed Courses
    const count = await db.collection('courses').countDocuments();
    if (count === 0) {
      await db.collection('courses').insertMany(SAMPLE_COURSES);
      console.log(`\n🎉 Seeded ${SAMPLE_COURSES.length} sample courses into MongoDB Atlas!`);
    } else {
      console.log(`\nℹ️  Courses collection already contains ${count} courses in MongoDB Atlas.`);
    }

    console.log('\n✅ Database initialization complete!\n');
  } catch (error) {
    console.error('\n❌ MongoDB initialization failed:', error.message);
  } finally {
    await client.close();
  }
}

initializeDatabase();
