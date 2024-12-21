require("dotenv").config()
const mongoose = require("mongoose")
const Fear = require("../models/fear")
const Kid = require("../models/kid")
const Stuffy = require("../models/stuffy")

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loomDatabase"

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas")
    seedDatabase()
  })
  .catch((error) => {
    console.error("Database connection error:", error)
    process.exit(1)
  })

const seedDatabase = async () => {
  try {
    await Fear.deleteMany({})
    await Kid.deleteMany({})
    await Stuffy.deleteMany({})

    const fears = await Fear.insertMany([
      { name: "Fear of Spiders", desc: "Arachnophobia", severity: 80, frequency: 50 },
      { name: "Fear of Heights", desc: "Acrophobia", severity: 70, frequency: 40 },
      { name: "Fear of Darkness", desc: "Nyctophobia", severity: 90, frequency: 60 },
      { name: "Fear of Flying", desc: "Aviophobia", severity: 65, frequency: 30 },
      { name: "Fear of Enclosed Spaces", desc: "Claustrophobia", severity: 75, frequency: 50 },
      { name: "Fear of Thunder", desc: "Astraphobia", severity: 85, frequency: 70 },
      { name: "Fear of Public Speaking", desc: "Glossophobia", severity: 60, frequency: 20 },
      { name: "Fear of Clowns", desc: "Coulrophobia", severity: 55, frequency: 25 },
      { name: "Fear of Snakes", desc: "Ophidiophobia", severity: 80, frequency: 40 },
      { name: "Fear of Being Alone", desc: "Monophobia", severity: 70, frequency: 50 },
    ])
    console.log(`Seeded ${fears.length} fears`)

    const kids = await Kid.insertMany([
      { name: "John", age: 10, desc: "Loves adventure", sleepQual: 80, nightmareCt: 3, notes: "Enjoys exploring forests." },
      { name: "Alice", age: 8, desc: "Avid reader", sleepQual: 90, nightmareCt: 1, notes: "Reads a book every week." },
      { name: "Ethan", age: 7, desc: "Soccer enthusiast", sleepQual: 75, nightmareCt: 5, notes: "Dreams of being a goalie." },
      { name: "Sophia", age: 9, desc: "Loves animals", sleepQual: 85, nightmareCt: 2, notes: "Has a pet rabbit." },
      { name: "Liam", age: 11, desc: "Budding artist", sleepQual: 80, nightmareCt: 4, notes: "Paints landscapes." },
      { name: "Emma", age: 6, desc: "Energetic and curious", sleepQual: 70, nightmareCt: 6, notes: "Asks a lot of questions." },
      { name: "Noah", age: 8, desc: "Science lover", sleepQual: 85, nightmareCt: 1, notes: "Enjoys stargazing." },
      { name: "Olivia", age: 7, desc: "Nature enthusiast", sleepQual: 88, nightmareCt: 3, notes: "Loves collecting leaves." },
      { name: "Mason", age: 10, desc: "Puzzle solver", sleepQual: 77, nightmareCt: 4, notes: "Solves jigsaw puzzles daily." },
      { name: "Isabella", age: 9, desc: "Creative storyteller", sleepQual: 82, nightmareCt: 2, notes: "Writes short stories." },
    ])
    console.log(`Seeded ${kids.length} kids`)

    const stuffies = await Stuffy.insertMany([
      { name: "Cuddly Bear", animalType: "Bear", desc: "Warm and snuggly", role: "Protector", wearTear: "Minimal" },
      { name: "Brave Bunny", animalType: "Rabbit", desc: "Always ready to hop into action", role: "Companion", wearTear: "Moderate" },
      { name: "Fierce Tiger", animalType: "Tiger", desc: "Strong and fearless", role: "Guardian", wearTear: "Minor" },
      { name: "Gentle Elephant", animalType: "Elephant", desc: "Wise and gentle", role: "Guide", wearTear: "Moderate" },
      { name: "Sly Fox", animalType: "Fox", desc: "Clever and quick", role: "Strategist", wearTear: "Light" },
      { name: "Playful Dolphin", animalType: "Dolphin", desc: "Joyful and playful", role: "Mood Booster", wearTear: "None" },
      { name: "Cheerful Monkey", animalType: "Monkey", desc: "Cheeky and cheerful", role: "Entertainer", wearTear: "Slight" },
      { name: "Strong Lion", animalType: "Lion", desc: "Brave and strong", role: "Leader", wearTear: "Moderate" },
      { name: "Fluffy Panda", animalType: "Panda", desc: "Soft and calm", role: "Comforter", wearTear: "Light" },
      { name: "Majestic Unicorn", animalType: "Unicorn", desc: "Magical and inspiring", role: "Dream Maker", wearTear: "Minimal" },
    ])
    console.log(`Seeded ${stuffies.length} stuffies`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}
