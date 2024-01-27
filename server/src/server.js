const http = require('http')

const app = require('./app');

// destructured argument assigns the exported functionof loadPlanetsData from the required model file
const { loadPlanetsData } = require('./models/planets.model');


const PORT = process.env.PORT || 8000;

const server =http.createServer(app);

async function startServer() {
    await loadPlanetsData();
    server.listen(PORT, () =>{
        console.log(`Server listening on port ${PORT}...`)
    })
};

startServer();
