import { createContext, useState, useContext, useMemo } from 'react';
import Account from "../model/Account";

export default AppContext = createContext({
    curUsername: "",
    setCurUsername: () =>{},
    token: "",
    setToken: () => {},
    account: null,
    setAccount: () => {},
    location: null,
    setLocation: () => {},
    plantInfo: null,
    setPlantInfo: () => {},
    zone: -1,
    setZone: () => {},
    weatherData: null,
    setWeatherData: () => {},
    risk: null,
    setRisk: () => {},
    getPlantName: () => {}
});