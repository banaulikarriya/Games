const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tournamentSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    NoOfTeam: {
      type: Number,
      min: 2,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
