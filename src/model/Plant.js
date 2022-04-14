import { API_URL } from "../service/Constants";

export default class Plant {
    plantID;
    id = -1;
    plantDate;
    count;

    /**
     * Expects a plant information object that is returned from the backend API.
     * @param {*} plantObj 
     */
    constructor (plantObj = null) {
        if (plantObj) {
            this.id = plantObj.id;
            this.plantID = plantObj.plantID;

            // console.log('\n' + plantObj.plantingDate);
            //Convert to date object or null
            if (typeof plantObj.plantingDate === 'string')
                this.plantDate = new Date(plantObj.plantingDate)
            else if (plantObj.plantDate instanceof Date)
                this.plantDate = plantObj.plantingDate;
            else
                this.plantDate = null;

            // console.log(this.plantDate + '\n');

            this.count = plantObj.count ?? 0;
            this.widthOffset = plantObj.widthOffset;
            this.lengthOffset = plantObj.lengthOffset;
        } else {
            this.id = -1;
            this.plantID = -1;
            this.plantDate = null;
            this.count = 0;
            this.widthOffset = 0;
            this.lengthOffset = 0;
        }
    }

    static createPlant(speciesID = null, plantingDate = null) {
        let plant = new Plant();

        if (!(plantingDate instanceof Date) && !(typeof plantingDate === 'string'))
            plantingDate = null;
        else if (typeof plantingDate === 'string')
            plantingDate = new Date(plantingDate);
    
        if (speciesID) plant.plantID = speciesID;
        plant.plantDate = plantingDate;
        
        return plant
    }

    async updateOffset(userID, gardenID, token, width, length) {
        try {
            let res = await fetch(`${API_URL}/plant/offset/${this.id}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ 
                    userID: userID,
                    gardenID: gardenID,
                    width: width,
                    length: length
                 })
            });
            if (res.ok) {
                this.widthOffset = width;
                this.lengthOffset = length;
                return true;
            } else {
                console.log("Unable to update plant offset");
                console.log((await res.json()).error);
                return false;
            }
        } catch (err) {
            console.log("Could not update offsets due to connection issue");
            console.log(err.message);
            return false;
        }
    }
}