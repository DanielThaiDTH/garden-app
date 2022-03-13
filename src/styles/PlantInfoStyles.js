import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

export default StyleSheet.create({
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
        marginTop: 16,
        paddingVertical: 8,
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
        width: Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").height * 0.3,
        resizeMode: 'contain'
    },
    imageCaption: {
        fontStyle: 'italic',
        color: 'grey',
        textAlign: 'center',
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