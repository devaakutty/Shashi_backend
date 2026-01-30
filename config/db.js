const mongoose = require("mongoose");

// We define a variable outside the function to "cache" the connection
let isConnected = false;

const connectDB = async () => {
  // 1. If we are already connected, don't waste time reconnecting
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options help prevent timeouts on Vercel
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState;

    console.log("✅ MongoDB Cloud Connected");
    console.log("📦 Host:", conn.connection.host);
    console.log("🗄️ Database:", conn.connection.name);
  } catch (err) {
    console.error(`❌ Cloud Connection Error: ${err.message}`);
    
    // On Vercel, process.exit(1) can cause the whole function to hang.
    // We only exit if we are running locally.
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;