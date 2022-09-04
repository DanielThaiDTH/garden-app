import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, Switch, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Shadow } from 'react-native-shadow-2';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import { API_URL } from './service/Constants';
import GardenMgmtStyles from './styles/GardenMgmtStyles';
import { calculatePlantRisk } from './utils';
import { calculatePrecipWater } from './service/WateringService';
import { generateDateObj } from './utils';

const styles = GardenMgmtStyles;

export default GardenMgmt = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [initial, setInitial] = useState(!!route.params.initialAdd);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");
    const [listRefresh, setListRefresh] = useState(false);
    const [useDeviceLocation, setUseDeviceLocation] = useState(true);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    
    //Get location information
    useEffect(() => {
        (async () => {
            
            if (context.location)
                return;
            
            //Get location from active garden
            if (context.account && context.account.getGardenCount() > 0 && context.account.activeGarden) {
                let garden = context.account.getActiveGarden();
                console.log(`New lat ${garden.lat}, new lon ${garden.lon}`);
                context.setLocation({ coords: { latitude: garden.lat, longitude: garden.lon } });
            } else {
                //Get location from device
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    return;
                }

                let newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
                context.setLocation(newLocation);
                if (!newLocation)
                    Alert.alert("Could not obtain location");
            }
        })();
        return () => {
            // mountRef.current = false;
        }
    }, [context.location]);


    //Get the hardiness zone
    useEffect(() => {
        (async () => {
            let zoneAlreadySet = false;

            if (!context.location || context.zone > 0)
                return;

            if (context.account && context.account.getActiveGarden() && 
                                   context.account.getActiveGarden().zone && 
                                   context.account.getActiveGarden().zone > 0) {
                context.setZone(context.account.getActiveGarden().zone);
                zoneAlreadySet = true;
            }

            let response = await fetch(`${API_URL}/zone?lat=${context.location.coords.latitude}&lon=${context.location.coords.longitude}`);
            let resObj = await response.json();

            if (!resObj) {
                Alert.alert("Network error.");
            } else if (resObj.zone && !zoneAlreadySet) {
                context.setZone(resObj.zone);
                if (context.account && context.account.activeGarden)
                    context.account.getActiveGarden().zone = resObj.zone;
            } else if (resObj && resObj.error) {
                Alert.alert(resObj.error);
            }
        })();
        return () => {
            //mountRef.current = false;
        }
    }, [context.location, context.zone]);

    //Get the weather
    useEffect(() => {
        if (!context.location || !context.location.coords)
            return;
        else if (context.account && context.weatherCache[context.account.name + context.account.activeGarden]) {
            let weather = context.weatherCache[context.account.name + context.account.activeGarden];
            context.setWeatherData(weather);
            calculatePrecipWater(context.account.getActiveGarden(), context, false);
            context.setRisk(calculatePlantRisk(weather, context.account.getActiveGarden()));
            return;
        }

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
                    if (context.account) {
                        calculatePrecipWater(context.account.getActiveGarden(), context, false);
                        context.setRisk(calculatePlantRisk(json, context.account.getActiveGarden()));
                        context.weatherCache[context.account.name + context.account.activeGarden] = json;
                    }
                    context.setWeatherData(json);
                    //console.log(json);
                }
            }).catch(err => {
                console.log(err);
            });
        return () => {
        };
    }, [context.location]);


    const addGarden = async () => {
        let newLocation = {};
        if (useDeviceLocation) {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }
    
            newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        } else {
            newLocation.coords = { latitude: latitude, longitude: longitude };
            console.log("Adding garden with given coordinates of " + latitude + ", " + longitude);
        }
        
        if (!newLocation) {
            Alert.alert("Could not obtain location");
        } else {
            let lat = newLocation.coords.latitude.toFixed(3);
            let lon = newLocation.coords.longitude.toFixed(3);
            let zoneResp = await fetch(`${API_URL}/zone?lat=${lat}&lon=${lon}`);
            let tempZone = (await zoneResp.json()).zone;
            let status = await context.account.addGarden(new Garden({lat: lat, lon: lon, name: name, createdAt: new Date(), zone: tempZone}), context.token);
            if (status) {
                Alert.alert("Garden " + name + " added to your account.");
                setListRefresh(!listRefresh);
            }
            setName("");
        } 
    }

    const removeGarden = async () => {
        if (context && context.account.activeGarden) {
            Alert.alert(
                "Delete Garden " + context.account.activeGarden, 
                "Deleting this garden will be permament. All plants and any other information will be lost if you delete this garden. Is this OK?",
                [ {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                }, {
                    text: "OK",
                    onPress: async () => {
                        let msg = await context.account.removeGarden(context.account.activeGarden, context.token);
                        setListRefresh(!listRefresh);
                        Alert.alert(msg);
                    }
                }],
                { cancelable: true }
            );
        }
    }


    return (
        <View style={styles.container}>
            <FlatList data={context.account.getGardenList()}
                      extraData={listRefresh}
                      ListHeaderComponent={
                        <Text style={styles.gardenListHeader}>
                            Your Gardens
                        </Text>}
                      keyExtractor={item => item}
                      renderItem={({item}) =>(
                          <TouchableOpacity onPress={() => {
                                                    context.account.setActiveGarden(item);
                                                    context.setZone(-1);
                                                    context.setLocation(null);
                                                    context.setInitialLoad(true);
                                            }}            
                                            style={styles.gardenItem}>
                              <Text style={(context.account.activeGarden === item) ? styles.gardenItemSelected : styles.gardenItemText}>
                                  {item}
                              </Text>
                          </TouchableOpacity>
                      )}>
            </FlatList>
            <View style={{justifyContent: 'space-evenly'}}>
                {/* <Button title='Manage Plants' color={'green'} onPress={() => navigation.push('plant-list')} /> */}
                <TouchableOpacity style={styles.managePlants} onPress={() => navigation.push('plant-list')}>
                    <Ionicons name='ios-leaf' size={20} color={'green'}/>
                    <Text style={styles.buttonText}>Manage Plants</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity style={styles.addGardenButton} onPress={() => setModal(true)}>
                        <Ionicons name='md-add' size={20} color={'blue'} style={{marginLeft: 10}}/>
                        <Text style={styles.buttonText}>Add Garden</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeGarden} onPress={removeGarden}>
                        <Ionicons name='md-remove' size={20} color={'red'} style={{ marginLeft: 10 }} />
                        <Text style={styles.buttonText}>Remove Garden</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal animationType='slide'
                transparent={true}
                visible={(initial || modal)}>
                <View style={styles.shadowContainer}>
                    <Shadow>    
                        <View style={styles.addGarden}>
                            <TextInput
                                style={styles.nameInput}
                                placeholder="Garden name"
                                onChangeText={(val)=>setName(val)}
                                value={name}/>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Use device location</Text>
                                <Switch value={useDeviceLocation}
                                        onValueChange={()=> setUseDeviceLocation(!useDeviceLocation)}/>
                            </View>
                            {!useDeviceLocation && <View style={styles.coordView}>
                                <Text style={styles.coordLabel}>Latitude</Text>
                                <TextInput
                                    style={styles.coordInput}
                                    placeholder="Latitude"
                                    onChangeText={(val) => setLatitude(parseFloat(val))}
                                    keyboardType='numeric'
                                    />
                            </View>}
                            {!useDeviceLocation && <View style={styles.coordView}>
                                <Text style={styles.coordLabel}>Longitude</Text>
                            <TextInput
                                style={styles.coordInput}
                                placeholder="Longitude"
                                onChangeText={(val) => setLongitude(parseFloat(val))}
                                keyboardType='numeric'
                                />
                            </View>}
                            <TouchableOpacity style={[styles.createButtons, styles.createButtonOk]}
                                onPress={() => {
                                    setModal(false);
                                    setInitial(false);
                                    addGarden();
                                }}>
                                <Text style={styles.createButtonText}>Create</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={() => {
                                setModal(false);
                                setInitial(false);
                            }}
                                style={styles.createButtons}>
                                <Text style={styles.createButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Shadow>
                </View>
            </Modal>
        </View>
    );
};
