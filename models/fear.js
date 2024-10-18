const mongoose = require(`mongoose`)
const { Schema } = require(`mongoose`)

const fearSchema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    severity: { type: Number, required: true, min: 0, max: 100, default: 50 },
    frequency: { type: Number, required: true, min: 0, max: 100, default: 50 },
  },
  { timestamps: true }
)
const Fear = mongoose.model(`Fear`, fearSchema)
module.exports = Fear
