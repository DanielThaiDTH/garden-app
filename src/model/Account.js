import Garden from "./Garden";

/**
 * Represents the active user account.
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
            this.activeGarden = (this.#gardens && this.#gardens.length > 0 ) ? this.#gardens.at(0).name : null;
        }
    }

    get gardenCount() {
        return this.#gardens.length;
    }

    addGarden(newGarden) {
        if (newGarden instanceof Garden) {
            let match = this.#gardens.find((g) => g.name === newGarden.name);
            
            if (!match) {
                this.#gardens.push(newGarden);
            }

            return !!match; //to bool
        } else {
            throw new Error("Attempted to add non-Garden type.");
        }
    }

    removeGarden(name) {
        this.#gardens = this.#gardens.filter(g => g.name !== name);
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
}