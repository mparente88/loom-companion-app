const mongoose = require(`mongoose`)
const { Schema } = require(`mongoose`)

const kidSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true, default: 10 },
    desc: { type: String, required: true },
    favStuffy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Stuffy`,
      required: false,
    },
    mainFear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Fear`,
      required: false,
    },
    otherFears: [
      { type: mongoose.Schema.Types.ObjectId, ref: `Fear`, required: false },
    ],
    sleepQual: { type: Number, required: true, min: 0, max: 100, default: 100 },
    nightmareCt: { type: Number, required: true, default: 0 },
    notes: { type: String, required: false },
  },
  { timestamps: true }
)
const Kid = mongoose.model(`Kid`, kidSchema)
module.exports = Kid
