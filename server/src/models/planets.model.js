const fs = require('fs')
const { parse } = require('csv-parse');
const path = require('path');

const planets = require('./planets.mongo');

const filePath = path.join(__dirname,'..','..','data');
// const habitablePlanets =[];

function isHabitablePlanet(planet) {
    return (planet.koi_disposition === 'CONFIRMED' && planet.koi_insol > 0.36 && planet.koi_insol <1.11
    && planet.koi_prad < 1.6 );
}


function loadPlanetsData() {
    return new Promise((resolve,reject) => {
        fs.createReadStream(filePath + '/kepler_data.csv')
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on("data", async (data) => {
            if (isHabitablePlanet(data)) {
                // habitablePlanets.push(data) ;
                savePlanet(data);
            }
        })
        .on('error', (e) => {
            console.log(e.toString());
            reject(e.toString());
        })
        .on('end',async () => {
            // console.log(habitablePlanets.map( (planet) => {
            //     return planet.kepler_name
            // })
            console.info('Load complete');
            const planetCount = (await getAllPlanets()).length;


            console.log(`${planetCount} items deemed habitable`);

            resolve();
            //resolve fullfills the promise so bootup can continue
            //don't need to pass in data to resolve because we're already exporting the data in the habitablePlanets array
        })
    })
}

async function getAllPlanets(){
    // return habitablePlanets;
    return await planets.find({}, {
        '_id' :0,
        '__v': 0
    })
    //second arg can be list of fieldnames to return, or {} for all
    // or -name to exclude or { name:1 or name:0  } to include exclude

}

async function savePlanet(planet) {
    try {
        await planets.updateOne(
            { keplerName: planet.kepler_name},
            { keplerName: planet.kepler_name},
            { upsert:true}
        )
        } catch(e) {
        console.error(`Couldnt save planet: ${e}`);
    };
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}