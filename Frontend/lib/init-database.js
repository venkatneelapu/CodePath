/**
 * MongoDB Collections Setup and Initialization
 * Run this once to set up your database structure
 * Usage: node lib/init-database.js
 */

import { connectToDatabase } from './mongodb.js';

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
    title: 'Database Design',
    description: 'Learn to design efficient and scalable databases',
    category: 'Databases',
    difficulty: 'Intermediate',
    duration_hours: 25,
    created_at: new Date(),
  },
  {
    title: 'Node.js for Beginners',
    description: 'Get started with Node.js and build backend applications',
    category: 'Backend',
    difficulty: 'Beginner',
    duration_hours: 35,
    created_at: new Date(),
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Master DSA for coding interviews and real-world applications',
    category: 'Computer Science',
    difficulty: 'Advanced',
    duration_hours: 50,
    created_at: new Date(),
  },
];

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();

    console.log('🚀 Initializing CodePath Database...\n');

    // Create collections
    console.log('📚 Creating collections...');
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
      'password_resets',
      'quizzes',
      'quiz_submissions',
    ];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`  ✓ Created ${collectionName} collection`);
      } catch (error) {
        if (error.code !== 48) {
          // 48 = namespace already exists
          console.log(`  ✓ ${collectionName} collection already exists`);
        }
      }
    }

    // Seed sample courses
    console.log('\n📖 Seeding sample courses...');
    const existingCourses = await db.collection('courses').countDocuments();

    if (existingCourses === 0) {
      const result = await db.collection('courses').insertMany(SAMPLE_COURSES);
      console.log(`  ✓ Created ${result.insertedIds.length} sample courses`);
    } else {
      console.log(`  ✓ Courses already exist (${existingCourses} courses found)`);
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up environment variables in .env.local');
    console.log('   2. Test authentication endpoints');
    console.log('   3. Create your first roadmap');
    console.log('   4. Start building!');

    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}
