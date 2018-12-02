const mongoose = require("mongoose");
const Tournament = require("../model/tournamentModel");
const Team = require("../model/teamModel");
const Game = require("../model/gameModel");
var robin = require("roundrobin");
const _ = require("lodash");

//function to get team and create team
async function getTeam(tournamentId, nameArray = null) {
  let query = { $and: [] };
  query.$and.push({ status: true });

  if (tournamentId) {
    query.$and.push({ tournamentId: tournamentId });
  }

  try {
    let teamsList = await Team.find(query)
      .select("_id")
      .exec();
    if (_.isEmpty(teamsList)) {
      //if team list is empty then create team
      let tournament = await Tournament.findById(tournamentId).exec();
      for (let i = 1; i <= tournament.NoOfTeam; i++) {
        let teamData = {
          tournamentId: tournament._id,
          teamName: `team ${i}`
        };
        let team = new Team(teamData);
        let add = await team.save();
      }
    }
    //get the list of all team
    let teamList = await Team.find(query)
      .select("_id")
      .exec();
    return teamList;
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("gameBoard", { err: errMsg });
  }
}

//function to create matches
async function createMatches(teamArray, tournamentId) {
  try {
    //get details of tournament
    let tornament = await Tournament.findById(tournamentId).exec();
    let tornamentStartDate = tornament.createdAt;
    let count = 0;

    //user of roundrobin to create games schedule
    let gamePairs = robin(teamArray.length, teamArray);
    let matchArray = [];
    for (let j in gamePairs) {
      for (let p in gamePairs[j]) {
        matchArray.push(gamePairs[j][p]);
      }
    }

    if (!_.isEmpty(matchArray)) {
      for (let pair of matchArray) {
        count = count + 2;
        let gameDate = await getDatePlus2(tornamentStartDate, count);
        //gameDate to insert in game model
        let gameData = {
          team1: pair[0],
          team2: pair[1],
          tournamentId: tournamentId,
          gameDate: gameDate
        };
        let gameObj = new Game(gameData);
        let game = await gameObj.save();
      }
    }
    return true;
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("gameBoard", { err: errMsg });
  }
}

//function to display game Board
async function gameBoard(req, res) {
  let query = { $and: [] };
  query.$and.push({ status: true });

  let tournamentId = req.params.tournamentId || req.body.tournamentId;

  if (tournamentId) {
    query.$and.push({ tournamentId: tournamentId });
  } else {
    //if tournament id not pass take last tournament id
    let tourn = await Tournament.find(query)
      .sort({ _id: -1 })
      .exec();
    let tournamentId = tourn[0]._id;
    query.$and.push({ tournamentId: tournamentId });
  }

  try {
    let matchList = await Game.find(query).exec();

    //check if match schedule is already created
    if (_.isEmpty(matchList)) {
      //team list
      let teamsList = await getTeam(tournamentId);

      //team list as array
      let teamArray = _.map(teamsList, "_id");
      //get the list matches of tornament
      let matchList = await createMatches(teamArray, tournamentId);
    }

    //get the list games
    let gameList = await Game.find(query)
      .populate([
        { path: "tournamentId", select: "name" },
        { path: "team1", select: "teamName" },
        { path: "team2", select: "teamName" },
        { path: "winTeam", select: "teamName" }
      ])
      .exec();

    //add url parameter and tournament list
    let tournamentList = await Tournament.find({ status: true }).exec();
    res.render("gameBoard", {
      gameList,
      URL: process.env.URL,
      tournamentList,
      tournamentName: gameList[0].tournamentId.name
    });
  } catch (err) {
    var errMsg = "There was Error " + err + "\n";
    res.render("gameBoard", { err: errMsg });
  }
}

//function to get date +2
function getDatePlus2(d, count) {
  let day = new Date(d.setDate(new Date().getDate() + count));
  let finaleDate = `${day.getDate().toString()}-${(
    day.getMonth() + 1
  ).toString()}-${day.getFullYear()}`;
  return finaleDate;
}

module.exports = {
  gameBoard
};
