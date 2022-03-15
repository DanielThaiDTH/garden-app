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
    itemShadow: {
        width: Dimensions.get('window').width*0.9,
        marginVertical: 5,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    //For PlantMgmtListItem
    plantItem: {
        width: Dimensions.get('window').width * 0.85,
        paddingVertical: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    plantName: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },
    plantSelectedName: {
        fontFamily: 'UbuntuBold',
        fontSize: 20
    },
    itemMainView: {
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
    },
    horizontalView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        margin: 0,
        padding: 0
    },
    divider: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginBottom: 5
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
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText: {
        fontFamily: 'Ubuntu',
        fontSize: 20
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