import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions, RefreshControl } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Canvas from 'react-native-canvas';

import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant'
import { API_URL } from './service/Constants';
import AddPlantModal from './components/AddPlantModal';
import PlantMgmtListItem from './components/PlantMgmtListItem';
import GardenPlantMgmtStyles from './styles/GardenPlantMgmtStyles';
import { canvasLine } from './utils';

const styles = GardenPlantMgmtStyles;

/** Must have a garden with an account */
export default GardenPlantMgmt = ({ navigation, route }) => {
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false); //used to force a refresh
    const [plantList, setPlantList] = useState(context.account.getActiveGarden().getPlants() ?? []);
    const [selectedID, setSelectedID] = useState(-1); //selected plant id
    const [gardenIdx, setGardenIdx] = useState(context.account.activeGardenIdx ?? -1);
    const [gardenName, setGardenName] = useState(context.account.activeGarden ?? "" );
    const [addModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        if (context.account) {
            setGardenIdx(context.account.activeGardenIdx);
            setGardenName(context.account.activeGarden);

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
            Alert.alert("Removed " + context.getPlantName(speciesID, context) + " from garden");
        } else {
            Alert.alert("Could not delete plant.");
        }
    };


    const reportPlant = async (id) => {
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

    };

    const updatePlantingDate = async (id) => {
        //console.log("Function called " + id);
        context.account.getGardenAt(gardenIdx).updatePlantingDate(id, new Date());
        setListRefresh(!listRefresh);
    };

    const dropdownAdjust = (dropdownStyle) => {
        dropdownStyle.top -= 30;
        dropdownStyle.width = Dimensions.get('window').width*0.8;
        dropdownStyle.height = Math.min(context.account.getGardenCount()*50, 200);
        return dropdownStyle;
    };

    const handleCanvas = (canvas) => {
        if (!canvas) {
            console.log('Canvas not loaded');
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = Dimensions.get('window').width * 0.8;
        canvas.height = Dimensions.get('window').height * 0.3;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#dd09dd';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 140);

        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1;
        canvasLine(50, 40, canvas.width - 50, 40, ctx);
        canvasLine(40, 50, 40, canvas.height - 90, ctx);
        canvasLine(50, 30, 50, 50, ctx);
        canvasLine(canvas.width - 50, 30, canvas.width - 50, 50, ctx);
        canvasLine(30, 50, 50, 50, ctx);
        canvasLine(30, canvas.height - 90, 50, canvas.height - 90, ctx)

        let widthText, lengthText;
        console.log(gardenIdx);
        if (gardenIdx > 0) {
            widthText = `${context.account.getGardenAt(gardenIdx).width}''`;
            lengthText = `${context.account.getGardenAt(gardenIdx).length } ''`;
        } else if (gardenIdx == 0) {
            widthText = `${context.account.getGardenAt(0).width}''`;
            lengthText = `${context.account.getGardenAt(0).length}''`;
        } else {
            widthText = `${context.account.getActiveGarden().width}''`;
            lengthText = `${context.account.getActiveGarden().length}''`;
        }

        ctx.font = '18px san-serif';
        ctx.textAlign = 'center';
        ctx.fillText(widthText, canvas.width / 2, 25);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(lengthText, -13*canvas.height/32, 25);
        ctx.rotate(Math.PI / 2);
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
                              <View>
                                <Text style={styles.dimensionsHeader}>Garden Dimensions</Text>
                                <Canvas ref={handleCanvas}/>
                              </View>
                          </View>
                          }
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                          <PlantMgmtListItem item={item}
                                             selectedID={selectedID}
                                             pressCallback={() => setSelectedID(item.id) }
                                             infoCallback={() => navigation.push('plant-info', { id: item.plantID })}
                                             plantDateCallback={() => updatePlantingDate(item.id)}
                                             waterCallback={(water) => {
                                                 item.waterDeficit -= water;
                                                 if (gardenIdx+1 != -1)
                                                    item.updateWaterDeficit(context.token, context.account.getGardenAt(gardenIdx+1).id);
                                                 else
                                                    item.updateWaterDeficit(context.token, context.account.getActiveGarden().id);
                                             }}/>
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
