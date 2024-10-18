const Kid = require("../models/kid")

const getAllKids = async (req, res) => {
  try {
    const kids = await Kid.find().populate(`mainFear`).populate(`favStuffy`)
    res.json(kids)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getKidById = async (req, res) => {
  try {
    const { id } = req.params
    const kid = await Kid.findById(id)
    if (kid) {
      return res.json(kid)
    }
    return res.status(404).send(`that kid doesn't exist`)
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(404).send(`That kid doesn't exist`)
    }
    return res.status(500).send(error.message)
  }
}

const createKid = async (req, res) => {
  try {
    const kid = await new Kid(req.body)
    await kid.save()
    return res.status(201).json({
      kid,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateKid = async (req, res) => {
  try {
    let { id } = req.params
    let kid = await Kid.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (kid) {
      return res.status(200).json(kid)
    }
    throw new Error("Kid not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deleteKid = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Kid.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send("Kid deleted")
    }
    throw new Error("Kid not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllKids,
  getKidById,
  createKid,
  updateKid,
  deleteKid,
}
