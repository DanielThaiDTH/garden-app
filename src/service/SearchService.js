import { API_URL } from "./Constants";

/**
 * Filters plants by hardiness zone. Does nothing if any paramter is invalid.
 * @param {Array<Object>} results 
 * @param {Array<Object>} plantList 
 * @param {number} zone 
 * @returns A filtered array from the results parameter.
 */
const filterSearchByZone = (results, plantList, zone) => {
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
 * Searches plants using the given text. The context is used for 
 * the climate data for filtering. The setData parameter should be 
 * a callback that sets a React state variable. Returns an error message.
 * @param {string} text 
 * @param {boolean} filterOn 
 * @param {*} context 
 * @param {callbackFn} setData
 * @returns {Promise<string>} A message if something went wrong, null if ok
 */
export const searchPlant = async (text, context, setData, filterOn = false) => {
    try {
        let res = await (await fetch(`${API_URL}/search?q=${text}`)).json();
        console.log(res);
        if (res.error) {
            return res.error;
        } else {
            if (filterOn) 
                res = filterSearchByZone(res, context.plantInfo, context.zone);
            
            setData(res);
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
};


/**
 * 
 * @param {string} query 
 * @param {ReactSetStateFn} setData 
 * @param {Array<number>} tags 
 * @returns The results of the search
 * @throws If there was a search error
 */
export const searchBlog = async (query, tags) => {
    try {
        let res = await (
            await fetch(`${API_URL}/blog/search`, 
            {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ query: query, tags: tags })
            }
        )).json();
        console.log(res);
        if (res.error) {
            throw new Error(res.error);
        } else {
            return res;
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};