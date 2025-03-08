const express = require("express");
const { getAllUsersController, handleStatusController, getAllPropertiesController, getAllBookingsController, getVerificationRequestsController } = require("../controllers/adminController");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router()

// Admin authentication middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isAdmin) {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in admin middleware"
    });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, isAdmin: true });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in admin login",
      error
    });
  }
});

// Get Dashboard Stats
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    // Get counts with case-insensitive type matching
    const totalUsers = await User.countDocuments({ 
      isAdmin: false,
      type: { $ne: 'admin' }
    });
    
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const pendingVerifications = await User.countDocuments({ 
      type: { $regex: /^owner$/i },
      isVerified: false 
    });

    // Get recent activities
    const recentActivities = [];

    // Get recent users
    const recentUsers = await User.find({ 
      isAdmin: false,
      type: { $ne: 'admin' }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type createdAt');

    recentUsers.forEach(user => {
      recentActivities.push({
        type: 'user',
        description: `New ${user.type || 'user'} registered: ${user.name}`,
        timestamp: user.createdAt
      });
    });

    // Get recent properties
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ownerId', 'name');

    recentProperties.forEach(property => {
      recentActivities.push({
        type: 'property',
        description: `New property listed at ${property.propertyAddress} by ${property.ownerId?.name || 'Unknown'}`,
        timestamp: property.createdAt
      });
    });

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('propertyId', 'propertyAddress')
      .populate('userId', 'name');

    recentBookings.forEach(booking => {
      recentActivities.push({
        type: 'booking',
        description: `New booking by ${booking.userId?.name || 'Unknown'} for ${booking.propertyId?.propertyAddress || 'Unknown Property'}`,
        timestamp: booking.createdAt
      });
    });

    // Sort activities by timestamp
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        totalBookings,
        pendingVerifications,
        recentActivities: recentActivities.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error in admin stats:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
      error: error.message
    });
  }
});

// Get verification requests
router.get('/verification-requests', authMiddleware, isAdmin, async (req, res) => {
  try {
    const requests = await User.find({
      type: 'owner',
      isVerified: false
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching verification requests",
      error: error.message
    });
  }
});

// Handle verification status
router.put('/verify/:userId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `User verification ${status ? 'approved' : 'rejected'}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating verification status",
      error: error.message
    });
  }
});

// Get All Users
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error
    });
  }
});

// Toggle User Status (Block/Unblock)
router.patch('/users/:userId/toggle-status', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling user status",
      error
    });
  }
});

// Verify Owner
router.patch('/users/:userId/verify', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.type !== 'owner') {
      return res.status(400).json({
        success: false,
        message: "User is not an owner"
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Owner verified successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying owner",
      error
    });
  }
});

// Get All Properties
router.get('/properties', authMiddleware, isAdmin, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error
    });
  }
});

// Get All Bookings
router.get('/bookings', authMiddleware, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId', 'propertyAddress propertyType propertyAmt')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error
    });
  }
});

module.exports = router