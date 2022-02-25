import React, { useEffect, useState, useRef } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Shadow } from 'react-native-shadow-2';

const iconURL = "https://openweathermap.org/img/wn/";
const iconURLEnd = ".png"

const styles = StyleSheet.create({
    weatherIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    errorText: {
        color: 'darkred',
        fontFamily: 'UbuntuBold'
    },
    date: {
        color: '#070707',
        fontFamily: 'UbuntuBold',
        fontSize: 18
    },
    high: {
        fontFamily: 'UbuntuBold',
        fontSize: 15
    },
    low: {
        fontFamily: 'UbuntuBold',
        fontSize: 15
    },
    weatherType: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
        color: 'darkgoldenrod'
    },
    listStyle: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 40
    },  
    itemView: {
        borderRadius: 15,
        backgroundColor: '#d0d0d0',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    itemViewShadow: {
        marginHorizontal: 25,
        maxHeight: Dimensions.get("window").height*0.25,
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
        return (<ActivityIndicator size="large" color = "#00ff00"/>);
    }
}

export default Forecast = ({navigation, route}) => {
    const [hasForecast, setHasForecast] = useState(false);
    const [data, setData] = useState(null);
    const [scrollRef, setScrollRef] = useState(null);

    useEffect(() => {
        if (!route.params.forecast)
            return;

            
        let temp = JSON.parse(JSON.stringify(route.params.forecast)); 
        temp = temp.map(d => {
            let dateObj = new Date(d.dt * 1000);
            d.y = dateObj.getFullYear();
            d.m = dateObj.getMonth() + 1;
            d.d = dateObj.getDate();
            d.iso = `${d.y}-${(d.m < 10 ? '0' : '') + d.m}-${(d.d < 10 ? '0': '') + d.d}`;
            console.log(d.iso);
            
            return d;
        });

        temp.marked = {}

        temp.forEach(d => {
            if (d.temp.min < 0) {
                temp.marked[d.iso] = { marked: true };
            }
        });
        setData(temp);
    }, [route.params.forecast]);

    useEffect(() => {
        if (!data)
            return;
        setHasForecast(true);
    }, [data])

    const daySelected = (day) => {
        let idx = -1;

        if (!data || !scrollRef) return;

        for (let i = 0; i < data.length && idx < 0; i++) {
            if (data[i].iso === day.dateString)
                idx = i;
        }
        
        if (idx && idx >= 0) {
            console.log(idx);
            scrollRef.scrollToIndex({index: idx});
        }
    };

    return (
        <View style={{flex: 1, margin: 15}}>
            {hasForecast && data &&
            <>
                <Calendar current={data[0].iso}
                          minDate={data[0].iso}
                          maxDate={data[data.length - 1].iso}
                          onDayPress={daySelected}
                          theme={{ selectedDayTextColor: 'orange', }}
                          markedDates={ data.marked }/>
                <FlatList data={data}
                    horizontal={true}
                    contentContainerStyle={styles.listStyle}
                    ref={(ref) => { setScrollRef(ref)}}
                    renderItem={({item}) => 
                    <Shadow containerViewStyle={styles.itemViewShadow}
                            offset={[3, 5]}
                            distance={5}>
                        <View style={styles.itemView}>
                            <WeatherItem data={item} />
                        </View>
                    </Shadow>
                    }
                    keyExtractor={(item, index) => { return index; }}
                />
            </>
            }
            {!hasForecast && 
            <View>
                    <ActivityIndicator size="large" color="#00ff00"/>
                    <Text style={styles.errorText}>No forecast is available.</Text>
            </View>}
        </View>
    );
}