const express = require('express');

const { getAllPlanets } = require('./planets.controller');
// const planetsController = require('./planets.controller')

const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);
// planetsRouter.get('/planets', planetsController.getAllPlanets);

module.exports = planetsRouter;