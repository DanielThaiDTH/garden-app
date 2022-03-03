import Garden from "../src/model/Garden";
import Plant from "../src/model/Plant";
import Account from "../src/model/Account";
import { DEV_API_URL } from "../src/service/Remote";
const axios = require('axios').default;

jest.setTimeout(7500);

test('Empty constructor for Garden makes an empty garden', () => {
    let garden = new Garden();

    expect(garden).toBeTruthy();
});

// test('One-shot test adding plant with date', async () => {
//     let res = await axios.post(`${DEV_API_URL}/login`, { username: "b", password: "b"});

//     const token = res.data.id_token;
//     res = await axios.post(DEV_API_URL + "/plant/" + 1, { gardenID: 2, userID: 2, date: new Date() }, {
//         headers: { 'Content-Type': "application/json", 'Authorization': 'Bearer ' + token }
//     });
//     //let status = await account.getActiveGarden().addPlant(plant, json.id_token, 2);
//     expect(res.status === 200).toBeTruthy();
// });

//Noted: timestamp is a string
test('Timestamp test for plant with timestamp', async () => {
    let res = await axios.post(`${DEV_API_URL}/login`, { username: "b", password: "b" });
    const token = res.data.id_token;

    res = await axios.get(`${DEV_API_URL}/account`, { headers: { 'Authorization': 'Bearer ' + token } });
    res.data.gardens.forEach(g => g.plants.forEach(gp => {
        if (gp.plantingDate) {
            console.log(gp.plantingDate);
            console.log(typeof gp.plantingDate)
        }
    }));
});