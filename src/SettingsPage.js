import React, { useContext} from 'react';
import { 
    TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Location from 'expo-location';
import AppContext from './context/AppContext';

let styles = {};

export default SettingsPage = ({navigation}) => {
    const context = useContext(AppContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, context.account? styles.gardenButton : styles.disabledButton]}
                              onPress={() => {
                                  if (context.account) {
                                      navigation.push('garden-list', { initialAdd: false });
                                  }
                              }}>
                <Text style={context.account ? styles.buttonText : styles.buttonTextDisabled}>Manage Garden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, context.account && context.account.getGardenCount() ? styles.plantButton : styles.disabledButton]}
                              onPress={() => {
                                    if (context.account && context.account.getGardenCount()) {
                                        navigation.push('plant-list');
                                    }
                              }}>
                <Text style={context.account ? styles.buttonText : styles.buttonTextDisabled}>Manage Plants</Text>
            </TouchableOpacity>
        </View>
    );
};

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 25,
        padding: 10,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'UbuntuBold',
        fontSize: 25,
        color: 'black'
    },
    buttonTextDisabled: {
        fontFamily: 'UbuntuBold',
        fontSize: 25,
        color: 'grey'
    }, 
    gardenButton: {
        borderColor: 'blue'
    },
    plantButton: {
        borderColor: 'green'
    },
    disabledButton: {
        borderColor: 'darkgrey'
    }
});