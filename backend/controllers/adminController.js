const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");
const bookingSchema = require("../schemas/bookingModel");

/////////getting all users///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({ isAdmin: false }).select('-password');
    
    return res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

/////////handling status for owner/////////
const handleStatusController = async (req, res) => {
  const { userid, status } = req.body;
  try {
    if (!userid) {
      return res.status(400).send({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await userSchema.findByIdAndUpdate(
      userid,
      { granted: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).send({
      success: true,
      message: `User has been ${status}`,
      data: user
    });
  } catch (error) {
    console.log("Error in handle status controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error updating user status",
      error: error.message
    });
  }
};

/////////getting all properties in app//////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find()
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    
    return res.status(200).send({
      success: true,
      message: "All properties fetched successfully",
      data: allProperties,
    });
  } catch (error) {
    console.log("Error in get all properties controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching properties",
      error: error.message
    });
  }
};

////////get all bookings////////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find()
      .populate('propertyId', 'propertyAddress propertyType propertyAmt')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "All bookings fetched successfully",
      data: allBookings,
    });
  } catch (error) {
    console.log("Error in get all bookings controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching bookings",
      error: error.message
    });
  }
};

// Get verification requests
const getVerificationRequestsController = async (req, res) => {
  try {
    const pendingVerifications = await userSchema.find({
      type: 'owner',
      isVerified: false
    }).select('-password');

    return res.status(200).send({
      success: true,
      message: "Pending verifications fetched successfully",
      data: pendingVerifications
    });
  } catch (error) {
    console.log("Error in get verification requests controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching verification requests",
      error: error.message
    });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
  getVerificationRequestsController
};
