/**
 * Takes a date object from OpenWeatherMap and 
 * transforms it into a more usable form
 * @param {*} dt 
 * @returns A custom date object
 */
export const generateDateObj = function (dt) {
    let date = {};

    const dateTime = new Date(dt * 1000);
    const dayMap = new Map();
    dayMap.set(0, 'Sunday');
    dayMap.set(1, 'Monday');
    dayMap.set(2, 'Tuesday');
    dayMap.set(3, 'Wednsday');
    dayMap.set(4, 'Thursday');
    dayMap.set(5, 'Friday');
    dayMap.set(6, 'Saturday');

    const monthMap = new Map();
    monthMap.set(0, 'January');
    monthMap.set(1, 'February');
    monthMap.set(2, 'March');
    monthMap.set(3, 'April');
    monthMap.set(4, 'May');
    monthMap.set(5, 'June');
    monthMap.set(6, 'July');
    monthMap.set(7, 'August');
    monthMap.set(8, 'September');
    monthMap.set(9, 'October');
    monthMap.set(10, 'November');
    monthMap.set(11, 'December');

    //date['dt'] = dateTime;
    date['day'] = dateTime.getDate();
    date['month'] = monthMap.get(dateTime.getMonth());
    date['weekday'] = dayMap.get(dateTime.getDay());
    date['year'] = dateTime.getFullYear();

    return date;
}

/**
 * Filters plants by hardiness zone. Does nothing if any paramter is invalid.
 * @param {Array<Object>} results 
 * @param {Array<Object>} plantList 
 * @param {number} zone 
 * @returns A filtered array from the results parameter.
 */
export const filterSearchByZone = (results, plantList, zone) => {
    if (!Number.isInteger(zone) || zone < 0 || !results || !plantList)
        return results;

    let filtered = results.filter(plant => {
        let match = plantList.find(item => {
            return item.plantName === plant.name && (item.zones.length == 0 || item.zones.includes(zone));
        });
        return !!match;
    });


    return filtered;
};

/**
 * Calculates the risks for all gardens. T < 0C = frost, T > 35C = heat,
 * required water greater than 0.2in, drought
 * @param {*} weather 
 * @param {*} garden 
 * @returns 
 */
export const calculatePlantRisk = (weather, garden) => {
    let frostRisk = weather.daily.some(day => day.temp.min < 0);
    let heatRisk = weather.daily.some(day => day.temp.max > 35);
    
    let gardenRisk = { id: garden.id };
    gardenRisk.plantRisk = [];
    gardenRisk.risk = [];
    garden.getPlants().forEach(p => {
        if (p.plantDate instanceof Date) {
            let plantRisk = { id: p.id, risk: [] };
            
            if (frostRisk)
                plantRisk.risk.push("frost");

            if (heatRisk)
                plantRisk.risk.push("heat");

            if (p.waterDeficit > 1/5)
                plantRisk.risk.push("drought");

            gardenRisk.plantRisk.push(plantRisk);
        }
    });

    if (gardenRisk.plantRisk.some(pr => pr.risk.some(r => r === "frost")))
        gardenRisk.risk.push("frost");

    if (gardenRisk.plantRisk.some(pr => pr.risk.some(r => r === "drought")))
        gardenRisk.risk.push("drought");
    
    if (gardenRisk.plantRisk.some(pr => pr.risk.some(r => r === "heat")))
        gardenRisk.risk.push("heat");

    //console.log(gardenRisk);
    return gardenRisk;
}

export const canvasLine = function(x1, y1, x2, y2, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}