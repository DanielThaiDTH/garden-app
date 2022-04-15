import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    Alert
} from 'react-native';

import React, {
    useState,
    useContext,
    useEffect
} from 'react';

import { API_URL } from '../service/Constants';
import AppContext from '../context/AppContext';

let styles;

export default DimensionModal = ({length, width, visible, garden, complete, cancel}) => {
    const context = useContext(AppContext);
    const [visibility, setVisibility] = useState(visible);
    const [w, setW] = useState(width);
    const [l, setL] = useState(length);
    const [g, setG] = useState(garden);

    useEffect(() => {
        setVisibility(visible);
        return () => {
        }
    }, [visible]);

    useEffect(() => {
        setG(garden)
        return () => {
        }
    }, [garden])

    return (
        <Modal animationType='slide'
               transparent={true}
               visible={visibility}
               onRequestClose = {() => {
                    setW(0);
                    setL(0);
                    setVisibility(!visibility);
               }}>
                <View style={styles.container}>
                    <View style={styles.panel}>
                        {g && 
                        <Text style={styles.panelHeader}>Enter new garden size for {g.name}</Text>}
                        <TextInput
                            style={styles.userInput}
                            placeholder="Length (feet)"
                            keyboardType='numeric'
                            onChangeText={val => { 
                                if (parseFloat(val))
                                 setL(parseFloat(val))
                            }
                            }/>
                        <TextInput
                            style={styles.userInput}
                            keyboardType='numeric'
                            placeholder="Width (feet)"
                            onChangeText={val => {
                                if (parseFloat(val))
                                    setW(parseFloat(val))
                            }}
                            />
                            <TouchableOpacity style={[styles.buttonUpdateColor, styles.button]}
                                              onPress={() => {
                                                  g.updateDimensions(context.token, context.account.id, w*12, l*12);
                                                  setVisibility(false);
                                                  complete();
                                              }}>
                                <Text style={styles.buttonText}>Update dimensions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonCancelColor, styles.button]}
                                              onPress={() => {
                                                    setL(length);
                                                    setW(width);
                                                    setVisibility(false);
                                                    cancel();
                                                    }}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                    </View>
                </View>
        </Modal>
    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    panel: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        width: Dimensions.get('window').width * 0.9,
        shadowColor: '#002211',
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.2,
        padding: 10,
    },
    panelHeader: {
        fontFamily: 'UbuntuBold',
        fontSize: 20,
        textAlign: 'center'
    },
    userInput: {
        borderRadius: 5, 
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center'
    },
    buttonUpdateColor: {
        borderColor: '#0033AA'
    },
    buttonCancelColor: {
        borderColor: '#AA3300'
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu'
    },
});