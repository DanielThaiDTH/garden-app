import React, { useEffect, useState } from 'react';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

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
        fontWeight: 'bold',
        marginTop: 12,
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: "#fff8dc",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
        borderRadius: 10,
        width: '100%',
    },
    dataHeaderName: {
        fontWeight: 'bold',
        fontSize: 35,
    },
    innerTextTitle: {
        fontWeight: 'bold',
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
        fontWeight: '100'
    },
    imageView: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    },
    imageStyle: {
        width: 400,
        height: 225,
        resizeMode: 'contain'
    },
    imageCaption: {
        fontStyle: 'italic',
        color: 'grey',
        textAlign:'center'
    }
});

export default PlantInfo = ({route, navigation}) => {
    const [isLoading, setLoading] = useState(true);
    const [connectError, setConnectError] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [data, setData] = useState([]);
    const { id } = route.params; 


    useEffect(() => {
        fetch('https://pure-plateau-52218.herokuapp.com/id/' + id)
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

    if (connectError) {
        return (
            <View style={styles.container}>
                <Text>{{errMsg}}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, margin: 24 }}>
            {isLoading ? <Text>Loading...</Text> :
                (<View style={styles.container}>
                    <View style={styles.imageView}>
                        <Image style={styles.imageStyle} source={{ uri: data.url }} />
                        <Text style={styles.imageCaption}>{data.image_by}</Text>
                    </View>


                    {/* <Text style={styles.dataHeaderName}>Botanical Name</Text> */}
                    <Text style={styles.dataHeaderName}>{data.plantName}</Text>

                    {/* <Text style={styles.dataHeader}>Name</Text> */}
                    <Text style={styles.innerTextTitle}>{data.botanicalName}</Text>

                    <Text style={styles.dataHeader}>Type of Plant</Text>
                    <Text style={styles.innerText}>{data.plantType}</Text>

                    <Text style={styles.dataHeader}>Plant Family</Text>
                    <Text style={styles.innerText}>{data.plantGenus}</Text>

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