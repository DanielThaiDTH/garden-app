export default class Plant {
    plantID;
    id = -1;
    plantDate;
    count;

    constructor (plantObj = null) {
        if (plantObj) {
            this.id = plantObj.id;
            this.plantID = plantObj.plantID;
            this.plantDate = plantObj.plantingDate;
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

        if (!plantingDate instanceof Date)
            plantingDate = null;
        if (speciesID) plant.plantID = speciesID;
        plant.plantDate = plantingDate;
        
        return plant
    }
}