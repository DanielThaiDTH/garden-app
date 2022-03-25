import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        margin: 24,
        paddingTop: (Platform.OS === 'ios') ? 50 : 0,
        justifyContent: 'flex-start',
    },
    searchContainerShadow: {
        alignSelf: 'center',
        marginLeft: 100
    },
    searchContainer: {
        flex: -1,
        flexDirection: 'column',
        padding: 5,
        borderRadius: 5,
        maxHeight: '100%',
        alignItems: "center"
    },
    searchContainerEmpty: {
        flex: -1,
        flexDirection: 'column',
        margin: 24,
        maxHeight: 0,
        height: 0,
        alignItems: "center"
    },
    searchInterior: {
        flexDirection: 'column',
        backgroundColor: 'beige',
        padding: 20,
        width: Dimensions.get("window").width * 0.8,
        borderRadius: 10
    },
    greeting: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        fontSize: 25,
        marginBottom: 10
    },
    addGarden: {
        margin: 10,
        marginBottom: 20,
        borderColor: 'blue',
        borderRadius: 10,
        borderWidth: 3,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: 'lightblue'
    },
    addGardenText: {
        textAlign: 'center',
        fontFamily: "UbuntuBold",
        fontSize: 16
    },
    searchLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 22,
    },
    searchbar: {
        margin: 5,
        marginBottom: 25,
        height: 40,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgreen'
    },
    searchNone: {
        fontSize: 16,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        color: 'darkred'
    },
    switchContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: Dimensions.get("window").width * 0.6,
        alignItems: 'center',
        alignSelf: 'center',
        paddingLeft: Dimensions.get("window").width * 0.09
    },
    switchLabel: {
        fontSize: 16,
        fontFamily: 'UbuntuBold'
    },
    listHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
    },
    sub: {
        color: 'gray'
    },
    listItem: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        fontSize: 18
    },
    zoneMsg: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        textAlign: 'center',
        margin: 25
    },
    zone: {
        fontFamily: 'UbuntuBold',
        fontSize: 16,
        color: 'darkblue'
    },
    blogButton: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: 'blue',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginVertical: 20,
        width: Dimensions.get('window').width*0.85,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    blogButtonText: {
        fontFamily: 'Ubuntu',
        fontSize: 25,
        textAlign: 'center'
    }
});