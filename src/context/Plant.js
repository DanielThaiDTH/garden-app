export default class Plant {
    plantID;
    id = -1;
    plantDate;

    constructor (plantObj) {
        this.id = plantObj.id;
        this.plantID = plantObj.plantID;
        this.plantDate = plantObj.plantingDate;
    }
}