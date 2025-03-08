const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionofDb = require("./config/connect.js");
const path = require("path");
const morgan = require('morgan');

const app = express();

//////dotenv config/////////////////////
dotenv.config();

//////connection to DB/////////////////
connectionofDb();

///////////////port number///////////////////
const PORT = process.env.PORT || 8000;

/////////////////middlewares////////////////
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

/////////////////routes/////////////////////
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/user', require('./routes/userRoutes.js'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/owner', require('./routes/ownerRoutes'))

// Start server with error handling
const server = app.listen(PORT, (err) => {
  if (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try these steps:`);
      console.error('1. Stop any other servers that might be running');
      console.error(`2. Run: lsof -i :${PORT} to find the process using the port`);
      console.error('3. Run: kill -9 <PID> to stop that process');
      console.error('4. Try starting the server again');
    } else {
      console.error('Error starting server:', err);
    }
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});