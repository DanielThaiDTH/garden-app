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
        textAlign: 'center',
        paddingBottom: 10
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
    iconView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5 ,
        marginHorizontal: 30
    },
    plantButtonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    infoButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignContent: 'center',
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    infoText: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },
    waterInfo: {
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        marginVertical: 10
    },
    waterInput: {
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 5
    },
    waterButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    waterButtonText: {
        color: 'white',
        fontSize: 18
    },
    dimensionsHeader: {
        fontFamily: 'UbuntuBold',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10
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