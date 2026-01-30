const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Cloud Connected");
    console.log("📦 Host:", conn.connection.host);
    console.log("🗄️ Database:", conn.connection.name);
  } catch (err) {
    console.error(`❌ Cloud Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
