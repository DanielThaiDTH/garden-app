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