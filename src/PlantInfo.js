import React, { useEffect, useState, useContext } from 'react';
import { 
    ActivityIndicator, 
    Text, 
    Image, 
    View, 
    ScrollView, 
    StyleSheet, 
    Button,
    Dimensions,
    Alert,
    TouchableOpacity
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HardinessDisplay from './components/HardinessDisplay';
import AppContext from './context/AppContext';
import Plant from './model/Plant';
import { API_URL } from './service/Constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    baseText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    dataHeader: {
        fontFamily: 'UbuntuBold',
        marginTop: 12,
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: "#fff8dc",
        color: "#20232a",
        textAlign: "center",
        fontSize: 18,
        borderRadius: 10,
        width: '100%',
    },
    dataHeaderName: {
        fontWeight: 'bold',
        fontSize: 35,
    },
    innerTextTitle: {
        fontFamily: 'UbuntuBold',
        fontSize: 30,
        textAlign: 'left',
        color: 'green',
    },
    innerText: {
        color: 'green',
        marginTop: 15,
        fontSize: 20,
        textAlign: 'left',
        color: 'green',
        paddingLeft: 30,
        paddingRight: 30,
        fontFamily: 'Ubuntu'
    },
    imageView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: Dimensions.get("window").width*0.8,
        height: Dimensions.get("window").height * 0.3,
        resizeMode: 'contain'
    },
    imageCaption: {
        fontStyle: 'italic',
        color: 'grey',
        textAlign:'center',
        marginBottom: 10
    },
    watchButton: {
        margin: 10,
        paddingVertical: 3,
        paddingHorizontal: 5,
        backgroundColor: 'blue',
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addButton: {
        margin: 10,
        paddingVertical: 3,
        paddingHorizontal: 15,
        backgroundColor: 'green',
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 25,
        color: 'white'
    },
    gardenDropdown: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dropdownLabel: {
        fontSize: 25,
        fontFamily: 'Ubuntu'
    }, 
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10
    },
    dropdownSelectedText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dropdownText: {
        fontSize: 20,
    }
});

export default PlantInfo = ({route, navigation}) => {
    const [isLoading, setLoading] = useState(true);
    const [connectError, setConnectError] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [data, setData] = useState([]);
    const [gardenIdx, setGardenIdx] = useState(-1);
    const [isWatched, setIsWatched] = useState(false);
    const [isPlanted, setIsPlanted] = useState(false);
    const context = useContext(AppContext);
    const { id } = route.params; 


    useEffect(() => {
        if (context.account) {
            setGardenIdx(context.account.activeGardenIdx);
            if (context.account.activeGardenIdx > 0) {
                setIsWatched(context.account.getGardenAt(context.account.activeGardenIdx).isPlantWatched());
                setIsPlanted(context.account.getGardenAt(context.account.activeGardenIdx).hasPlant(id));
            }
        }

        fetch(`${API_URL}/id/${id}`)
            .then((response) => response.json())
            .then((json) => {
                if (!json.error) {
                    setData(json);
                } else{
                    console.error(json.error);
                    setConnectError(true);
                    setErrMsg("No data was returned for this plant."); 
                }
            }).catch((error) => {
                console.error(error);
                setConnectError(true);
                setErrMsg("Could not connect to database.");
            }).finally(() => setLoading(false));
    }, []);


    const addPlant = () => {
        let garden = context.account.getGardenAt(gardenIdx);
        let newPlant = Plant.createPlant(id, new Date());
        garden.addPlant(newPlant, context.token, context.account.id)
        .then((status) => {
            if (status) {
                Alert.alert(`${data.plantName} added to your ${context.account.activeGarden} garden.`);
            } else {
                Alert.alert("Could not add this plant to your garden.");
            }
        });
    };


    const watchPlant = () => {
        let garden = context.account.getGardenAt(gardenIdx);
        garden.watchPlant(id, context.token, context.account.id).then((status) => {
            if (!status) 
                Alert.alert("Could not watch plant.");
            else
                setIsWatched(true);
        });
    }

    const unwatchPlant = () => {
        let garden = context.account.getGardenAt(gardenIdx);
        garden.unwatchPlant(id, context.token, context.account.id).then((status) =>{
            if (!status) 
                Alert.alert("Could not unwatch plant.");
            else
                setIsWatched(false);
        });
    }


    if (connectError) {
        return (
            <View style={styles.container}>
                <Text>{{errMsg}}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, margin: 24 }}>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> :
                (<View style={styles.container}>
                    <View style={styles.imageView}>
                        <Image style={styles.imageStyle} source={{ uri: data.url }} />
                        <Text style={styles.imageCaption}>{data.image_by}</Text>

                        {id && context.account && 
                        <View style={styles.gardenDropdown}>
                            <Text style={styles.dropdownLabel}>Gardens: &nbsp;</Text>
                            <ModalDropdown options={context.account.getGardenList()}
                                           defaultIndex={gardenIdx}
                                           defaultValue={context.account.getGardenAt(gardenIdx).name}
                                           style={styles.dropdown}
                                           textStyle={styles.dropdownSelectedText}
                                           dropdownTextStyle={styles.dropdownText}
                                           dropdownTextHighlightStyle={styles.dropdownSelectedText}
                                           onSelect={(idx, value) => {
                                                setGardenIdx(idx);
                                                setIsWatched(context.account.getGardenAt(idx).isPlantWatched(id));
                                                setIsPlanted(context.account.getGardenAt(idx).hasPlant(id));
                                           }}/>
                        </View>
                        }

                        {id && context.account && !isWatched &&
                            <TouchableOpacity onPress={watchPlant}
                                            style={styles.watchButton}>
                                <Ionicons name={'md-eye'} size={20} color={'white'} style={{marginRight: 5}}/>
                                <Text style={styles.buttonText}>Watch</Text>
                            </TouchableOpacity>
                        }
                        {id && context.account && isWatched &&
                            <TouchableOpacity onPress={unwatchPlant}
                                              style={styles.watchButton}>
                                <Ionicons name={'md-eye-off'} size={20} color={'white'} style={{ marginRight: 5 }}/>
                                <Text style={styles.buttonText}>Unwatch</Text>
                            </TouchableOpacity>
                        }

                        {id && context.account &&
                            <TouchableOpacity  onPress={addPlant}
                                               style={styles.addButton}>
                                <Ionicons name={'md-add'} size={25} color={'white'} style={{ marginRight: 20 }} />
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        }
                        {id && context.account && isPlanted && 
                        <Text>One of this plant is currently in your garden.</Text>
                        }
                    </View>


                    {/* <Text style={styles.dataHeaderName}>Botanical Name</Text> */}
                    <Text style={styles.dataHeaderName}>{data.plantName}</Text>

                    {/* <Text style={styles.dataHeader}>Name</Text> */}
                    <Text style={styles.innerTextTitle}>{data.botanicalName}</Text>

                    <Text style={styles.dataHeader}>Type of Plant</Text>
                    <Text style={styles.innerText}>{data.plantType}</Text>

                    <Text style={styles.dataHeader}>Plant Family</Text>
                    <Text style={styles.innerText}>{data.plantGenus}</Text>

                    <Text style={styles.dataHeader}>Viable Hardiness Zones</Text>
                    <HardinessDisplay zones={data.zones}/>
                    {data.zones && context.zone && (context.zone < Math.min.apply(null, data.zones) ||
                        context.zone > Math.max.apply(null, data.zones)) &&
                        <Text style={styles.innerText}>
                            Your climate is too {context.zone < Math.min.apply(null, data.zones) ? "cold" : "hot"} for this plant. 
                            Your hardiness zone is {context.zone}, the {context.zone < Math.min.apply(null, data.zones) ? "minimum " : "maximum "}
                            is { context.zone < Math.min.apply(null, data.zones) ? Math.min.apply(null, data.zones) : Math.max.apply(null, data.zones) }.
                        </Text>
                    }

                    <Text style={styles.dataHeader}>Sun Exposure</Text>
                    <Text style={styles.innerText}>{data.sunExposure}</Text>

                    <Text style={styles.dataHeader}>Season</Text>
                    <Text style={styles.innerText}>{data.season}</Text>

                    <Text style={styles.dataHeader}>Watering Requirement</Text>
                    <Text style={styles.innerText}>{data.waterRequirement}</Text>

                    <Text style={styles.dataHeader}>Soil Drainage</Text>
                    <Text style={styles.innerText}>{data.soilDrainage}</Text>

                    <Text style={styles.dataHeader}>Uses</Text>
                    <Text style={styles.innerText}>{data.uses}</Text>

                    <Text style={styles.dataHeader}>Soil pH</Text>
                    <Text style={styles.innerText}>{data.ph}</Text>

                    <Text style={styles.dataHeader}>Planting Notes</Text>
                    <Text style={styles.innerText}>{data.notes}</Text>

                    <Text style={styles.dataHeader}>Pests</Text>
                    <Text style={styles.innerText}>{data.pests}</Text>
                </View>
                )}
        </ScrollView>
    );

};