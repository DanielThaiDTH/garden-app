import React, { useEffect, useState, useContext, useRef } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
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
    const mountRef = useRef(true);
    const context = useContext(AppContext);

    useEffect(() => {
        (async () => {
            if (!mountRef.current || context.location)
                return;
            
            //Appetize does not have location service
            if (SIM_MODE && Platform.OS === 'ios') {
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

                let newLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
                context.setLocation(newLocation);
                if (!newLocation)
                    Alert.alert("Could not obtain location")
            }
        })();
        return () => {
            mountRef.current = false;
        }
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
            <View style={styles.container}>
                <Text style={styles.searchLabel}>Plant Search</Text>
                <TextInput
                    style={styles.searchbar}
                    placeholder="Enter plant to search for"
                    onChangeText={text => setText(text)}
                    onSubmitEditing={() => search(text)}
                    defaultValue={text}
                />
                <Text>{err}</Text>
                <WeatherDisplay location={context.location}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hello {(context.curUsername && context.curUsername.length > 0)? context.curUsername:"guest"}!</Text>
            {context.curUsername.length > 0 && context.account.gardenCount() === 0 && 
                <Pressable style={styles.addGarden}
                           onPress={()=>navigation.push('garden-list', {initialAdd: true})} >
                    <Text style={styles.addGardenText}>You have no gardens yet, add one here.</Text>
                </Pressable> 
            }
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
            <WeatherDisplay location={context.location} />
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
    greeting: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        fontSize: 25,
        marginBottom: 10
    },
    addGarden: {
        margin: 10,
        marginBottom: 20,
        borderColor: 'blue',
        borderRadius: 10,
        borderWidth: 3,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: 'lightblue'
    },
    addGardenText: {
        textAlign: 'center',
        fontFamily: "UbuntuBold",
        fontSize: 16
    },
    searchContainerEmpty: {
        flex: -1,
        flexDirection: 'column',
        margin: 24,
        backgroundColor: 'beige',
        maxHeight: 0
    },
    searchLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
    },
    searchbar: {
        margin: 5,
        marginBottom: 25,
        height: 40,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgreen'
    },
    listHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
    },
    sub: {
        color: 'gray'
    },
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
    container: { 
        display: 'flex', 
        flex: 1, 
        margin: 24, 
        paddingTop: (Platform.OS === 'ios') ? 50 : 0,
        justifyContent: 'flex-start'
    }
});