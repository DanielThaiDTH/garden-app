import Plant from "./Plant";
import { API_URL } from "../service/Remote";

export default class Garden {
    id = -1;
    lat;
    lon;
    zone;
    createdAt;
    name;
    #plants = [];

    constructor(gardenObj) {
        this.id = gardenObj.id ?? -1;
        this.lat = gardenObj.lat;
        this.lon = gardenObj.lon;
        this.zone = gardenObj.zone ?? -1;
        this.name = gardenObj.name;
        this.createdAt = gardenObj.createdAt;
        if (Array.isArray(gardenObj.plants))
            this.#plants = gardenObj.plants.map(p => new Plant(p));
        else
            this.#plants = [];
    }

    async addPlant(plant, token, userID) {
        if (plant instanceof Plant) {
            let match = this.#plants.find((p) => p.id !== -1 && p.id === plant.id);

            if (!match) {
                try {
                    let res = await fetch(API_URL + "/plant/" + plant.plantID, {
                        method: "POST",
                        headers: { 'Content-Type': "application/json", 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ gardenID: this.id, userID: userID })
                    });
                    if (res.ok) {
                        let newPlants = (await res.json()).updatedPlants;
                        this.#plants = newPlants.map(p => new Plant(p));
                        //this.#plants.push(plant);
                    } else {
                        console.log("Unable to add new plant due to database error");
                        console.log((await res.json()));
                        return false;
                    }
                } catch(err) {
                    console.log("No access to database. Due to " + err.message);
                    return false;
                }
            }

            return !!!match; //to bool
        } else {
            throw new Error("Not a plant");
        }
    }

    async removePlant(id, token, userID) {
        let status = false;

        if (this.#plants.find(p => p.id === id)) {
            try {
                let res = await fetch(API_URL + "/plant/" + id, {
                    method: "DELETE",
                    headers: { 'Content-Type': "application/json", 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ userID: userID, gardenID: this.id })
                });
                if (res.ok) {
                    let isDeleted = (await res.json()).deleted;
                    console.log(isDeleted);
                    if (isDeleted) {
                        this.#plants = this.#plants.filter(p => p.id !== id);
                        status = true;
                    }   
                } else {
                    console.log((await res.json()).error);
                }
            } catch(err) {
                console.log("No access to database. Due to " + err.message);
            }
        }

        return status;
    }

    hasPlant(speciesID) {
        let found = this.#plants.find(p => p.plantID === speciesID);
        console.log(this.#plants);
        console.log(speciesID);

        return !!found;
    }

    getPlants() {
        return this.#plants ?? [];
    }

    getPlant(id) {
        return this.#plants.find(p => p.id === id) ?? {};
    }
}