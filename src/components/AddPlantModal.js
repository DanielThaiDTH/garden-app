import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Switch,
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
import AddPlantModalStyle from '../styles/AddPlantModalStyle';


const styles = AddPlantModalStyle;

/** visibleState is expected to store a React state pair in the properties value and setValue. 
 * callback is expected be a function which is called when a plant is added.
*/
export default AddPlantModal = ({ visibleState, callback, gardenIdx }) => {
    const context = useContext(AppContext);
    const [selectedPlantID, setSelectedPlantID] = useState(-1);
    const [selectedPlantName, setSelectedPlantName] = useState("");
    const [plantList, setPlantList] = useState([]);
    const [usingWatched, setUsingWatched] = useState(false);

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

    //Switches add plant list from all plants to watched
    const plantListSwitch = () => {
        setSelectedPlantID(-1);
        if (usingWatched) {
            let plantNames = context.plantInfo.map(pi => pi.plantName);
            setPlantList(plantNames);
        } else {
            let garden = context.account.getGardenAt(gardenIdx);
            let plantNames = garden.watched.map(id => context.plantInfo.find(pi => pi.UID === id).plantName);
            setPlantList(plantNames);
        }

        setUsingWatched(prev => !prev);
    }

    //Dropdown must have the dimensions be adjusted at runtime
    const dropdownAdjust = (dropdownStyle) => {
        dropdownStyle.width = Dimensions.get('window').width * 0.6;
        let garden = context.account.getGardenAt(gardenIdx);
        if (usingWatched) {
            dropdownStyle.height = Math.min(garden.watched.length * 50, 200);
        } else {
            dropdownStyle.height = Math.min(context.plantInfo.length * 50, 200);
        }
        return dropdownStyle;
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
                                       adjustFrame={dropdownAdjust}
                                       onSelect={(idx, value) => {
                                            const plant = context.plantInfo.find(pi => pi.plantName === value);
                                            setSelectedPlantID(plant.UID);
                                            setSelectedPlantName(plant.plantName);
                                       }}/>
                    </View>
                    <View style={styles.selectPlantView}>
                        <Text style={styles.selectPlantLabel}>Select from watched: </Text>
                        <Switch onValueChange={plantListSwitch} 
                        value={usingWatched}/>
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