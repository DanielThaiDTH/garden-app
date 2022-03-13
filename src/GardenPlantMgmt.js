import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions, RefreshControl } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant'
import { API_URL } from './service/Constants';
import AddPlantModal from './components/AddPlantModal';

let styles;

/** Must have a garden with an account */
export default GardenPlantMgmt = ({ navigation, route }) => {
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false); //used to force a refresh
    const [plantList, setPlantList] = useState([]);
    const [selectedID, setSelectedID] = useState(-1); //selected plant id
    const [gardenIdx, setGardenIdx] = useState(-1);
    const [gardenName, setGardenName] = useState(context.account.activeGarden ?? "" );
    const [addModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        if (context.account) {
            setGardenIdx(context.account.activeGardenIdx);
            setGardenName(context.account.activeGarden);

            if (context.account.activeGardenIdx > 0) {
                setIsWatched(context.account.getGardenAt(context.account.activeGardenIdx).isPlantWatched());
                setIsPlanted(context.account.getGardenAt(context.account.activeGardenIdx).hasPlant(id));
            }

            setPlantList(context.account.getActiveGarden().getPlants());
            setListRefresh(!listRefresh);
        }
        return () => {

        };
    },[context.account]);


    const deletePlant = async (id) => {
        let speciesID = context.account.getGardenAt(gardenIdx).getPlant(id).plantID;
        let status = await context.account.getGardenAt(gardenIdx).removePlant(id, context.token, context.account.id);
        if (status) {
            setListRefresh(!listRefresh);
            setPlantList(context.account.getGardenAt(gardenIdx).getPlants());
            setSelectedID(-1);
            Alert.alert("Removed " + getItemName(speciesID) + " from garden");
        } else {
            Alert.alert("Could not delete plant.");
        }
    };

    const updatePlantingDate = async (id) => {
        //console.log("Function called " + id);
        context.account.getGardenAt(gardenIdx).updatePlantingDate(id, new Date());
        setListRefresh(!listRefresh);
    };

    const getItemName = (id) => {
        let found = context.plantInfo.find(pi => pi.UID === id);
        if (found)
            return found.plantName;
        else
            return "Name not found"
    };

    const dropdownAdjust = (dropdownStyle) => {
        dropdownStyle.top -= 30;
        dropdownStyle.width = Dimensions.get('window').width*0.8;
        return dropdownStyle;
    };

    return (
        <View style={styles.container}>
            <FlatList data={plantList}
                      extraData={listRefresh}
                      ListHeaderComponent={
                          <View>
                              <Text style={styles.plantListHeader}>
                                  Plants in your {'\n' + gardenName + '\n'}garden
                              </Text>
                              <ModalDropdown options={context.account.getGardenList()}
                                             defaultIndex={gardenIdx}
                                             defaultValue={gardenName} 
                                             style={styles.dropdown}
                                             textStyle={styles.dropdownSelectedText}
                                             dropdownTextStyle={styles.dropdownText}
                                             dropdownStyle={styles.dropdownMenu}
                                             dropdownTextHighlightStyle={styles.dropdownSelectedText}
                                             adjustFrame={dropdownAdjust}
                                             onSelect={(idx, value) => {
                                                setGardenIdx(idx);
                                                if (idx >= 0) {
                                                    setGardenName(context.account.getGardenAt(idx).name);
                                                    setPlantList(context.account.getGardenAt(idx).getPlants());
                                                }
                                                setListRefresh(!listRefresh);
                                            }}/>
                          </View>
                          }
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
                                <TouchableOpacity onPress={() => navigation.push('plant-info', { id: item.plantID })}
                                                  style={styles.infoButton}>
                                      <Ionicons name={'md-information-circle'} size={30} color={'blue'} />
                                </TouchableOpacity>
                              </View>
                              <Text>
                                  {item.plantDate ? item.plantDate.toLocaleDateString() :  "Not planted yet"}
                              </Text>
                          </TouchableOpacity>
                      )}
                      >
            </FlatList>
            <Button title='Add Plant' onPress={() => {
                setAddModalVisible(!addModalVisible);
            }}/>
            <Button color={'red'} title='Delete plant' onPress={() => {
                deletePlant(selectedID);
            }}/>
            <AddPlantModal visibleState={{value: addModalVisible, setValue: setAddModalVisible }} 
                           callback={() => { 
                               setPlantList(context.account.getGardenAt(gardenIdx).getPlants());
                               setListRefresh(true);
                             }}
                           gardenIdx={gardenIdx}/>
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
    },
    infoButton: {
        padding: 10,
        alignContent: 'center',
        flex: 0
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 10
    },
    dropdownMenu: {
        marginTop: 0,
        paddingHorizontal: 10,
        marginHorizontal: 0
    },  
    dropdownSelectedText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dropdownText: {
        fontSize: 20,
    }
});