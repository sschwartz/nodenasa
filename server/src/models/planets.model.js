const fs = require('fs')
const { parse } = require('csv-parse');
const path = require('path');

const filePath = path.join(__dirname,'..','..','data');
const habitablePlanets =[];

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
        .on("data", (data) => {
            if (isHabitablePlanet(data)) habitablePlanets.push(data) ;
        })
        .on('error', (e) => {
            console.log(e.toString());
            reject(e.toString());
        })
        .on('end', () => {
            console.log(habitablePlanets.map( (planet) => {
                return planet.kepler_name
            }));

            console.log(`${habitablePlanets.length} items deemed habitable`);

            resolve();
            //resolve fullfills the promise so bootup can continue
            //don't need to pass in data to resolve because we're already exporting the data in the habitablePlanets array
        })
    })
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
}