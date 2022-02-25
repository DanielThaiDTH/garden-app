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
                              Plants in your garden
                          </Text>}
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                          <TouchableOpacity onPress={() => { setSelectedID(item.id) }}
                              style={styles.plantItem}>
                              <Text style={item.id === selectedID ? styles.plantSelectedName : styles.plantName}>
                                  {getItemName(item.plantID)}
                              </Text>
                              <Text>
                                  {item.plantDate ?? "Not planted yet"}
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
        borderBottomWidth: 2
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
    }

});