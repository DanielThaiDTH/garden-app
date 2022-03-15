import React, { useContext } from 'react';
import { Text, Image, View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import { API_URL } from '../service/Constants';
import AppContext from '../context/AppContext';

const iconURL = "https://openweathermap.org/img/wn/";
const iconURLEnd = ".png"

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lightcyan',
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: 'solid',
        borderColor: 'darkblue',
        marginHorizontal: 10
    },
    containerCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lightcyan',
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: 'solid',
        borderColor: 'darkblue',
        marginHorizontal: 10
    },
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
        fontFamily: 'UbuntuBold',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    date: {
        color: 'grey',
        fontFamily: 'UbuntuBold',
        fontSize: 16
    },
    temp: {
        fontFamily: 'UbuntuBold',
        fontSize: 16
    },
    weatherType: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
        color: 'darkgoldenrod'
    }
});


export default WeatherDisplay = ({nav, data}) => {
    const context = useContext(AppContext);
    const navigation = nav;

    if (data) {
        return (
            <View style={styles.container}>
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