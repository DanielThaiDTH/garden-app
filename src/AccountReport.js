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
import PlantMgmtListItem from './components/PlantMgmtListItem';
import GardenPlantMgmtStyles from './styles/GardenPlantMgmtStyles';

const styles = GardenPlantMgmtStyles;

/** Must have a garden with an account */
export default AccountReport = ({ navigation, route }) => {
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false); //used to force a refresh
    const [plantList, setPlantList] = useState([]);
    const [gardenIdx, setGardenIdx] = useState(-1);
    const [gardenName, setGardenName] = useState(context.account.activeGarden ?? "" );
    const [accountName, setAccountName] = useState(context.account.name ?? "" );
    const [gardenCount, setGardenAccount] = useState(context.gardenCount ?? "" );
    const [gardenList, setGardenList] = useState(context.getGardenList ?? "" );
    const [gardenNameSpc, setGardenNameSpc] = useState([]);

    useEffect(() => {
        if (context.account) {
            setGardenIdx(context.account.activeGardenIdx);
            setGardenName(context.account.activeGarden);
            setAccountName(context.account.name);
            setGardenAccount(context.account.gardenCount());
            setGardenList(context.account.getGardenList());
            //setGardenNameSpc(context.account.getGarden(idx));

            




            ////////////////////////////////////////////////////
            setPlantList(context.account.getActiveGarden().getPlants());
            setListRefresh(!listRefresh);
        }
        return () => {

        };
    },[context.account]);


    return (
        <View style={styles.container}>

            <Text>
                Report for {gardenName + '\n'}
                Account holder: {accountName + '\n'}
                Active Garden: {gardenName + '\n'}
                Number of Active Garden: {gardenCount + '\n'}
                Name of Active Gardens: {" " + gardenList +  '\n'}
                Garden Object : {gardenNameSpc +  '\n'}
                Garden Index : {gardenIdx}
            </Text>

            <FlatList
        data={plantList}
        renderItem={({item}) => <Text style={styles.item}>{item.setPlantList}</Text>}
      />



        
            
            
        </View>
    );
};
