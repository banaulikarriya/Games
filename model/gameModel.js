const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    team1: {
      type: Schema.ObjectId,
      ref: "Team"
    },
    team2: {
      type: Schema.ObjectId,
      ref: "Team"
    },
    tournamentId: {
      type: Schema.ObjectId,
      ref: "Tournament"
    },
    gameDate: {
      type: String,
      default: new Date()
    },
    team1Score: {
      type: Number,
      default: 0
    },
    team2Score: {
      type: Number,
      default: 0
    },
    winTeam: {
      type: Schema.ObjectId,
      ref: "Team",
      default: null
    },
    gameResult: {
      type: String,
      default: ""
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
