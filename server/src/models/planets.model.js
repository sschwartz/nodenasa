// const planets = [
//     { id:1, name: 'Pluto' } ,
//     { id:2, name: 'Venus' } ,
// ]

const fs = require('fs')
const { parse } = require('csv-parse');
const path = require('path');

const filePath = path.join(__dirname,'..','..','data');
const habitablePlanets =[];

function isHabitablePlanet(planet) {
    return (planet.koi_disposition === 'CONFIRMED' && planet.koi_insol > 0.36 && planet.koi_insol <1.11
    && planet.koi_prad < 1.6 );
}

const dataPath = 
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
    })
    .on('end', () => {
        console.log(`${habitablePlanets.length} items deemed habitable`);
        // console.log(results);
        console.log(habitablePlanets.map( (planet => {
            return planet.kepler_name
        })))
    });

console.log(habitablePlanets.length);

module.exports = habitablePlanets;