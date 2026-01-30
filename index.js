// 1. Load environment variables at the absolute top
require('dotenv').config(); 

const app = require('./server');          // Import the Express app
const connectDB = require('./config/db'); // Import MongoDB connection logic

const PORT = process.env.PORT || 5000;

/**
 * @desc Initialize Database and Start Artisan Lounge Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    // The fixed db.js already handles process.exit(1) on failure
    await connectDB();

    // Start Express server only after DB connection is successful
    const server = app.listen(PORT, () => {
      console.log(`🚀 ShaShi Artisan Lounge running at http://localhost:${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log(`❌ Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('❌ Failed to start the Artisan server:', error.message);
    process.exit(1); 
  }
};

startServer();