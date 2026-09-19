const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/news_portal';
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
};

module.exports = connectDB;
