import React, { useEffect, useState, useContext, useRef } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AppContext from './context/AppContext';
import Garden from './model/Garden';

let styles;

export default GardenMgmt = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [initial, setInitial] = useState(!!route.params.initialAdd);
    const [modal, setModal] = useState(false);

    return (
        <View style={styles.container}>
            <FlatList data={context.account.getGardenList()}
                      keyExtractor={item => item}
                      renderItem={({item}) =>(
                          <View>
                              <Text>{item}</Text>
                          </View>
                      )}>
            </FlatList>
            <View>
                <Button title='Remove Garden' color={'red'}/>
                <Button title='Add Garden' onPress={()=> setModal(true)}/>
            </View>
            <Modal animationType='slide'
                transparent={true}
                visible={(initial || modal)}>
                <View style={styles.addGarden}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Garden name" />
                    <Button title="User current location" />
                    <TouchableOpacity style={[styles.createButtons, styles.createButtonOk]}
                        onPress={() => {
                            setModal(false);
                            setInitial(false);
                        }}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => {
                        setModal(false);
                        setInitial(false);
                    }}
                        style={styles.createButtons}>
                        <Text style={styles.createButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    addGarden: {
        backgroundColor: 'white',
        width: Dimensions.get("window").width
    },
    nameInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        width: Dimensions.get('window').width * 0.8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderWidth: 0.5,
        padding: 5,
    },
    createButtonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu'
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center'
    },
    buttonLoginColor: {
        borderColor: '#666620'
    },
    buttonCreateColor: {
        borderColor: '#0033AA'
    },
    createButtons: {
        borderWidth: 2,
        borderRadius: 12,
        margin: 5
    },
    createButtonOk: {
        borderColor: '#90e080'
    }

});