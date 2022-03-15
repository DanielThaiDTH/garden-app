import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import { API_URL } from './service/Constants';
import GardenMgmtStyles from './styles/GardenMgmtStyles';

const styles = GardenMgmtStyles;

export default GardenMgmt = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [initial, setInitial] = useState(!!route.params.initialAdd);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");
    const [listRefresh, setListRefresh] = useState(false);
    
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


    const addGarden = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let newLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        
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
                                                    context.account.activeGarden = item;
                                                    context.setZone(-1);
                                                    context.setLocation(null);
                                            }}            
                                            style={styles.gardenItem}>
                              <Text style={(context.account.activeGarden === item) ? styles.gardenItemSelected : styles.gardenItemText}>
                                  {item}
                              </Text>
                          </TouchableOpacity>
                      )}>
            </FlatList>
            <View style={{justifyContent: 'space-evenly'}}>
                <Button title='Manage Plants' color={'green'} onPress={() => navigation.push('plant-list')} />
                <Button title='Add Garden' onPress={()=> setModal(true)}/>
                <Button title='Remove Garden' color={'red'} onPress={removeGarden}/>
            </View>
            <Modal animationType='slide'
                transparent={true}
                visible={(initial || modal)}>
                <View style={styles.addGarden}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Garden name"
                        onChangeText={(val)=>setName(val)}
                        value={name}/>
                    <Button title="Use current location" />
                    <Button title="Use device location" />
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
            </Modal>
        </View>
    );
};
