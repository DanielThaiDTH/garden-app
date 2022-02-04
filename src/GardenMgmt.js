import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';

let styles;

export default GardenMgmt = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [initial, setInitial] = useState(!!route.params.initialAdd);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");

    //Get location information
    useEffect(() => {
        (async () => {
            
            if (context.location)
                return;
            
            if (context.account && context.account.gardenCount() > 0 && context.account.activeGarden) {
                let garden = context.account.getActiveGarden();
                console.log(`New lat ${garden.lat}, new lon ${garden.lon}`);
                context.setLocation({ coords: { latitude: garden.lat, longitude: garden.lon } });
            } else {
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
            if (!context.location || context.zone > 0)
                return;

            if (context.account && context.account.getActiveGarden() && 
                                   context.account.getActiveGarden().zone && 
                                   context.account.getActiveGarden().zone > 0) {
                context.setZone(context.account.getActiveGarden().zone);
                return;
            }

            let response = await fetch(`https://pure-plateau-52218.herokuapp.com/zone?lat=${context.location.coords.latitude}&lon=${context.location.coords.longitude}`);
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
            context.account.addGarden(new Garden({lat: lat, lon: lon, name: name, createdAt: new Date()}));
            setName("");
        } 
    }


    return (
        <View style={styles.container}>
            <FlatList data={context.account.getGardenList()}
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
                              <Text style={styles.gardenItemText}>
                                  {item}
                              </Text>
                          </TouchableOpacity>
                      )}>
            </FlatList>
            <View>
                {/* <Button title='Remove Garden' color={'red'}/> */}
                <Button title='Add Garden' onPress={()=> setModal(true)}/>
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


styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        margin: 24,
        paddingTop: (Platform.OS === 'ios') ? 50 : 0,
        justifyContent: 'flex-start'
    },
    gardenListHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 28,
        color: 'grey',
        borderBottomColor: 'black',
        borderBottomWidth: 2
    }, 
    gardenItem: {
        paddingVertical: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },
    gardenItemText: {
        fontFamily:'Ubuntu',
        fontSize: 25
    },
    addGarden: {
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
        padding: 50,
        marginTop: Dimensions.get("window").height*0.15,
        borderRadius: 30
    },
    nameInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        width: Dimensions.get('window').width * 0.8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderWidth: 0.5,
        padding: 5,
    },
    createButtonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu'
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center'
    },
    buttonLoginColor: {
        borderColor: '#666620'
    },
    buttonCreateColor: {
        borderColor: '#0033AA'
    },
    createButtons: {
        borderWidth: 2,
        borderRadius: 12,
        marginHorizontal: 5,
        marginVertical: 20,
        alignItems: 'center'
    },
    createButtonOk: {
        borderColor: '#90e080'
    }

});