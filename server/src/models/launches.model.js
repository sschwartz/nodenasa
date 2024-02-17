const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');
const axios = require("axios");

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch = 
    {
        flightNumber: 1,
        mission: "Atlantis",
        rocket: "Explorer",
        launchDate: new Date("December 27, 2030"),
        target: "Kepler-296 f",
        customers: ['ZTM','NASA', 'SpaceX'],
        upcoming: true,
        success: true
    }

//saveLaunch(launch);

// launches.set( launch.flightNumber, launch); 

async function loadLaunchData() {
    console.log('Loading launch data from Spacex');

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',    
    });

    // const response = await axios.get('https://api.spacexdata.com/v4/launches', {params: {upcoming: true}});
    if (firstLaunch) {
        console.log ('Already loaded');
    }
    else {
        await populateLaunches();
    }
    
    
    
}


async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());

    //all queries have a then and therefore a promise so be sure to await here, and in the http version that calls this function
     return await launchesDatabase
        .find({}, {_id:0, __v:0})
        .limit(limit)
        .skip(skip) //in lieu of a page argument
        .sort({flightNumber: 1}); //1 for ascending, -1 for descending
    
}

async function populateLaunches() {
    const response = await axios.post( SPACEX_API_URL, 
        {
            "query": {},
            "options": {
                "pagination":false,
                "populate": [
                    {
                        "path": "rocket",
                        "select": {
                            "name": 1,
                        }
                    }, {
                        "path":"payloads",
                        "select" : {
                            "customers":1
                        }
                    }
                ]
            }
        });
    
    if (response.status !== 200) {
        console.log('problem downloading launch date');
        throw new Error('Launch data download failed');
    }    
    const launchData = response.data.docs;
    for (const launchDoc of launchData) {

        const payloads = launchDoc['payloads'];
        
        const customers = payloads.flatMap( (payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],                
            customers: customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success']
        }
        
        console.log(`${launch.flightNumber} ${launch.mission} `);

        await saveLaunch(launch);
    }
}

async function saveLaunch(data) {
   
    console.log(`Going to add `, data);
    console.log(`Flight number is `, data.flightNumber);
    
    const result = await launchesDatabase.findOneAndUpdate(
            { flightNumber: data.flightNumber },
            data,
            // { upsert: true, new: true }
            { upsert: true, new: true }
        );

    console.log(result);
    if (result.matchedCount === 0 && result.upsertedCount === 0) {
        
        throw new Error('Launch not added or updated');
        
    }
        
}

const DEFAULT_FLIGHT_NUMBER =100;

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');
    
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    } else {
        return latestLaunch.flightNumber;
    }
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function launchExists(launchId) {
    // const flightNumber = parseInt(launchId);
    // const launches = await launchesDatabase.find({flightNumber: Number(launchId)});
    // return (launches.length > 0);
    // return await launchesDatabase.findOne({flightNumber: Number(launchId)});
    return await findLaunch({ flightNumber: Number (launchId)});
    
}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch, { 
//         flightNumber: latestFlightNumber,
//         customers: ['US Govt'],
//         upcoming:true,
//         success:true
//         }));
// }

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    
    const planet = data.target;
    console.log(data);
    const targetExists = await planetsDatabase.findOne({keplerName: planet});

    if (!targetExists) throw new Error('No matching planet found');

    const newLaunch= Object.assign(launch, {
        success:true,
        upcoming:true,
        customers: ['SpaceX' ,'JSA'],
        flightNumber: newFlightNumber
    });
    
    console.log('New Launch is ', newLaunch);
    console.log('leaving sechdule functuin');
    await saveLaunch(newLaunch);
}




async function abortLaunch(flightNumber){

    let aborted;
    try {
        aborted = await launchesDatabase.updateOne(
            {
            flightNumber: Number(flightNumber)
            },
            {   upcoming: false,
                success: false 
            }
        )

    } catch(e) {
        throw new Error('Unable to scrub launch');
    }
    console.log(aborted);
    return aborted.modifiedCount === 1;
}

module.exports = {getAllLaunches , scheduleNewLaunch, abortLaunch, launchExists, loadLaunchData}