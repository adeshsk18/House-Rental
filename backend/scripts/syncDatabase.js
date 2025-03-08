require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

async function syncDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Check for admin user
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        type: 'admin',
        isAdmin: true,
        isActive: true,
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Get detailed database stats
    console.log('\nDetailed Database Statistics:');
    console.log('---------------------------');
    
    // Users
    const users = await User.find().select('name email type isAdmin isVerified');
    console.log('\nUsers:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) | Type: ${user.type} | Admin: ${user.isAdmin} | Verified: ${user.isVerified}`);
    });

    // Properties
    const properties = await Property.find().populate('ownerId', 'name email');
    console.log('\nProperties:', properties.length);
    properties.forEach(property => {
      console.log(`- ${property.propertyAddress} | Owner: ${property.ownerId?.name || 'Unknown'} | Type: ${property.propertyType}`);
    });

    // Bookings
    const bookings = await Booking.find()
      .populate('propertyId', 'propertyAddress')
      .populate('userId', 'name email');
    console.log('\nBookings:', bookings.length);
    bookings.forEach(booking => {
      console.log(`- Property: ${booking.propertyId?.propertyAddress || 'Unknown'} | User: ${booking.userId?.name || 'Unknown'} | Status: ${booking.status}`);
    });

    // Verification Requests
    const pendingVerifications = await User.find({ 
      type: 'owner',
      isVerified: false 
    }).select('name email');
    console.log('\nPending Verifications:', pendingVerifications.length);
    pendingVerifications.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type createdAt');

    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ownerId', 'name');

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('propertyId')
      .populate('userId');

    console.log('\nRecent Activities:');
    console.log('------------------');
    console.log('Recent Users:', recentUsers.length);
    console.log('Recent Properties:', recentProperties.length);
    console.log('Recent Bookings:', recentBookings.length);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

syncDatabase(); 