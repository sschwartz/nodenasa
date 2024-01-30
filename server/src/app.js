const express = require('express')
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');


const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

// reminder: evaluated in order!

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('short'));

app.use(express.json()); // middleware to include JSON parsing

app.use(express.static(path.join(__dirname,'..','public'))); // route requests for static assets to public folder
app.use(planetsRouter); //use like middleware
app.use(launchesRouter);
app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'public','index.html'))
})
module.exports = app;