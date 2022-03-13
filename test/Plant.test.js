import Plant from "../src/model/Plant";
import { DEV_API_URL } from "../src/service/Constants";

describe('Using Plant constructor with no parameter returns the correct configuration', () => {
    let plant;

    beforeAll(() => {
        plant = new Plant();
    });

    test('Empty plant object has id of -1', () => {
        expect(plant.id).toBe(-1);
    });

    test('Empty plant object has plant species ID of -1', () => {
        expect(plant.plantID).toBe(-1);
    });

    test('Empty plant object has null plant date', () => {
        expect(plant.plantDate).toBeNull();
    });
});


describe('Testing createPlant static function with correct parameters', () => {
    let plant;
    let date;
    
    beforeAll(() => {
        date = new Date();
        plant = Plant.createPlant(1, date);
    });

    test('Plant plantDate member stores a date object', () => {
        expect(plant.plantDate instanceof Date).toBeTruthy();
    });

    test('Plant plantDate member equals to date used in the factory method', () => {
        expect(plant.plantDate.getTime() === date.getTime()).toBeTruthy();
    });

    test('Garden plant id is still -1', () => {
        expect(plant.id).toBe(-1);
    });
});