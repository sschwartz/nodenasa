const { getAllLaunches, scheduleNewLaunch, abortLaunch, launchExists } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');
// const launches  = require('./launches.mongo');
// const planets  = require('./planets.mongo');



async function httpGetAllLaunches(req, res) {
    // return res.status(200).json(Array.from(launches.values()));
   
    //ideally this controller function should not need to knwo
    //how to conver the output, make the model function launches() 
    //return the JSON

    console.log(req.query);
    
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req,res) {
    try {
        const launch = req.body
        launch.launchDate = new Date(launch.launchDate);       
        
        if (isNaN(launch.launchDate)) throw new Error('invalid date');

        if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
            throw new Error('missing field or empty field value');
        }
        
        await scheduleNewLaunch(launch);
        res.status(201).json(launch);
               
    } catch(e) {
        res.status(400).json({"error": e.message});
    };

}

async function httpAbortLaunch(req,res) {
    const flightNumber = req.params.id;

    const exists = await launchExists(flightNumber);

    if (!exists) {
        return res.status(404).json({ error: "Launch not found"})
    }

    try {        
        const abortedLaunch = await abortLaunch(flightNumber);
        // res.status(200).json(abortedLaunch);
        if (!abortedLaunch) {
            return res.status(400).json({error: "launch not aborted"})
        } else {
            return res.status(200).json({ok: true});
        }
        res.status(200).json({})

    } catch(e){
        console.log(`Error was ${e.message}`);
        res.status(400).json({error:e.message});
    }    
}
    

module.exports =  { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }

