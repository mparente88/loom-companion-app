const Fear = require("../models/fear")

const getAllFears = async (req, res) => {
  try {
    const fears = await Fear.find()
    res.json(fears)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getFearById = async (req, res) => {
  try {
    const { id } = req.params
    const fear = await Fear.findById(id)
    if (fear) {
      return res.json(fear)
    }
    return res.status(404).send(`that fear doesn't exist`)
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(404).send(`That fear doesn't exist`)
    }
    return res.status(500).send(error.message)
  }
}

const createFear = async (req, res) => {
  try {
    const fear = await new Fear(req.body)
    await fear.save()
    return res.status(201).json({
      fear,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateFear = async (req, res) => {
  try {
    let { id } = req.params
    let fear = await Fear.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (fear) {
      return res.status(200).json(fear)
    }
    throw new Error("Fear not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deleteFear = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Fear.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send("Fear deleted")
    }
    throw new Error("Fear not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllFears,
  getFearById,
  createFear,
  updateFear,
  deleteFear,
}
