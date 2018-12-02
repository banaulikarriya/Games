var express = require("express");
var router = express.Router();

//import all controller
var userController = require("../controller/userController");
var tournamentController = require("../controller/tournamentController");
var teamController = require("../controller/teamController");
var gameController = require("../controller/gameController");

/* route for login and register */
router.get("/", userController.getlogin);
router.get("/register", userController.getRegister);
router.post("/register", userController.addUser);
router.post("/login", userController.login);

/* route for tournament */
router.get("/tournaments", tournamentController.tournamentView);
router.post("/createTournament", tournamentController.createTournament);
router.get("/remove/:id", tournamentController.removeTournament);

/* route for game board */
router.get("/gameBoard/:tournamentId?", teamController.gameBoard);
router.get("/game/:id", gameController.gameDetails);
router.post("/saveGameResult/:id", gameController.saveGameResult);
router.post("/filterGameBord", teamController.gameBoard);
router.get("/removeGame/:id", gameController.remove);

/* route for score board */
router.get("/scoreBoard/:tournamentId?", gameController.scoreBoard);
router.post("/filterScoreBord", gameController.scoreBoard);

module.exports = router;
