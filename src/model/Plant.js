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
        } else {
            this.id = -1;
            this.plantID = -1;
            this.plantDate = null;
            this.count = 0;
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
}