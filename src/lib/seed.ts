import connectDB from './mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { events as staticEvents } from '@/data/events';

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Event.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'raicement33@gmail.com',
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created:', admin.email);

    // Create events from static data with exact ticket categories
    for (const event of staticEvents) {
      await Event.create({
        name: event.name,
        slug: event.slug,
        description: event.description,
        posterImage: event.posterImage,
        date: new Date(event.date),
        time: event.time,
        venue: event.venue,
        location: event.location,
        category: event.category,
        ticketCategories: event.ticketCategories.map(tc => ({
          name: tc.name,
          description: tc.description,
          price: tc.price,
          availableQuantity: tc.availableQuantity,
          soldQuantity: 0,
          active: true,
        })),
        featured: event.featured,
        status: 'published',
      });
      console.log(`Created event: ${event.name} with ${event.ticketCategories.length} ticket categories`);
    }

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: raicement33@gmail.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
