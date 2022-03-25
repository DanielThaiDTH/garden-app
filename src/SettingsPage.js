import React, { useContext} from 'react';
import { 
    TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                <Ionicons name={'md-settings-outline'} color={'blue'} size={25} />
                <Text style={context.account ? styles.buttonText : styles.buttonTextDisabled}>Manage Garden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, context.account && context.account.getGardenCount() ? styles.plantButton : styles.disabledButton]}
                              onPress={() => {
                                    if (context.account && context.account.getGardenCount()) {
                                        navigation.push('plant-list');
                                    }
                              }}>
                <Ionicons name={'ios-leaf'} color={'green'} size={25}/>
                <Text style={context.account ? styles.buttonText : styles.buttonTextDisabled}>Manage Plants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, context.account && context.account.getGardenCount() ? styles.reportButton : styles.disabledButton]}
                              onPress={() => {
                                    if (context.account && context.account.getGardenCount()) {
                                        navigation.push('account-report');
                                    }
                              }}>
                <Ionicons name={'ios-document'} color={'grey'} size={25} />
                <Text style={context.account ? styles.buttonText : styles.buttonTextDisabled}>Account Report</Text>
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
        justifyContent: 'center',
        flexDirection: 'row'
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
    reportButton: {
        borderColor: 'red'
    },
    disabledButton: {
        borderColor: 'darkgrey'
    }
});