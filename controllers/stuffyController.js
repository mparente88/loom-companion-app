const Stuffy = require("../models/stuffy")

const getAllStuffies = async (req, res) => {
  try {
    const stuffies = await Stuffy.find()
    res.json(stuffies)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getStuffyById = async (req, res) => {
  try {
    const { id } = req.params
    const stuffy = await Stuffy.findById(id)
    if (stuffy) {
      return res.json(stuffy)
    }
    return res.status(404).send(`that stuffy doesn't exist`)
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(404).send(`That stuffy doesn't exist`)
    }
    return res.status(500).send(error.message)
  }
}

const createStuffy = async (req, res) => {
  try {
    const stuffy = await new Stuffy(req.body)
    await stuffy.save()
    return res.status(201).json({
      stuffy,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateStuffy = async (req, res) => {
  try {
    let { id } = req.params
    let stuffy = await Stuffy.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (stuffy) {
      return res.status(200).json(stuffy)
    }
    throw new Error("Stuffy not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deleteStuffy = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Stuffy.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send("Stuffy deleted")
    }
    throw new Error("Stuffy not found")
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllStuffies,
  getStuffyById,
  createStuffy,
  updateStuffy,
  deleteStuffy,
}
