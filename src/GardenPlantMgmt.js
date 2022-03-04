import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant'
import { API_URL } from './service/Remote';

let styles;

export default GardenPlantMgmt = ({ navigation, route }) => {
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false);
    const [plantList, setPlantList] = useState([]);
    const [selectedID, setSelectedID] = useState(-1);

    useEffect(() => {
        setPlantList(context.account.getActiveGarden().getPlants());
        setListRefresh(!listRefresh);
        return () => {

        };
    },[context.account]);

    const deletePlant = async (id) => {
        console.log(id);
        let speciesID = context.account.getActiveGarden().getPlant(id).plantID;
        let status = await context.account.getActiveGarden().removePlant(id, context.token, context.account.id);
        if (status) {
            setListRefresh(!listRefresh);
            setPlantList(context.account.getActiveGarden().getPlants());
            setSelectedID(-1);
            Alert.alert("Removed " + getItemName(speciesID) + " from garden");
        } else {
            Alert.alert("Could not delete plant.");
        }
    };

    const updatePlantingDate = async (id) => {
        console.log("Function called " + id);
        context.account.getActiveGarden().updatePlantingDate(id, new Date());
        setListRefresh(!listRefresh);
    };

    const getItemName = (id) => {
        let found = context.plantInfo.find(pi => pi.UID === id);
        if (found)
            return found.plantName;
        else
            return "Name not found"
    };

    return (
        <View style={styles.container}>
            <FlatList data={plantList}
                      extraData={listRefresh}
                      ListHeaderComponent={
                          <Text style={styles.plantListHeader}>
                              Plants in your {'\n' + context.account.activeGarden + '\n'}garden
                          </Text>}
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                          <TouchableOpacity onPress={() => { setSelectedID(item.id) }}
                              style={styles.plantItem}>
                              <View style={styles.horizontalView}>
                                <Text style={item.id === selectedID ? styles.plantSelectedName : styles.plantName}>
                                    {getItemName(item.plantID)}
                                </Text>
                                <TouchableOpacity onPress={() => updatePlantingDate(item.id)}
                                                  style={styles.plantButton}>
                                    <Text style={styles.plantButtonText}>
                                        {item.plantDate ? "Update" : "Plant"}
                                    </Text>
                                </TouchableOpacity>
                              </View>
                              <Text>
                                  {item.plantDate ? item.plantDate.toLocaleDateString() :  "Not planted yet"}
                              </Text>
                          </TouchableOpacity>
                      )}
                      >
            </FlatList>
            <Button color={'red'} title='Delete plant' onPress={() => {
                deletePlant(selectedID);
            }}/>
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
    plantListHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 28,
        color: 'grey',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        textAlign: 'center'
    },
    plantItem: {
        paddingVertical: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },
    plantName: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },
    plantSelectedName: {
        fontFamily: 'UbuntuBold',
        fontSize: 20
    },
    horizontalView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        margin: 0,
        padding: 0
    },
    plantButton: {
        backgroundColor: 'green',
        padding: 10
    },
    plantButtonText: {
        color: 'white',
        fontSize: 20
    }
});