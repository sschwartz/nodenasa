const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');
const util = require('util')

function httpGetAllLaunches(req, res) {
    // return res.status(200).json(Array.from(launches.values()));
   
    //ideally this controller function should not need to knwo
    //how to conver the output, make the model function launches() 
    //return the JSON
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res) {
    try {
        // console.log(req.body);
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

module.exports =  { httpGetAllLaunches, httpAddNewLaunch }

