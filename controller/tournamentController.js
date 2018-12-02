const mongoose = require("mongoose");
const Tournament = require("../model/tournamentModel");

//function to display all tournaments
async function tournamentView(req, res) {
  let query = { $and: [] };
  query.$and.push({ status: true });

  try {
    let list = await Tournament.find(query).exec();
    res.render("tournaments", { list: list });
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("tournaments", { err: errMsg });
  }
}

//function to add Tournament
async function createTournament(req, res) {
  try {
    let data = req.body;
    let TournamentData = new Tournament(data);
    let tournament = await TournamentData.save();
    res.redirect("../tournaments");
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.redirect("../tournaments");
  }
}

//function remove the tournament
async function removeTournament(req, res) {
  let id = req.params.id;
  try {
    let data = await Tournament.findOneAndUpdate(
      { _id: id },
      { $set: { status: false } },
      { new: true }
    ).exec();
    res.redirect("../tournaments");
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("tournaments", { err: errMsg });
  }
}

module.exports = {
  tournamentView,
  createTournament,
  removeTournament
};
