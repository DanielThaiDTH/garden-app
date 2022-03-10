import React from 'react';
import { 
    Alert,
    Platform
} from 'react-native';

import * as Location from 'expo-location';
import { SIM_MODE } from './Constants';

export const getCoordinates = async (context) => {
    if (context.location)
        return;

    console.log("Setting location");
    if (context.account && context.account.gardenCount() > 0 && context.account.activeGarden) {
        let garden = context.account.getGarden(context.account.activeGarden);
        context.setLocation({ coords: { latitude: garden.lat, longitude: garden.lon } });
    } else if (SIM_MODE && Platform.OS === 'ios') {
        //Appetize does not have location service
        let mock_location = { coords: { latitude: 43.829859, longitude: -79.5750729 } }
        context.setLocation(mock_location);
        Alert.alert("Using mock location of Toronto, Appetize does not provide location service on the simulator. \
                \   \   \   Set SIM_MODE in MainPage.js to false to use geolocation with an iOS device.");
    } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        context.setLocation(newLocation);
        if (!newLocation)
            Alert.alert("Could not obtain location")
    }
}