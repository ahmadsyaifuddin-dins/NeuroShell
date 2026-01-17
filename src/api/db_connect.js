const mongoose = require('mongoose');

let cachedDb = null;

module.exports = async () => {
  if (cachedDb) return cachedDb;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};