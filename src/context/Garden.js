import Plant from "./Plant";

export default class Garden {
    id = -1;
    lat;
    lon;
    zone;
    createdAt;
    name;
    #plants = [];

    constructor(gardenObj) {
        this.id = gardenObj.id;
        this.lat = gardenObj.lat;
        this.lon = gardenObj.lon;
        this.zone = gardenObj.zone;
        this.name = gardenObj.name;
        this.createdAt = gardenObj.createdAt;
        this.#plants = gardenObj.plants.map(p => new Plant(p));
    }

    addPlant(plant) {
        if (plant instanceof Plant) {
            let match = this.#plants.find((p) => p.id !== -1 && p.id === plant.id);

            if (!match) {
                this.#plants.push(plant);
            }

            return !!match; //to bool
        } else {
            throw new Error("Not a plant");
        }
    }

    removePlant(id) {
        this.#plants = this.#plants.filter(p => p.id !== id);
    }
}