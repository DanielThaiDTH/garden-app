import Garden from "./Garden";
import { API_URL } from "../service/Constants";

/**
 * Represents the active user account. Contains a list of gardens, a username and an id.
 * Provides control for 
 */
export default class Account {
    
    #gardens = [];

    /**
     * Creates the account.
     * @param {Object} acc 
     */
    constructor(acc = null) {        
        if (!acc) {
            this.name = null;
            this.id = null;
            this.#gardens = null;
            this.activeGarden = null;
        } else {
            this.name = acc.username;
            this.id = acc.userID;
            this.#gardens = acc.gardens.map(g => new Garden(g));
            this.activeGarden = (this.#gardens && this.#gardens.length > 0 ) ? this.#gardens[0].name : null;
            this.activeGardenIdx = this.activeGarden ? 0 : -1;
        }
    }

    gardenCount() {
        return this.#gardens.length;
    }

    async addGarden(newGarden, token) {
        if (newGarden instanceof Garden) {
            let match = this.#gardens.find((g) => g.name === newGarden.name);

            console.log(newGarden);
            
            if (!match) {
                try {
                    let res = await fetch(API_URL + "/garden", {
                        method: "POST",
                        headers: { 'Content-Type': "application/json", 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify({ 
                            userID: this.id, 
                            gardenName: newGarden.name, 
                            lat: newGarden.lat,
                            lon: newGarden.lon,
                            zone: newGarden.zone,
                            createdAt: newGarden.createdAt
                        })
                    });

                    if (res.ok) {
                        let newID = (await res.json()).newID;
                        newGarden.id = newID;
                        this.#gardens.push(newGarden);
                    } else {
                        console.log("Unable to add new Garden. Either it is the wrong user or the name is already used and app state does not reflect it.");
                        console.log((await res.json()));
                        return false;
                    }
                } catch (err) {
                    console.log("No access to database. Due to " + err.message);
                    return false;
                }
            }

            return !!!match; //to bool
        } else {
            throw new Error("Attempted to add non-Garden type.");
        }
    }

    async removeGarden(name, token) {
        console.log(name);
        let garden = this.#gardens.find(g => g.name === name);
        try {
            let res = await fetch(API_URL + "/garden", { 
                method: "DELETE", 
                headers: { 'Content-Type': "application/json", 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ gardenID: garden.id, gardenName: name, userID: this.id })
            });
            if (!res.ok) {
                return res.error
            }
        } catch (err) {
            console.log(err.message);
            return "Could not access system.";
        }

        this.#gardens = this.#gardens.filter(g => g.name !== name);
        this.activeGarden = (this.#gardens.length > 0) ? this.#gardens[0].name : null;
        return "Garden deleted";
    }

    gardenCount() {
        return this.#gardens.length;
    }

    getGardenList() {
        return this.#gardens.map(g => g.name);
    }

    getGardenCount() {
        if (this.#gardens)
            return this.#gardens.length;
        else
            return 0;
    }

    getGarden(name) {
        return this.#gardens.find(g => g.name === name);
    }

    getGardenAt(idx) {
        if (Number.isInteger(idx) && idx >= 0)
            return this.#gardens[idx];
        else
            return null;
    }

    setActiveGarden(gardenName) {
        for (let i = 0; i < this.#gardens.length; i++) {
            if (this.#gardens[i].name === gardenName) {
                this.activeGarden = gardenName;
                this.activeGardenIdx = i;
                break;
            }
        }
    }

    /**
     * Returns the active garden object
     * @returns Garden
     */
    getActiveGarden() {
        return this.getGarden(this.activeGarden);
    }

    activeGardenHasPlant(speciesID) {
        return this.getActiveGarden().hasPlant(speciesID);
    }
}