const bcrypt = require('bcryptjs');
const { initDB, query, getPool } = require('./database');

const itemsSeed = [
  {
    title: 'Organic Tomato Cultivation Workshop',
    description: 'Learn the secrets to growing high-yielding, flavorful organic tomatoes right on your balcony or backyard. Covers soil preparation, seedling selection, organic fertilizers, and pest management.',
    category: 'food',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600',
    availability: 15,
    location: '40.7128,-74.0060', // NYC
    date: '2026-07-15'
  },
  {
    title: 'Urban Beekeeping Masterclass',
    description: 'Discover how to start your own beehive in an urban environment. Understand bee behavior, hive construction, honey harvesting, and how bees support city ecosystems.',
    category: 'food',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=600',
    availability: 10,
    location: '34.0522,-118.2437', // Los Angeles
    date: '2026-08-22'
  },
  {
    title: 'Microgreens Starter Kit & Workshop',
    description: 'Grow fresh, nutrient-dense greens in under 10 days. Includes a hands-on grow tray, organic seeds, soil medium, and a video training workshop.',
    category: 'food',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=600',
    availability: 50,
    location: '41.8781,-87.6298', // Chicago
    date: '2026-07-30'
  },
  {
    title: 'Zero-Waste Home Starter Box',
    description: 'Kickstart your sustainable lifestyle with reusable organic beeswax wraps, bamboo toothbrushes, a mesh cotton produce bag, and solid shampoo bars.',
    category: 'lifestyle',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    availability: 30,
    location: '37.7749,-122.4194', // San Francisco
    date: null // Product
  },
  {
    title: 'Natural Soap Making Session',
    description: 'Craft beautiful, chemical-free soaps using organic cold-pressed oils, natural colorants, and pure essential oils. Perfect for personal use or gifting.',
    category: 'lifestyle',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1607006342456-ba275cd34284?auto=format&fit=crop&q=80&w=600',
    availability: 12,
    location: '40.7128,-74.0060', // NYC
    date: '2026-07-20'
  },
  {
    title: 'Upcycled Tote Bag Sewing Class',
    description: 'Give old textiles new life! Learn basic sewing machine skills and walk away with a custom, durable upcycled tote bag made from repurposed fabrics.',
    category: 'lifestyle',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    availability: 8,
    location: '34.0522,-118.2437', // Los Angeles
    date: '2026-09-05'
  },
  {
    title: 'Composting 101 for Small Spaces',
    description: 'Learn how to turn kitchen scraps into black gold, even in a studio apartment. Covering Bokashi systems, vermicomposting, and odor prevention.',
    category: 'education',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    availability: 25,
    location: '41.8781,-87.6298', // Chicago
    date: '2026-06-25'
  },
  {
    title: 'Rainwater Harvesting Systems Design',
    description: 'An introductory course on designing, building, and operating rainwater catchment systems for residential gardens and home water conservation.',
    category: 'education',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1541944743827-e04aa6427c33?auto=format&fit=crop&q=80&w=600',
    availability: 15,
    location: '29.7604,-95.3698', // Houston
    date: '2026-07-12'
  },
  {
    title: 'Sustainable Energy Solutions Seminar',
    description: 'Understand solar energy systems, wind power technology, and household energy efficiency upgrades that can lower your carbon footprint and save on bills.',
    category: 'education',
    price: 0.00, // Free event
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
    availability: 100,
    location: '37.7749,-122.4194', // San Francisco
    date: '2026-08-10'
  },
  {
    title: 'Mushroom Cultivation Intensive',
    description: 'Grow gourmet oyster mushrooms on simple household substrates like straw or cardboard. Learn spawn inoculation, incubation, and fruiting techniques.',
    category: 'food',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600',
    availability: 10,
    location: '40.7128,-74.0060', // NYC
    date: '2026-09-18'
  }
];

async function seed() {
  console.log('Starting seed process...');
  try {
    await initDB();

    // 1. Seed Users
    const usersCount = await query('SELECT COUNT(*) as count FROM users');
    if (usersCount[0].count === 0) {
      console.log('Seeding users...');
      const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
      const memberPasswordHash = await bcrypt.hash('password123', 10);

      await query(
        'INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
        [
          'Hub Admin', 'admin@harvest.hub', adminPasswordHash, 'admin',
          'John Doe', 'john@gmail.com', memberPasswordHash, 'member'
        ]
      );
      console.log('Users seeded: admin@harvest.hub / adminpassword, john@gmail.com / password123');
    } else {
      console.log('Users table already has data. Skipping users seed.');
    }

    // 2. Seed Items
    const itemsCount = await query('SELECT COUNT(*) as count FROM items');
    if (itemsCount[0].count === 0) {
      console.log('Seeding items...');
      for (const item of itemsSeed) {
        await query(
          'INSERT INTO items (title, description, category, price, image, availability, location, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            item.title,
            item.description,
            item.category,
            item.price,
            item.image,
            item.availability,
            item.location,
            item.date
          ]
        );
      }
      console.log(`Successfully seeded ${itemsSeed.length} items.`);
    } else {
      console.log('Items table already has data. Skipping items seed.');
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    const pool = getPool();
    if (pool) {
      await pool.end();
      console.log('Database pool connection closed.');
    }
    process.exit(0);
  }
}

seed();
