const express = require("express")
const cors = require("cors")
const db = require("./db")
const fearController = require("./controllers/fearController")
const kidController = require("./controllers/kidController")
const stuffyController = require("./controllers/stuffyController")
const bodyParser = require("body-parser")
const logger = require("morgan")
const axios = require("axios")
const PORT = process.env.PORT || 3001
const app = express()
require("dotenv").config()

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => res.send("This is our landing page!"))
app.get("/kids", kidController.getAllKids)
app.get("/kids/:id", kidController.getKidById)

app.get("/stuffies", stuffyController.getAllStuffies)
app.get("/stuffies/:id", stuffyController.getStuffyById)

app.get("/fears", fearController.getAllFears)
app.get("/fears/:id", fearController.getFearById)

app.post("/kids", kidController.createKid)
app.post("/stuffies", stuffyController.createStuffy)
app.post("/fears", fearController.createFear)

app.put(`/kids/:id`, kidController.updateKid)
app.put(`/stuffies/:id`, stuffyController.updateStuffy)
app.put(`/fears/:id`, fearController.updateFear)

app.delete(`/kids/:id`, kidController.deleteKid)
app.delete(`/stuffies/:id`, stuffyController.deleteStuffy)
app.delete(`/fears/:id`, fearController.deleteFear)

const Kid = require("./models/kid")
const Fear = require("./models/fear")

const { getKidById } = kidController
const { getFearById } = fearController

app.post("/recommendStuffy", async (req, res) => {
  const { kidId, fearId, additionalInfo } = req.body

  try {
    const kid = await Kid.findById(kidId)
    const fear = await Fear.findById(fearId)

    if (!kid || !fear) {
      return res.status(404).json({ error: "Kid or Fear not found" })
    }

    const prompt = `Your job is to pair kids with stuffed animals that protect them from their fears. 
    You like to make a big ceremony out of the whole thing. It's very celebratory, and it should be a
    big moment for both the kid and the stuffed animal, who has always wanted a Person to protect. Your
    response is speaking directly to the kid, and you like to remind them of how much they mean to the
    stuffed animal they are about to inherit. In the fiction of this prompt, you are not creating a 
    stuffed animal, but you are finding one from a list of stuffed animals that have no Person to protect,
    and stuffed animals need a Person to protect! It's important to them.
    These are some details for you:
        Kid: ${kid.name}, Description: ${kid.desc}, Age: ${kid.age}, Fear: ${
      fear.name
    } (${fear.desc}).
        Additional Information: ${
          additionalInfo || "No additional information provided."
        }
        Please present the stuffed animal, introducing it by name and animal type, to the kid as their new
        protector and friend. Describe their backstory and special powers! Keep it to 650 characters or less.`

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const recommendation = response.data.choices[0].message.content.trim()
    res.json({ recommendation })
  } catch (error) {
    console.error("Error getting recommendation from ChatGPT:", error)
    res.status(500).json({ error: "Failed to get recommendation" })
  }
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
