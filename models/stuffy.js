const mongoose = require(`mongoose`)
const { Schema } = require(`mongoose`)

const stuffySchema = new Schema(
  {
    name: { type: String, required: true },
    animalType: { type: String, required: true },
    desc: { type: String, required: true },
    role: { type: String, required: true },
    wearTear: { type: String, required: true },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Kid`,
      required: true,
    },
  },
  { timestamps: true }
)
const Stuffy = mongoose.model(`Stuffy`, stuffySchema)
module.exports = Stuffy
