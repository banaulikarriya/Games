const mongoose = require("mongoose");
const Game = require("../model/gameModel");
const Team = require("../model/teamModel");
const Tournament = require("../model/tournamentModel");
const _ = require("lodash");

//function to get details of game
async function gameDetails(req, res) {
  let query = { $and: [] };
  query.$and.push({ status: true });

  if (req.params.id) {
    query.$and.push({ _id: req.params.id });
  }

  try {
    let game = await Game.findOne(query)
      .populate([
        { path: "tournamentId", select: "name" },
        { path: "team1", select: "teamName" },
        { path: "team2", select: "teamName" },
        { path: "winTeam", select: "teamName" }
      ])
      .exec();
    res.render("result", game);
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("result", { err: errMsg });
  }
}

//update game the result
async function saveGameResult(req, res) {
  let id = req.params.id;
  let data = req.body;
  if (data.winTeam == "") {
    delete data.winTeam;
  }
  try {
    let game = await Game.findOneAndUpdate({ _id: id }, data).exec();
    res.redirect("../gameBoard/" + game.tournamentId);
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("result", { err: errMsg });
  }
}

//function to display score board for a tournament
async function scoreBoard(req, res) {
  let query = { $and: [] };
  query.$and.push({ status: true });
  var tournamentId = req.params.tournamentId || req.body.tournamentId;

  if (tournamentId) {
    query.$and.push({ tournamentId: tournamentId });
  } else {
    //if tournament id not pass take last tournament id
    let tourn = await Tournament.find(query)
      .sort({ _id: -1 })
      .exec();
    var tournamentId = tourn[0]._id;
    query.$and.push({ tournamentId: tournamentId });
  }
  try {
    let teamList = await Team.find(query)
      .select("teamName")
      .populate([{ path: "tournamentId", select: "name" }])
      .exec();
    let tournamentList = await Tournament.find({ status: true }).exec();
    let scoreObj = { score: [] };

    //calculate total score
    for (let i = 0; i < teamList.length; i++) {
      let wenPlayedFirst = await Game.find({
        status: true,
        tournamentId: tournamentId,
        team1: teamList[i]._id
      })
        .select("team1Score")
        .exec();
      let wenPlayedSecond = await Game.find({
        status: true,
        tournamentId: tournamentId,
        team2: teamList[i]._id
      })
        .select("team2Score")
        .exec();
      let firstSum = _.sumBy(wenPlayedFirst, "team1Score");
      let secondSum = _.sumBy(wenPlayedSecond, "team2Score");
      let totalSum = firstSum + secondSum;
      scoreObj.score.push({
        _id: teamList[i]._id,
        team: teamList[i].teamName,
        finalScore: totalSum
      });
    }
    scoreObj.tournamentName = teamList[0].tournamentId.name;
    scoreObj.tournamentList = tournamentList;
    scoreObj.URL = process.env.URL;
    res.render("scoreBoard", scoreObj);
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("scoreBoard", { err: errMsg });
  }
}

//function remove the tournament
async function remove(req, res) {
  let id = req.params.id;
  try {
    let data = await Game.findOneAndUpdate(
      { _id: id },
      { $set: { status: false } },
      { new: true }
    ).exec();
    res.redirect("../gameBoard/" + data.tournamentId);
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("gameBoard", { err: errMsg });
  }
}

module.exports = {
  gameDetails,
  saveGameResult,
  scoreBoard,
  remove
};
