// The first line is importing the entire module exported from 'planets.model' and assigning it to a constant named 'planets'.
// This would be used when the module exports an object, function, class, etc., as a default export.
// const planets = require('../../models/planets.model');

// The second line is using object destructuring to import only the 'planets' property from the exported module object.
// This is used when the module exports an object with multiple properties and you want to use only specific properties.
const { getAllPlanets } = require('../../models/planets.model');

console.log(`The planets controllers says getAllPlanets is a ${getAllPlanets}`);
// const planets = [];

function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets());
}

module.exports =  { httpGetAllPlanets }