import Garden from "./Garden";
import { API_URL } from "../service/Remote";

/**
 * Represents the active user account. Contains a list of gardens, a username and an id.
 * Provides control for 
 */
export default class Account {
    
    #gardens = [];

    /**
     * Creates the account.
     * @param {string} username 
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
        return "Garden deleted";
    }

    gardenCount() {
        return this.#gardens.length;
    }

    getGardenList() {
        return this.#gardens.map(g => g.name);
    }

    getGarden(name) {
        return this.#gardens.find(g => g.name === name);
    }

    getActiveGarden() {
        return this.getGarden(this.activeGarden);
    }
}