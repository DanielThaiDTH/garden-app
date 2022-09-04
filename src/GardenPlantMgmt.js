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
import { canvasLine, generateDateObj, calculatePlantRisk } from './utils';
import { calculatePrecipWater } from './service/WateringService';

const styles = GardenPlantMgmtStyles;

/** Is the page for managing plants in a garden. Must have an account active or it will not load. */
export default GardenPlantMgmt = ({ navigation, route }) => {
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false); //used to force a refresh
    const [plantList, setPlantList] = useState(context.account.getActiveGarden().getPlants() ?? []);
    const [selectedID, setSelectedID] = useState(-1); //selected plant id
    const [gardenIdx, setGardenIdx] = useState(context.account.activeGardenIdx ?? -1);
    const [gardenName, setGardenName] = useState(context.account.activeGarden ?? "" );
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [currentRisk, setCurrentRisk] = useState(context.risk);

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


    const updateWeather = async (garden) => {
        console.log(garden.lat + garden.lon);

        if (!garden.name)
            return;
        else if (context.account && context.weatherCache[context.account.name + garden.name]) {
            let weather = context.weatherCache[context.account.name + garden.name];
            calculatePrecipWater(garden, context, false);
            context.riskCache[context.account.name + garden.name] = calculatePlantRisk(weather, garden);
            setCurrentRisk(context.riskCache[context.account.name + garden.name]);
            setListRefresh(!listRefresh);
            return;
        }

        const lat = garden.lat;
        const long = garden.lon;

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
                        calculatePrecipWater(garden, context, false);
                        context.riskCache[context.account.name + garden.name] = calculatePlantRisk(json, garden);
                        setCurrentRisk(context.riskCache[context.account.name + garden.name]);
                        context.weatherCache[context.account.name + garden.name] = json;
                        setListRefresh(!listRefresh);
                    }
                    //console.log(json);
                }
            }).catch(err => {
                console.log(err);
            });
    };


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

    const forceRefresh = () => {
        setListRefresh(!listRefresh);
    };

    const handleCanvas = (canvas) => {
        if (!canvas) {
            console.log('Canvas not loaded');
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = Dimensions.get('window').width * 0.8;
        canvas.height = Dimensions.get('window').height * 0.225;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#dd09dd';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 90);

        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1;
        canvasLine(50, 40, canvas.width - 50, 40, ctx);
        canvasLine(40, 50, 40, canvas.height - 40, ctx);
        canvasLine(50, 30, 50, 50, ctx);
        canvasLine(canvas.width - 50, 30, canvas.width - 50, 50, ctx);
        canvasLine(30, 50, 50, 50, ctx);
        canvasLine(30, canvas.height - 40, 50, canvas.height - 40, ctx)

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
        ctx.fillText(lengthText, -16*canvas.height/32, 25);
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
                                                    updateWeather(context.account.getGardenAt(idx));
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
                                             currentRisk = {currentRisk}
                                             waterCallback={(water) => {
                                                 item.waterDeficit -= water;
                                                 if (gardenIdx+1 != -1) {
                                                     item.updateWaterDeficit(context.token, 
                                                        context.account.getGardenAt(gardenIdx).id, 
                                                        currentRisk,
                                                        forceRefresh);
                                                 } else {
                                                     item.updateWaterDeficit(context.token,
                                                         context.account.getActiveGarden().id, 
                                                         currentRisk,
                                                         forceRefresh);
                                                 }
                                             }}/>
                      )}
                      >
            </FlatList>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity style={styles.addPlant} onPress={() => {
                    setAddModalVisible(!addModalVisible);
                }}>
                    <Ionicons name='md-add' size={20} color={'blue'} style={{marginLeft: 10}}/>
                    <Text style={styles.plantMgmtText}>Add Plant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deletePlant} onPress={() => {
                    deletePlant(selectedID);
                }}>
                    <Ionicons name='md-remove' size={20} color={'red'} style={{ marginLeft: 10 }} />
                    <Text style={styles.plantMgmtText}>Delete Plant</Text>
                </TouchableOpacity>
            </View>
            <AddPlantModal visibleState={{value: addModalVisible, setValue: setAddModalVisible }} 
                           callback={() => { 
                               setPlantList(context.account.getGardenAt(gardenIdx).getPlants());
                               setListRefresh(true);
                             }}
                           gardenIdx={gardenIdx}/>
        </View>
    );
};
