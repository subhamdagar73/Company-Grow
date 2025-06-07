import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import Badge from './models/Badge.js';

dotenv.config();
connectDB();

const badges = [
  {
    name: 'Course Completionist',
    description: 'Awarded for completing your first course.',
    icon: 'book-open',
    points: 10,
    criteria: 'complete_course',
    color: 'blue'
  },
  {
    name: 'Project Pioneer',
    description: 'Awarded for completing your first project.',
    icon: 'folder-kanban',
    points: 20,
    criteria: 'complete_project',
    color: 'green'
  }
];

const seedBadges = async () => {
  try {
    await Badge.deleteMany();
    await Badge.insertMany(badges);
    console.log('Badges seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();