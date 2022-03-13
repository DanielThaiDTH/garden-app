import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    secure,
    Alert
} from 'react-native';

import React, {
    useState,
    useContext,
    useEffect
} from 'react';

import { API_URL } from '../service/Constants';
import { Shadow } from 'react-native-shadow-2';
import ModalDropdown from 'react-native-modal-dropdown';

import AppContext from '../context/AppContext';
import Plant from '../model/Plant';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalTitle: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },  
    addPlantView: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.9,
        padding: 10
    },
    selectPlantView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    selectPlantLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
        textAlignVertical: 'bottom'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        minWidth: Dimensions.get('window').width*0.6
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
    },
    button: {
        borderRadius: 10,
        borderWidth: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginVertical: 5
    },
    addButton: {
        borderColor: 'green',
    },
    cancelButton: {
        borderColor: 'red',
    },
    disabledButton: {
        borderColor: 'grey',
    },
    buttonText: {
        fontFamily: 'UbuntuBold',
        fontSize: 20
    }
});

/** visibleState is expected to store a React state pair in the properties value and setValue. 
 * callback is expected be a function which is called when a plant is added.
*/
export default AddPlantModal = ({ visibleState, callback, gardenIdx }) => {
    const context = useContext(AppContext);
    const [selectedPlantID, setSelectedPlantID] = useState(-1);
    const [selectedPlantName, setSelectedPlantName] = useState("");
    const [plantList, setPlantList] = useState([]);

    useEffect(() => {
        if (selectedPlantID >= 0) {
            const name = context.plantInfo.find(pi => pi.UID === selectedPlantID).plantName;
            setSelectedPlantName(name);
        }
    }, [selectedPlantID]);

    useEffect(() => {
        if (!context.plantInfo)
            return;
        
        let plantNames = context.plantInfo.map(pi => pi.plantName);
        setPlantList(plantNames);

        return () => {};
    }, context.plantInfo);

    const addPlant = () => {
        let garden = context.account.getGardenAt(gardenIdx);
        let newPlant = Plant.createPlant(selectedPlantID, new Date());
        garden.addPlant(newPlant, context.token, context.account.id)
            .then((status) => {
                if (status) {
                    Alert.alert(`${selectedPlantName} added to your ${context.account.activeGarden} garden.`);
                } else {
                    Alert.alert("Could not add this plant to your garden.");
                }
            })
            .finally(() => {
                visibleState.setValue(false);
                if (typeof callback === 'function')
                    callback();
            });
    };

    return (
        <Modal animationType='slide'
               transparent={true}
               visible={visibleState.value}
               onRequestClose={() => {
                   visibleState.setValue(false);
               }}>
            <View style={styles.container}>    
                <Shadow viewStyle={styles.addPlantView}>
                    <Text style={styles.modalTitle}>Add a plant to your garden</Text>
                    <View style={styles.selectPlantView}>
                        <Text style={styles.selectPlantLabel}>Plant: </Text>
                        <ModalDropdown options={plantList}
                                       defaultValue='Select a plant...'
                                       style={styles.dropdown}
                                       textStyle={styles.dropdownSelectedText}
                                       dropdownTextStyle={styles.dropdownText}
                                       dropdownStyle={styles.dropdownMenu}
                                       dropdownTextHighlightStyle={styles.dropdownSelectedText}
                                       onSelect={(idx, value) => {
                                            const plant = context.plantInfo.find(pi => pi.plantName === value);
                                            setSelectedPlantID(plant.UID);
                                            setSelectedPlantName(plant.plantName);
                                       }}/>
                    </View>
                    <TouchableOpacity onPress={addPlant}
                                      disabled={selectedPlantID < 0}
                                      style={[styles.button, selectedPlantID >= 0 ? styles.addButton : styles.disabledButton]}>
                        <Text style={styles.buttonText}>Add {selectedPlantName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { 
                            visibleState.setValue(false); 
                            setSelectedPlantName("");
                            setSelectedPlantID(-1);
                        }}
                                     style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </Shadow>
            </View>
        </Modal>
    );
};