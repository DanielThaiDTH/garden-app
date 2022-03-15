import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
        paddingTop: 0
    },
    blurContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    usernameInput: {
        justifyContent: 'center',
        fontSize: 25,
        height: 45,
        width: Dimensions.get('window').width * 0.9,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 15,
        borderWidth: 0.5,
        padding: 5,
    },
    image: {
        position: "absolute",
        width: Dimensions.get("window").width * 1.2,
        height: 200,
        top: -10,
        //bottom: 470,
        opacity: 1,
        borderBottomRightRadius: 450,
        borderBottomLeftRadius: 450,
        borderTopRightRadius: 80,
        borderTopLeftRadius: 80,
        backgroundColor: 'transparent',
        borderBottomWidth: 70

    },
    passwordInput: {
        justifyContent: 'center',
        fontSize: 25,
        height: 45,
        width: Dimensions.get('window').width * 0.9,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 0.5,
        padding: 5,
        backgroundColor: 'white'
    },
    half: {
        color: '#FFFFFF'
    },
    welcome: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        marginBottom: 50,
        bottom: 80,
        color: '#FFFFFF',
        fontSize: 30,
    },
    textUnderMain:
    {
        color: '#FFFFFF',
        bottom: 100,
        fontStyle: 'italic'
    },
    welcome2: {
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 5,
        color: '#818589',
        fontFamily: 'UbuntuItalic'
    },
    welcomeBack: {
        color: '#4F7942',
        bottom: 10,
        fontSize: 25,
        fontFamily: 'Ubuntu'
    },
    test:
    {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 25,
        marginVertical: 5,
        // justifyContent: 'space-between',
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.4,
        fontFamily: 'Ubuntu',
    },
    Login: {
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 25,
        marginVertical: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginRight: 0,
        width: Dimensions.get('window').width * 0.4,
        fontFamily: 'Ubuntu'
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 25
    },
    createButtonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu',
    },
    create: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        marginVertical: 10,
        width: Dimensions.get('window').width * 0.8 + 10,
        bottom: 29,
        right: 71,
    },
    create2: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        marginVertical: 10,
        width: Dimensions.get('window').width * 0.8 + 10,
        fontWeight: "bold",
        left: 65,
        bottom: -9
    },
    buttonCreateColor: {
        borderColor: '#0033AA'
    },
    tinyLogo: {
        height: 100,
        width: 100,
        margin: 20,
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center'
    },
    buttonLoginColor: {
        borderColor: '#666620'
    }

});