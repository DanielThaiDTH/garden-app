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
        } else {
            this.name = acc.username;
            this.id = acc.userID;
            this.#gardens = acc.gardens.map(g => new Garden(g));
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
}