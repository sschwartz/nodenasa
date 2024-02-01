const express = require('express');
const launchesRouter = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');


launchesRouter.get('/launches', httpGetAllLaunches);
launchesRouter.post('/launches', httpAddNewLaunch);
launchesRouter.delete('/launches/:id', httpAbortLaunch)
/* Alternate approach
in app.js when defining the use Router line
do app.use('/launches',launchesRouter) and it will prepend /launches for any routes defined in the router
so in the controller here you can do 
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
*/


module.exports = launchesRouter;