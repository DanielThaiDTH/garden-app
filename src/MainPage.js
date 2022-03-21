import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import { Constants } from 'expo-constants';
import { Alert } from 'react-native';
import {
     FlatList, 
     Text, 
     Image, 
     View,  
     TextInput, 
     Pressable, 
     Switch } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { generateDateObj, filterSearchByZone } from './utils';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import WeatherDisplay from './components/WeatherDisplay';
import AppMenu from './components/AppMenu';
import AppContext from './context/AppContext';
import LoginModal from './components/LoginModal';
import SettingsPage from './SettingsPage';
import { getCoordinates } from './service/LocationService';
import { searchPlant } from './service/SearchService';
import { API_URL } from './service/Constants';
import MainPageStyles from './styles/MainPageStyles';


let MainPage;
const styles = MainPageStyles;
const Tab = createBottomTabNavigator();


export default MainPage = ({navigation}) => {
    const context = useContext(AppContext);

    //Get location information
    useEffect(() => {
        getCoordinates(context);
        
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
            searchPlant(text, context, setData, filterOn)
            .then((errMsg) => {
                if (errMsg) {
                    setErr(errMsg);
                    setConnectError(true);
                } else {
                    setConnectError(false);
                }
                setLoading(false);
            });
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
                {context.curUsername.length > 0 && context.account && context.account.getGardenCount() === 0 && 
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
                  iconName = 'md-settings-outline'
              }else if (route.name === 'Blog') {
                iconName = 'md-create-outline';
              }
  
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{title: "Welcome To Oracle"}} />
          <Tab.Screen name="forecast" component={Forecast} options={{title: "7-day Forecast"}} />
          <Tab.Screen name="Settings" component={SettingsPage} options={{title: "Settings"}}/>
          <Tab.Screen name="Blog" component={SettingsPage} options={{title: "Blog"}}/>
        </Tab.Navigator>
       
    );

};

