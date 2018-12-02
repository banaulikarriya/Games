const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    tournamentId: {
      type: Schema.ObjectId,
      ref: "Tournament"
    },
    teamName: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
