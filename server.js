const express = require("express")
const cors = require("cors")
const db = require("./db")
const fearController = require("./controllers/fearController")
const kidController = require("./controllers/kidController")
const stuffyController = require("./controllers/stuffyController")
const bodyParser = require("body-parser")
const logger = require("morgan")
const PORT = process.env.PORT || 3001
const app = express()

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

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
