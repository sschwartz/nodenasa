const express = require('express');
const planetsRouter = express.Router();

const { httpGetAllPlanets } = require('./planets.controller');
// const planetsController = require('./planets.controller')

planetsRouter.get('/planets', httpGetAllPlanets);
// planetsRouter.get('/planets', planetsController.getAllPlanets);

module.exports = planetsRouter;