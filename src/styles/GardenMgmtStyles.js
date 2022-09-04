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
    shadowContainer: {
        flex: 1,
        width: Dimensions.get("window").width*0.95,
        marginTop: Dimensions.get("window").height * 0.15,
        borderRadius: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
    addGarden: {
        backgroundColor: 'white',
        width: Dimensions.get("window").width*0.95,
        marginTop: Dimensions.get("window").height * 0.15,
        padding: 50,
        borderRadius: 30,
        marginTop: 0,
        alignSelf: 'center'
    },
    nameInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        width: Dimensions.get('window').width * 0.7,
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
    switchContainer: {
        display: "flex",
        flexDirection: "row",
        width: Dimensions.get('window').width*0.5,
        alignItems: "center",
        alignSelf: "center",
        paddingLeft: 10,
    },
    switchLabel: {
        fontFamily: 'Ubuntu',
        fontSize: 16
    },
    coordView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    coordLabel: {
        fontFamily: 'Ubuntu',
        fontSize: 20,
        textAlignVertical: 'top'
    },
    coordInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderWidth: 0.5,
        padding: 5,
    },
    createButtons: {
        borderWidth: 2,
        borderRadius: 12,
        marginHorizontal: 5,
        marginVertical: 10,
        alignItems: 'center'
    },
    createButtonOk: {
        borderColor: '#90e080'
    },
    managePlants: {
        borderRadius: 15,
        borderWidth: 4,
        borderColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3
    },
    buttonText: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontFamily: 'UbuntuBold',
        fontSize: 18
    },
    addGardenButton: {
        borderRadius: 15,
        borderWidth: 4,
        borderColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3
    },
    removeGarden: {
        borderRadius: 15,
        borderWidth: 4,
        borderColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3
    }
});