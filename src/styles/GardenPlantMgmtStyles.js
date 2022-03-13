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
    plantListHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 28,
        color: 'grey',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        textAlign: 'center'
    },
    plantItem: {
        paddingVertical: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },
    plantName: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },
    plantSelectedName: {
        fontFamily: 'UbuntuBold',
        fontSize: 20
    },
    horizontalView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        margin: 0,
        padding: 0
    },
    plantButton: {
        backgroundColor: 'green',
        padding: 10
    },
    plantButtonText: {
        color: 'white',
        fontSize: 20
    },
    infoButton: {
        padding: 10,
        alignContent: 'center',
        flex: 0
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 10
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
    }
});