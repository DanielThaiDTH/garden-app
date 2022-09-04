import { API_URL } from "./Constants";
import { Alert } from "react-native";
const IN_TO_MM = 25.4;

export const calculatePrecipWater = function(garden, context, warn = true) {
    let plants = garden.getPlants();
    fetch(`${API_URL}/weatherhistory?lat=${context.location.coords.latitude}&lon=${context.location.coords.longitude}`)
    .then((res) => {
        if (res.ok) {
            res.json().then(weather => {
                plants.forEach(p => {
                    let pInfo = context.plantInfo.find((pi) => pi.UID === p.plantID);
                    let dailyWaterNeed = (pInfo.waterInchPerWeek/7); //Historical weather only goes up to 5
                    console.log("# " + p.id + " deficit is " + p.waterDeficit);
                    console.log("Water need is " + dailyWaterNeed);
                    
                    weather.forEach(wd => { 
                        if (p.plantDate && (!p.lastCheck || wd.current.dt > Math.floor(p.lastCheck.valueOf()/1000))) {
                            p.waterDeficit += dailyWaterNeed;
                            console.log("Rain value is " + wd.current.rain);
                            if (wd.current.rain) {
                                if (wd.current.rain["1h"])
                                    p.waterDeficit -= wd.current.rain["1h"] / IN_TO_MM;
                                else
                                    p.waterDeficit -= wd.current.rain / IN_TO_MM;
                            }
                        }
                    });

                    if (isNaN(p.waterDeficit))
                        p.waterDeficit = 0;

                    if (p.plantDate) {
                        if (p.waterDeficit > 0) {
                            console.log(`Plant #${p.id} has a deficit of ${p.waterDeficit}`);
                            if (warn)
                                Alert.alert("Your plants that need watering in your " + garden.name + " garden");
                        }
    
                        p.updateWaterDeficit(context.token, garden.id, context.risk);
                    }
                });
            });
        } else {
            res.json().then(err => console.error(err.error));
            Alert.alert("Access to historical weather failed."); 
        }
    }).catch(err => {
        console.error(err.message);
        Alert.alert("Access to historical weather failed.");
    });
    
}


export const futureWater = function(deficit, context, plantID) {
    let weather = context.weatherData;
    let total_rain = 0;
    let pInfo = context.plantInfo.find((pi) => pi.UID === plantID);
    let dailyWaterNeed = (pInfo.waterInchPerWeek / 7);
    let consumption = 0;


    //console.log(weather);

    weather.daily.forEach(w => { 
        if (w.rain)
            total_rain += w.rain;
        consumption += dailyWaterNeed;
    });

    return deficit - total_rain / IN_TO_MM + consumption;
}