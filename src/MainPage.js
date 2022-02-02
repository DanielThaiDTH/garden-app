import React, { useEffect, useState, useContext } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import WeatherDisplay from './WeatherDisplay';
import AppContext from './context/AppContext';

const SIM_MODE = true;
let MainPage;
let styles;

export default MainPage = ({navigation}) => {
    const [isLoading, setLoading] = useState(false);
    const [connectError, setConnectError] = useState(false);
    const [location, setLocation] = useState(null);
    const [data, setData] = useState(null);
    const [text, setText] = useState('');
    const [err, setErr] = useState('');
    const { curUsername, setCurUsername, token, setToken } = useContext(AppContext);

    useEffect(() => {
        (async () => {
            if (location)
                return;
            
            //Appetize does not have location service
            if (SIM_MODE && Platform.OS === 'ios') {
                let mock_location = { coords: { latitude: 43.829859, longitude: -79.5750729 } }
                setLocation(mock_location);
                Alert.alert("Using mock location of Toronto, Appetize does not provide location service on the simulator. \
                \   \   \   Set SIM_MODE in MainPage.js to false to use geolocation with an iOS device.");
            } else {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    return;
                }

                let newLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
                setLocation(newLocation);
                if (!newLocation)
                    Alert.alert("Could not obtain location")
            }
            //console.log(newLocation);
        })();
    }, []);

    let search = (text) => {
        setLoading(true);
        //console.log(`username: ${curUsername} token: ${token}`);
        fetch('https://pure-plateau-52218.herokuapp.com/search?q=' + text)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.error) {
                    setErr(json.error);
                    setConnectError(true);
                } else {
                    setData(json);
                    setConnectError(false);
                }
            })
            .catch((error) => {
                console.error(error);
                setErr(error.error);
                setConnectError(true);
            }).finally(() => setLoading(false));
    };

    if (connectError) {
        return (
            <View style={{ display: 'flex', flex: 1, margin: 24}}>
                <Text style={styles.searchLabel}>Plant Search</Text>
                <TextInput
                    style={styles.searchbar}
                    placeholder="Enter plant to search for"
                    onChangeText={text => setText(text)}
                    onSubmitEditing={() => search(text)}
                    defaultValue={text}
                />
                <Text>{err}</Text>
                <WeatherDisplay location={location}/>
            </View>
        );
    }

    return (
        <View style={{ display: 'flex', flex: 1, margin: 24, justifyContent: 'flex-start' }}>
            <Text style={styles.searchLabel}>Plant Search</Text>
            <TextInput
                style={styles.searchbar}
                placeholder="Enter plant to search for"
                onChangeText={text => setText(text)}
                onSubmitEditing={() => search(text)}
                defaultValue={text}
            />
            {!isLoading && data && data.length == 0 && <Text>No Results Found</Text>}
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> :
                (data && <View style={data.length > 0 ? styles.searchContainer : styles.searchContainerEmpty}>
                    <Text style={styles.listHeader}>Search Results</Text>
                    <FlatList data={data}
                        renderItem={({ item }) =>
                            <View style={styles.listItem}>
                                <Pressable onPress={()=>navigation.push('plant-info', { id: item.id })}
                                            style={({pressed}) => [ {backgroundColor: pressed? 'darkkhaki' : 'beige'} ]}>
                                    <Text>{item.name}</Text>
                                    <Text style={styles.sub}>{item.botanicalName}</Text>
                                </Pressable>
                            </View>
                        } />
                </View>
                )}
            <WeatherDisplay location={location} />
        </View>
    );

};

styles = StyleSheet.create({
    searchContainer: {
        flex: -1,
        flexDirection: 'column',
        margin: 10,
        padding: 5,
        backgroundColor: 'beige',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'green',
        maxHeight: '100%'
    },
    searchContainerEmpty: {
        flex: -1,
        flexDirection: 'column',
        margin: 24,
        backgroundColor: 'beige',
        maxHeight: 0
    },
    listHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
    },
    sub: {
        color: 'gray'
    },
    searchLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
    },
    searchbar: {
        margin: 10,
        height: 40,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgreen'
    },
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    }
});