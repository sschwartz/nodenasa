
const launches= new Map();

let latestFlightNumber = 1410;

const launch = 
    {
        flightNumber: 1410,
        mission: "Atlantis",
        rocket: "Explorer",
        launchDate: new Date("December 27, 2030"),
        target: "Kepler-221b",
        customers: ['ZTM','NASA', 'SpaceX'],
        upcoming: true,
        success: true
    }


launches.set( launch.flightNumber, launch); 

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, { 
        flightNumber: latestFlightNumber,
        customers: ['US Govt'],
        upcoming:true,
        success:true
        }));
}


function launchExists(launchId) {
    const flightNumber = parseInt(launchId);
    return launches.has(flightNumber);
}

function abortLaunch(flightNumber){
    // if truly deleting launches.delete(flightNumber);   
    
    const abortedLaunch = launches.get(Number(flightNumber));
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
}

module.exports = {getAllLaunches ,addNewLaunch, abortLaunch, launchExists}