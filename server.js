const express = require("express")
const cors = require("cors")
const path = require("path")
const db = require("./db")
const fearController = require("./controllers/fearController")
const kidController = require("./controllers/kidController")
const stuffyController = require("./controllers/stuffyController")
const bodyParser = require("body-parser")
const logger = require("morgan")
const axios = require("axios")
const PORT = process.env.PORT || 3000
const app = express()
require("dotenv").config()

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(cors())

app.use(express.static(path.join(__dirname, "client")))

app.use("/images", express.static(path.join(__dirname, "images")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"))
})
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

    const prompt = `You are a grand storyteller, known for ceremoniously pairing brave children with stuffed animals who long to protect them. 
    The bond you help create is magical, and this moment is filled with excitement, joy, and love. 
    The stuffed animals you introduce are not just toys; they are fierce, loyal companions with unique backstories, each awaiting their perfect Person to protect. 
    
    Now, it's time for an extraordinary pairing:
    
        Kid: ${kid.name}, Description: ${kid.desc}, Age: ${kid.age}
        Fear: ${fear.name} (${fear.desc})
        Additional Information: ${additionalInfo || "No additional information provided."}
    
    In this moment, speak directly to the child, making them feel like the special Person they are. 
    Introduce their new stuffed animal companion by name and animal type, and describe the special powers it possesses to keep them safe. 
    End the message with a heartwarming and empowering promise of friendship and protection. Keep the tone magical, inspiring, and uplifting, all within 650 characters.`

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
