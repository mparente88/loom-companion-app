const mongoose = require("mongoose")

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loomDatabase"

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB.")
  })
  .catch((e) => {
    console.error("Connection error", e.message)
  })

const db = mongoose.connection

module.exports = db
