export default class Plant {
    plantID;
    id = -1;
    plantDate;

    constructor (plantObj = null) {
        if (plantObj && plantObj instanceof Plant) {
            this.id = plantObj.id;
            this.plantID = plantObj.plantID;
            this.plantDate = plantObj.plantingDate;
        } else {
            this.id = -1;
            this.plantID = -1;
            this.plantDate = null;
        }
    }
}