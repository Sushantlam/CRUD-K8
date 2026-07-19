import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import User from '../models/User';
import Item from '../models/Item';

const run = async () => {
  await connectDB();

  const email = process.env.SEED_EMAIL || 'demo@example.com';
  const password = process.env.SEED_PASSWORD || 'demo1234';

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: 'Demo User', email, password });
    console.log(`Created demo user: ${email}`);
  } else {
    console.log(`Demo user already exists: ${email}`);
  }

  const existingCount = await Item.countDocuments({ owner: user._id });
  if (existingCount === 0) {
    await Item.insertMany([
      { title: 'Set up Kind cluster', description: 'Control plane + 2 workers', owner: user._id },
      { title: 'Deploy MongoDB StatefulSet', description: 'With PVC', owner: user._id, completed: true },
      { title: 'Configure Ingress', description: 'Single entry point for frontend + API', owner: user._id },
    ]);
    console.log('Seeded 3 sample tasks');
  } else {
    console.log('Tasks already exist for demo user, skipping');
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
