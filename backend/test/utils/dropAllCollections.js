const mongoose = require("mongoose");

module.exports = async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped.
      // Safe to ignore.
      if (error.message === "ns not found") return;

      console.log(error.message);
    }
  }
};
