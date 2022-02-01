import React, { useEffect, useState } from 'react';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const iconURL = "https://openweathermap.org/img/wn/";
const iconURLEnd = ".png"

const styles = StyleSheet.create({
    weatherIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain'
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    date: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 16
    },
    temp: {
        fontWeight: 'bold',
        fontSize: 16
    },
    weatherType: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'darkgoldenrod'
    }
});

const generateDateObj = function(dt) {
    let date = {};

    const dateTime = new Date(dt * 1000);
    const dayMap = new Map();
    dayMap.set(0, 'Sunday');
    dayMap.set(1, 'Monday');
    dayMap.set(2, 'Tuesday');
    dayMap.set(3, 'Wednsday');
    dayMap.set(4, 'Thursday');
    dayMap.set(5, 'Friday');
    dayMap.set(6, 'Saturday');

    const monthMap = new Map();
    monthMap.set(0, 'January');
    monthMap.set(1, 'February');
    monthMap.set(2, 'March');
    monthMap.set(3, 'April');
    monthMap.set(4, 'May');
    monthMap.set(5, 'June');
    monthMap.set(6, 'July');
    monthMap.set(7, 'August');
    monthMap.set(8, 'September');
    monthMap.set(9, 'October');
    monthMap.set(10, 'November');
    monthMap.set(11, 'December');

    date['day'] = dateTime.getDate();
    date['month'] = monthMap.get(dateTime.getMonth());
    date['weekday'] = dayMap.get(dateTime.getDay());
    date['year'] = dateTime.getFullYear();
    
    return date;
}


export default WeatherDisplay = ({location}) => {
    const [lat, setLat] = useState(-1000);
    const [long, setLong] = useState(-1000);
    const [connectError, setConnectError] = useState(false);
    const [data, setData] = useState(null);
    const navigation = useNavigation();

    //Set the location
    useEffect(() => {
        if (!location)
            return;
        else
            console.log(location);
        
        setLat(location.coords.latitude);
        setLong(location.coords.longitude);
    }, [location]);

    //Get the weather
    useEffect(() => {
        if (lat < -180 || long < -180)
            return;

        console.log(lat + " " + long);
        fetch("https://pure-plateau-52218.herokuapp.com/weather?lat=" + lat + "&lon=" + long)
            .then(res => res.json())
            .then(json => {
                if (!json || json.error) {
                    console.error(json ? json.error : "No data.");
                    setConnectError(true);
                } else {
                    if (!json.current)
                        console.log(json);

                    json.current['date'] = generateDateObj(json.current.dt);
                    json.daily.forEach(d => {
                        d['date'] = generateDateObj(d.dt);
                    });
                    setData(json);
                    setConnectError(false);
                }
            }).catch(err => {
                console.log(err);
                setConnectError(true);
            });
    }, [lat, long])

    if (!connectError) {
        return (
            <View style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'lightcyan', borderWidth: 1, borderRadius: 15, borderStyle: 'solid', borderColor: 'darkblue'}}>
                {data && data.current && data.current.date && 
                <Pressable onPress={()=>navigation.push('forecast', {forecast: data.daily})}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={styles.header}>Current Weather at Your Location</Text>
                        <Image style={styles.weatherIcon} source={{ uri: iconURL + data.current.weather[0].icon + iconURLEnd }} />
                        <Text style={styles.temp}>{data.current.temp}&deg;C</Text>
                        <Text style={styles.weatherType}>{data.current.weather[0].description}</Text>
                        <Text style={styles.date}>
                            {data.current.date.weekday + " " + data.current.date.month + " " + data.current.date.day + ", " + data.current.date.year}
                        </Text>
                        <Text>Click me to view forecast.</Text>
                    </View>
                </Pressable>
                }
            </View>
        );
    } else {
        return (
            <View>
                <Text style={styles.errorText}>No weather data.</Text>
            </View>
        );
    }
}