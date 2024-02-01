const { getAllLaunches, addNewLaunch, abortLaunch, launchExists } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    // return res.status(200).json(Array.from(launches.values()));
   
    //ideally this controller function should not need to knwo
    //how to conver the output, make the model function launches() 
    //return the JSON
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res) {
    try {
        const launch = req.body
        launch.launchDate = new Date(launch.launchDate);       
        
        if (isNaN(launch.launchDate)) throw new Error('invalid date');

        if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
            throw new Error('missing field or empty field value');
        }
        
        addNewLaunch(launch);
        res.status(201).json(launch);
               
    } catch(e) {
        res.status(400).json({"error": e.message});
    };

}

function httpAbortLaunch(req,res) {
    const flightNumber = req.params.id;

    if (!launchExists(flightNumber)) {
        return res.status(404).json({ error: "Launch not found"})
    }

    try {        
        const abortedLaunch = abortLaunch(flightNumber);
        res.status(201).json(abortedLaunch);
    } catch(e){
        console.log(`Error was ${e.message}`);
        res.status(400).json({error:e.message});
    }    
}
    

module.exports =  { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }

