import React, { useEffect, useState } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const iconURL = "https://openweathermap.org/img/wn/";
const iconURLEnd = ".png"

const styles = StyleSheet.create({
    weatherIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold'
    },
    date: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 18
    },
    high: {
        fontWeight: 'bold',
        fontSize: 15
    },
    low: {
        fontWeight: 'bold',
        fontSize: 15
    },
    weatherType: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'darkgoldenrod'
    }
});

const WeatherItem = ({ data }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        if (!data)
            return;
        setWeather(data);
    }, [data])

    if (weather) {
        return (
            <View style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                <Text style={styles.date}>
                    {weather.date.weekday + " " + weather.date.month + " " + weather.date.day}
                </Text>
                <Image style={styles.weatherIcon} source={{ uri: iconURL + weather.weather[0].icon + iconURLEnd }} />
                <Text style={styles.high}>High: {weather.temp.max}&deg;C</Text>
                <Text style={styles.low}>Low: {weather.temp.min}&deg;C</Text>
                <Text style={styles.weatherType}>{weather.weather[0].description}</Text>
            </View>
        );
    } else {
        return (<Text>Loading forecast...</Text>);
    }
}

export default Forecast = ({navigation, route}) => {
    const [hasForecast, setHasForecast] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!route.params.forecast)
            return;
        
        setData(route.params.forecast);
    }, [route.params.forecast]);

    useEffect(() => {
        if (!data)
            return;
        setHasForecast(true);
    }, [data])

    return (
        <View style={{flex: 1, margin: 15}}>
            {hasForecast && data &&
                <FlatList data={data}
                    renderItem={({item}) => 
                        <View>
                            <WeatherItem data={item} />
                        </View>
                    }
                    keyExtractor={(item, index) => { return index; }}
                />
            }
            {!hasForecast && <Text style={styles.errorText}>No forecast is available.</Text>}
        </View>
    );
}