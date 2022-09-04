import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant'

//const styles = GardenPlantMgmtStyles;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: "#fff",
        padding: 6,
        margin: 2,
        paddingBottom: 10

      },

    Top: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        alignItems: 'center',
        flex: 0.23,
        backgroundColor: "beige",
        borderWidth: 0.5,
        marginBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    }, 
    middle: {
        fontSize: 20,
        textAlign: 'center',
        flex: 0.27,
        backgroundColor: "beige",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10
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
        marginTop: 20,
        fontFamily: 'Ubuntu',
        textAlignVertical: 'center',
        fontSize: 30
      },
      innerTitle: {
        fontFamily: 'UbuntuBold',
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
        // borderBottomColor: 'black',
        // borderBottomWidth: 0.5,
        // borderTopColor: 'black',
        // borderTopWidth: 0.5,
        fontWeight: '200',
        color: '#F0AA22'
      },
      cardHeader: {
        fontFamily: 'Ubuntu',
        fontSize: 20,
          color: '#F0AA22'
      },
      plantColor: {
          color: '#CC7722',
          fontSize: 20,
          marginHorizontal: 10,
          marginVertical: 5
      },
        plantInfoLabel: {
            color: '#CC7722',
            fontSize: 16
        },
      plantInfo: {
        fontSize: 16,
        color: 'black'
      },
      plantView: {
          backgroundColor: '#FFF8F8',
          borderWidth: 0.5,
          borderRadius: 15,
          marginVertical: 5,
      },
      plantRowView: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
      },
      viewPlant: {
        marginRight: 20
      },
      gardenCard: {
          backgroundColor: 'white',
          borderRadius: 20,
          borderWidth: 0.5,
          marginVertical: 5,
          padding: 5
      },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 30
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "blue"
      },
      gardenSizeButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        color: "white",
        fontWeight: "bold",
        textAlign: "center"

      }

});



const GardenCard = ({context, name, idx}) => {
    const [visible, setVisible] = useState(false);

    return (
        <TouchableOpacity key={name + idx}
            style={styles.gardenCard}
            onPress={() => {
                setVisible(!visible);
            }}>
            <Text style={styles.cardHeader}>
                <Text style={{ fontFamily: 'UbuntuBold' }}>Garden Name: </Text>
                <Text style={{ color: 'black' }}>{name}</Text>
            </Text>
            {visible && <Text style={styles.line}>
                Latitude: &nbsp;
                <Text style={{color: 'black'}}>
                    {context.account.getGarden(name).lat}
                </Text>
                 {'\n'}
                Longitude: &nbsp;
                <Text style={{ color: 'black' }}>
                    {context.account.getGarden(name).lon}
                </Text>
                {'\n'}
                {/* {context.account.getGarden(g).getPlants(g.plantList) +  '\n'} */}
                Number of plants in Garden: 
                <Text style={{ color: 'black' }}>
                    {context.account.getGarden(name).getPlantCount()}
                </Text>
                {'\n'}
                Plant Hardiness Zone: &nbsp;
                <Text style={{ color: 'black' }}>
                    {context.account.getGarden(name).zone}
                </Text>
            </Text>}
        </TouchableOpacity>
    )
}

const PlantCard = ({context, plant, nav}) => {
    return (
        <View style={styles.plantView}>
            <View style={styles.plantRowView}>
                <Text style={styles.plantColor}>
                    {context.getPlantName(plant.plantID, context)}
                </Text>
                <TouchableOpacity style={styles.viewPlant}
                    onPress={() => nav.push('plant-info', { id: plant.plantID })}>
                    <Ionicons name={'md-eye'} size={20} color={'grey'}/> 
                </TouchableOpacity>
            </View>
            <Text style={{padding: 10}}>
                <Text style={styles.plantInfoLabel}>
                    Plant Date: &nbsp; 
                </Text>
                <Text style={styles.plantInfo}>
                    {plant.plantDate instanceof Date ? plant.plantDate.toLocaleDateString() : "Not planted yet"}
                </Text>
            </Text>
        </View>
    );
}

/** Must have a garden with an account */
export default AccountReport = ({ navigation, route }) => {


    const [modalVisible, setModalVisible] = useState(false);
    const context = useContext(AppContext);
    const [listRefresh, setListRefresh] = useState(false); //used to force a refresh
    const [plantList, setPlantList] = useState([]);
    const [gardenIdx, setGardenIdx] = useState(-1);
    const [gardenName, setGardenName] = useState(context.account.activeGarden ?? "" );
    const [selectedGarden, setSelectedGarden] = useState(context.account.activeGarden ?? "");
    const [accountName, setAccountName] = useState(context.account.name ?? "" );
    const [gardenCount, setGardenCount] = useState(context.gardenCount ?? "" );
    const [gardenList, setGardenList] = useState(context.getGardenList ?? "" );



    useEffect(() => {
        if (context.account) {
            setGardenIdx(context.account.activeGardenIdx);
            setGardenName(context.account.activeGarden);
            setAccountName(context.account.name);
            setGardenCount(context.account.gardenCount());
            setGardenList(context.account.getGardenList());

            ////////////////////////////////////////////////////
            setPlantList(context.account.getActiveGarden()?.getPlants() ?? []);
            setListRefresh(!listRefresh);
        }
        return () => {

        };
    },[context.account]);


    const dropdownAdjust = (dropdownStyle) => {
        dropdownStyle.top -= 30;
        dropdownStyle.width = Dimensions.get('window').width * 0.8;
        dropdownStyle.height = Math.min(context.account.getGardenCount() * 50, 200);
        return dropdownStyle;
    };

    const checkDimension = () =>
    {
      Alert.alert(
        "Dimensions Sucess",
        "Garden Dimnesions: Looks Good! ",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Dimensions button checked!"),
            style: 'cancel'
          }
        ]
      )
    }



    return (
        <ScrollView style={styles.container}>

            <View style={styles.Top}>
                <Text style={styles.title}>
                  Account Report for 
                    <Text style={styles.innerTitle}> {accountName + '\n'}</Text>
                </Text>
            </View>
            
            <View style={styles.middle}>
                <Text style={styles.innerTitle}>Account holder: &nbsp;
                    <Text style={{color: 'purple'}}>
                        {accountName}
                    </Text>
                </Text>
                <Text style={styles.innerTitle}>Active Garden: &nbsp;
                    <Text style={{ color: 'darkgreen' }}>
                        {gardenName}
                    </Text>
                </Text>
                <Text style={styles.innerTitle}>Number of Garden(s): &nbsp;
                    <Text style={{color: 'blue'}}>
                        {gardenCount}
                    </Text>
                </Text>
            </View>

            {/* break  */}
            <View style={{ marginTop: 30 }}>
                <Text style={styles.ga}>
                    Garden(s) in account  
                </Text>
            </View>



            <>{
                context.account.getGardenList().map((g, i) => {
                    return (<GardenCard context={context} name={g} idx={i}/>);
                     })
            
            }</>


            <ModalDropdown options={context.account.getGardenList()}
                           defaultIndex={-1}
                           defaultValue='Please select a garden...'
                style={styles.dropdown}
                textStyle={styles.dropdownSelectedText}
                dropdownTextStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownMenu}
                dropdownTextHighlightStyle={styles.dropdownSelectedText}
                adjustFrame={dropdownAdjust}
                onSelect={(idx, value) => {
                    if (idx >= 0) {
                        setSelectedGarden(value);
                        setPlantList(context.account.getGardenAt(idx).getPlants());
                    }
                }}
            />

            <View style={{ marginBottom: 25 }}>
                <Text style={styles.ga}>
                    <Ionicons name={'ios-leaf'} color={'green'} size={20} />
                    Plant(s) in Selected Garden {selectedGarden}
                </Text>

             <>
             {plantList.map(plant => {
                 return(
                    <PlantCard context={context} plant={plant} nav={navigation} key={plant.id}/>
                 );
             })}
             </>
            </View>

        </ScrollView>
    );
};
