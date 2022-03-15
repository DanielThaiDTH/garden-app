import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalTitle: {
        fontFamily: 'Ubuntu',
        fontSize: 20
    },
    addPlantView: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.9,
        padding: 10
    },
    selectPlantView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    selectPlantLabel: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
        textAlignVertical: 'bottom'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        minWidth: Dimensions.get('window').width * 0.6
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
    },
    button: {
        borderRadius: 10,
        borderWidth: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginVertical: 5
    },
    addButton: {
        borderColor: 'green',
    },
    cancelButton: {
        borderColor: 'red',
    },
    disabledButton: {
        borderColor: 'grey',
    },
    buttonText: {
        fontFamily: 'UbuntuBold',
        fontSize: 20
    }
});