import { API_URL } from "../service/Constants";
import { removeRisk } from "../utils";

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
            if (typeof plantObj.lastCheck === 'string')
                this.lastCheck = new Date(plantObj.lastCheck)
            else if (plantObj.lastCheck instanceof Date)
                this.lastCheck = plantObj.lastCheck;
            else
                this.lastCheck = null;
            this.lastCheck = plantObj.lastCheck ? new Date(plantObj.lastCheck) : new Date(0);
            this.waterDeficit = plantObj.waterDeficit ? parseFloat(plantObj.waterDeficit) : 0;
            console.log("# " + this.id + " deficit is " + this.waterDeficit);

        } else {
            this.id = -1;
            this.plantID = -1;
            this.plantDate = null;
            this.count = 0;
            this.widthOffset = 0;
            this.lengthOffset = 0;
            this.lastCheck = new Date(0);
            this.waterDeficit = 0;
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
        plant.waterDeficit = 0;
        plant.lastCheck = new Date(0);
        
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

    async updateWaterDeficit(token, gardenID, risk, callback) {
        console.log("Garden ID of " + gardenID);
        console.log("Plant ID of " + this.id);
        try {
            let res = await fetch(`${API_URL}/plant/water/${this.id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    gardenID: gardenID,
                    water: this.waterDeficit,
                    updateDate: new Date()
                })
            });
            if (res.ok) {
                console.log(this.id + " watering updated");
                if (this.waterDeficit <= 1/5) {
                    removeRisk("drought", this.id, risk);
                    if (callback instanceof Function)
                        callback();
                }
            } else {
                console.log("Could not update");
                console.log((await res.json()).error);
            }
        } catch(err) {
            console.log("Could not water due to connection issue");
            console.log(err.message);
        }
    }
}