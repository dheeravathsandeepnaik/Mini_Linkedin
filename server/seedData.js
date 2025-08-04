import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        bio: 'Software Engineer passionate about web development',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        bio: 'Product Manager with 5+ years experience',
        location: 'New York, NY',
        website: 'https://janesmith.com'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        bio: 'Full-stack developer and tech enthusiast',
        location: 'Austin, TX',
        website: 'https://mikejohnson.io'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: hashedPassword,
        bio: 'UX Designer creating beautiful user experiences',
        location: 'Seattle, WA',
        website: 'https://sarahwilson.design'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create test posts
    const posts = [
      {
        author: createdUsers[0]._id,
        content: 'Just launched my new portfolio website! Excited to share my latest projects with the community. Built with React and Node.js. #webdevelopment #react #nodejs',
        likes: [
          { user: createdUsers[1]._id },
          { user: createdUsers[2]._id }
        ],
        comments: [
          {
            user: createdUsers[1]._id,
            content: 'Looks amazing! Great work on the design.',
            createdAt: new Date()
          },
          {
            user: createdUsers[2]._id,
            content: 'Love the clean interface. Very professional!',
            createdAt: new Date()
          }
        ]
      },
      {
        author: createdUsers[1]._id,
        content: 'Had an amazing team meeting today discussing our Q4 roadmap. So grateful to work with such talented people! 🚀 #teamwork #productmanagement #growth',
        likes: [
          { user: createdUsers[0]._id },
          { user: createdUsers[3]._id }
        ],
        comments: [
          {
            user: createdUsers[0]._id,
            content: 'Sounds like an exciting quarter ahead!',
            createdAt: new Date()
          }
        ]
      },
      {
        author: createdUsers[2]._id,
        content: 'Learning TypeScript has been a game-changer for my development workflow. The type safety catches so many bugs early! Anyone else making the switch? #typescript #javascript #coding',
        likes: [
          { user: createdUsers[0]._id },
          { user: createdUsers[1]._id },
          { user: createdUsers[3]._id }
        ],
        comments: [
          {
            user: createdUsers[3]._id,
            content: 'TypeScript is fantastic! The learning curve is worth it.',
            createdAt: new Date()
          },
          {
            user: createdUsers[0]._id,
            content: 'Totally agree! Once you go TypeScript, you never go back.',
            createdAt: new Date()
          }
        ]
      },
      {
        author: createdUsers[3]._id,
        content: 'Just finished a user research session for our new mobile app. The insights we gathered will definitely shape our design decisions. User feedback is invaluable! #ux #userresearch #design',
        likes: [
          { user: createdUsers[1]._id }
        ],
        comments: [
          {
            user: createdUsers[1]._id,
            content: 'User research is so important! Looking forward to seeing the results.',
            createdAt: new Date()
          }
        ]
      },
      {
        author: createdUsers[0]._id,
        content: 'Attending a great tech conference this week. So many inspiring talks about the future of web development and AI integration. #techconference #ai #webdev',
        likes: [
          { user: createdUsers[2]._id },
          { user: createdUsers[3]._id }
        ],
        comments: []
      },
      {
        author: createdUsers[2]._id,
        content: 'Open source contribution milestone reached! Just merged my 50th PR to various projects. Contributing to the community feels amazing! 🎉 #opensource #github #community',
        likes: [
          { user: createdUsers[0]._id },
          { user: createdUsers[1]._id },
          { user: createdUsers[3]._id }
        ],
        comments: [
          {
            user: createdUsers[0]._id,
            content: 'Congratulations! Your contributions make a real difference.',
            createdAt: new Date()
          },
          {
            user: createdUsers[3]._id,
            content: 'That\'s awesome! Keep up the great work!',
            createdAt: new Date()
          }
        ]
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts`);

    console.log('Seed data created successfully!');
    console.log('\nTest Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Password: password123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
