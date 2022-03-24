import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions, RefreshControl } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput} from 'react-native';
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

//const styles = GardenPlantMgmtStyles;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: "#fff",
        padding: 6,
        margin: 2,
        marginBottom: 5

      },

    Top: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        flex: 0.23,
        backgroundColor: "beige",
        borderWidth: 1,
        marginBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    }, 
    middle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        flex: 0.27,
        backgroundColor: "beige",
        borderWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
      },
      
      bottom: {
        flex: 0.3,
        backgroundColor: "pink",
        borderWidth: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },

      title: {
        textAlign: 'center',
        marginTop: 25,
      },
      innerTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
      },
      ga: {
        textAlign: 'center',
        fontSize: 17,
        marginBottom: 1,
        marginTop: 4,
        color: '#E97451'
        
      },
      line: {
          marginTop: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
        borderTopColor: 'black',
        borderTopWidth: 0.5,
        fontWeight: '200',
        color: '#F4BB44'

      },
      plantColor: {
          color: '#CC7722'

      }


   
});

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

            <View style={styles.Top}>
                <Text style={styles.title}>
                  Report for 
                    <Text style={styles.innerTitle}> {accountName + '\n'}</Text>
                </Text>
            </View>
            
            <View style={styles.middle}>
                <Text style={styles.innerTitle} >Account holder: {accountName}</Text>
                <Text style={styles.innerTitle}>Active Garden: {gardenName}</Text>
                <Text style={styles.innerTitle}>Number of Garden(s): {gardenCount + '\n'}</Text>
            </View>

            <View>
                <Text style={styles.ga}>
                    Garden(s) in account  
                </Text>
            </View>



            <>{
                context.account.getGardenList().map(g => {return (
                    <Text style={styles.line}>
                        {'\n' + "Garden Name: " + g +  '\n'}
                        {"Latitude: " + context.account.getGarden(g).lat+  '\n'}
                        {"Longitude: " + context.account.getGarden(g).lon+  '\n'}
                        {/* {context.account.getGarden(g).getPlants(g.plantList) +  '\n'} */}
                        {"Number of plants in Garden: " + context.account.getGarden(g).getPlantCount()+  '\n'}
                        {"Created garden Zone: " + context.account.getGarden(g).zone+  '\n'}
                    </Text>
                ) })
            
            }</>


            <View>
                <Text style={styles.ga}>
                    Plant(s) in Active Garden
                </Text>

            <FlatList data={plantList} renderItem={({item}) =>
             <Text style={styles.plantColor}>{context.getPlantName(item.plantID, context)}</Text>}/> 

            </View>

           








        </View>
    );
};
