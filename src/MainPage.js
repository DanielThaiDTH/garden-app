import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable, Switch } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import WeatherDisplay from './components/WeatherDisplay';
import AppMenu from './components/AppMenu';
import AppContext from './context/AppContext';
import LoginModal from './components/LoginModal';
import Settings from './SettingsPage';
import { API_URL } from './service/Remote';


const SIM_MODE = true;
let MainPage;
let styles;
const Tab = createBottomTabNavigator();

/**
 * Filters plants by hardiness zone. Does nothing if any paramter is invalid.
 * @param {Array<Object>} results 
 * @param {Array<Object>} plantList 
 * @param {number} zone 
 * @returns A filtered array from the results parameter.
 */
let filterSearchByZone = (results, plantList, zone) => {
    if (!Number.isInteger(zone) || zone < 0 || !results || !plantList)
        return results;
    
    let filtered = results.filter(plant => {
        let match = plantList.find(item => {
            return item.plantName === plant.name && (item.zones.length == 0 || item.zones.includes(zone));
        });
        return !!match;
    });


    return filtered;
};

const generateDateObj = function (dt) {
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

    //date['dt'] = dateTime;
    date['day'] = dateTime.getDate();
    date['month'] = monthMap.get(dateTime.getMonth());
    date['weekday'] = dayMap.get(dateTime.getDay());
    date['year'] = dateTime.getFullYear();

    return date;
}


export default MainPage = ({navigation}) => {
    const context = useContext(AppContext);

    //Get location information
    useEffect(() => {
        (async () => {
            if (context.location)
                return;
            
            console.log("Setting location");
            if (context.account && context.account.gardenCount() > 0 && context.account.activeGarden) {
                let garden = context.account.getGarden(context.account.activeGarden);
                context.setLocation({coords: { latitude: garden.lat, longitude: garden.lon}});
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

                let newLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Low});
                context.setLocation(newLocation);
                if (!newLocation)
                    Alert.alert("Could not obtain location")
            }
        })();
        return () => {
           // mountRef.current = false;
        }
    }, [context.location]);


    //Get the hardiness zone
    useEffect(() => {
        (async () => {
            if (!context.location || context.zone > 0)
                return;
            
            if (context.account && context.account.getActiveGarden() &&
                                   context.account.getActiveGarden().zone &&
                                   context.account.getActiveGarden().zone > 0) {
                context.setZone(context.account.getActiveGarden().zone);
                return;
            }
            
            let response = await fetch(`${API_URL}/zone?lat=${
                                    context.location.coords.latitude}&lon=${
                                    context.location.coords.longitude}`);
            let resObj = await response.json();

            if (!resObj) {
                Alert.alert("Network error.");
            } else if (resObj.zone) {
                context.setZone(resObj.zone);
                if (context.account && context.account.activeGarden)
                    context.account.getActiveGarden().zone = resObj.zone;
            } else {
                Alert.alert(resObj.error);
            }
        })();
        return () => {
            //mountRef.current = false;
        }
    }, [context.location]);


    //Get the weather
    useEffect(() => {
        if (!context.location || !context.location.coords)
            return;

        const lat = context.location.coords.latitude;
        const long = context.location.coords.longitude;

        if (!lat || !long)
            return;

        console.log(lat + " " + long);
        fetch(`${API_URL}/weather?lat=${lat}&lon=${long}`)
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
                    context.setWeatherData(json);
                }
            }).catch(err => {
                console.log(err);
                setConnectError(true);
            });
        return () => {
        };
    }, [context.location]);

    //Renders options
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AppMenu navigation={navigation}
                    name={context.curUsername}
                />
            )
        });
    }, [navigation, context.curUsername]);


    function HomeScreen()
    {
        const [isLoading, setLoading] = useState(false);
        const [connectError, setConnectError] = useState(false);
        const [filterOn, setFilterOn] = useState(true);
        const [data, setData] = useState(null);
        const [text, setText] = useState('');
        const [err, setErr] = useState('');
        const mountRef = useRef(true);

        let search = (text) => {
            setLoading(true);
            //console.log(`username: ${curUsername} token: ${token}`);
            fetch(`${API_URL}/search?q=${text}`)
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if (json.error) {
                        setErr(json.error);
                        setConnectError(true);
                    } else {
                        if (filterOn)
                            json = filterSearchByZone(json, context.plantInfo, context.zone);
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
                    <WeatherDisplay location={context.location} />
                    {context.zone > 0 &&
                        <Text style={styles.zoneMsg}>
                            Your hardiness zone is &nbsp;
                            <Text style={styles.zone}>
                                {context.zone}
                            </Text>
                        </Text>
                    }
                    <LoginModal />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Hello {(context.curUsername && context.curUsername.length > 0)? context.curUsername:"guest"}!</Text>
                {context.curUsername.length > 0 && context.account && context.account.gardenCount() === 0 && 
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
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Filter by climate: </Text>
                    <Switch onValueChange={()=>{setFilterOn(!filterOn)}}
                            value={filterOn}/>
                </View>
                {context.zone > 0 &&
                    <Text style={styles.zoneMsg}>
                        Your hardiness zone is &nbsp;
                        <Text style={styles.zone}>
                            {context.zone}
                        </Text>
                    </Text>
                }
                {!isLoading && data && data.length == 0 && <Text style={styles.searchNone}>No Results Found</Text>}
                {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> :
                    (data && 
                        <View style={data.length > 0 ? styles.searchContainer : styles.searchContainerEmpty}>
                            <Shadow offset={[2, 3]} distance={5}>
                                <View style={styles.searchInterior}>
                                    <Text style={styles.listHeader}>Search Results</Text>
                                    <FlatList data={data}
                                        renderItem={({ item }) =>
                                            <View style={styles.listItem}>
                                                <Pressable onPress={()=>navigation.push('plant-info', { id: item.id })}
                                                    style={({ pressed }) => [{ 
                                                        backgroundColor: pressed ? '#d0c0a0' : 'beige', 
                                                        borderRadius: 3,
                                                        paddingHorizontal: 5
                                                        } ]}>
                                                    <Text>{item.name}</Text>
                                                    <Text style={styles.sub}>{item.botanicalName}</Text>
                                                </Pressable>
                                            </View>
                                        } />
                                </View>
                            </Shadow>
                        </View>
                    )}
                {/* <WeatherDisplay location={context.location} /> */}
                <LoginModal/>
            </View>
        );
    }

    function Forecast()
    {
        return (
            <View>
                <WeatherDisplay nav={navigation} data={context.weatherData}/>
            </View>
        );
    }

    return (

        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'forecast') {
                iconName = focused ? 'ios-cloud' : 'ios-cloud-outline';
              } else if (route.name === 'Settings') {
                  iconName = 'md-settings'
              }
  
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{title: "Welcome To Oracle"}} />
          <Tab.Screen name="forecast" component={Forecast} options={{title: "7-day Forecast"}}/>
          <Tab.Screen name="Settings" component={SettingsPage} options={{title: "Settings"}}/>
        </Tab.Navigator>
       
    );

};

styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        margin: 24,
        paddingTop: (Platform.OS === 'ios') ? 50 : 0,
        justifyContent: 'flex-start',
    },
    searchContainerShadow: {
        alignSelf: 'center',
        marginLeft: 100
    },
    searchContainer: {
        flex: -1,
        flexDirection: 'column',
        padding: 5,
        borderRadius: 5,
        maxHeight: '100%',
        alignItems: "center"
    },
    searchContainerEmpty: {
        flex: -1,
        flexDirection: 'column',
        margin: 24,
        maxHeight: 0,
        alignItems: "center"
    },
    searchInterior: {
        flexDirection: 'column',
        backgroundColor: 'beige',
        padding: 20,
        width: Dimensions.get("window").width*0.8,
        borderRadius: 10
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
    searchLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 22,
    },
    searchbar: {
        margin: 5,
        marginBottom: 25,
        height: 40,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgreen'
    },
    searchNone: {
        fontSize: 16,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        color: 'darkred'
    },
    switchContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: Dimensions.get("window").width*0.6,
        alignItems: 'center',
        alignSelf: 'center',
        paddingLeft: Dimensions.get("window").width*0.09
    },
    switchLabel: {
        fontSize: 16,
        fontFamily: 'UbuntuBold'
    },
    listHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
    },
    sub: {
        color: 'gray'
    },
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        fontSize: 18
    },
    zoneMsg: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        textAlign: 'center',
        margin: 25
    },
    zone: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
        color: 'darkblue'
    }
});