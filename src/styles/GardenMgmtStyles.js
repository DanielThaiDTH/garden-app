import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        margin: 24,
        paddingTop: (Platform.OS === 'ios') ? 50 : 0,
        justifyContent: 'flex-start'
    },
    gardenListHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 28,
        color: 'grey',
        borderBottomColor: 'black',
        borderBottomWidth: 2
    },
    gardenItem: {
        paddingVertical: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },
    gardenItemText: {
        fontFamily: 'Ubuntu',
        fontSize: 25
    },
    gardenItemSelected: {
        fontFamily: 'UbuntuBold',
        fontSize: 25
    },
    addGarden: {
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
        padding: 50,
        marginTop: Dimensions.get("window").height * 0.15,
        borderRadius: 30
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
        marginHorizontal: 5,
        marginVertical: 20,
        alignItems: 'center'
    },
    createButtonOk: {
        borderColor: '#90e080'
    }

});