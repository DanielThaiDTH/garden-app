import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    TextInput
} from "react-native";

import React, { useContext, useState, useEffect } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import ModalDropdown from "react-native-modal-dropdown";

import { API_URL } from "../service/Constants";
import AppContext from "../context/AppContext";

let styles;
const types = ['regular', 'h1', 'h2', 'h3', 'image', 'quote'];

export default SectionAddModal = ({viewContext, onAdd}) => {
    const context = useContext(AppContext);
    const visibleContext = useContext(viewContext);
    const [text, setText] = useState('');
    const [link, setLink] = useState('');
    const [type, setType] = useState('');


    const dropdownAdjust = (dropdownStyle) => {
        dropdownStyle.top -= 30;
        dropdownStyle.width = Dimensions.get('window').width * 0.5;
        dropdownStyle.height = Math.min(types.length * 50, 200);
        return dropdownStyle;
    };


    return(
        <Modal animationType="slide"
                transparent={true}
                visible={visibleContext.visible}
            onRequestClose={() => {
                visibleContext.setVisible(false);
                setText('');
                setType('');
            }}>
            <View style={styles.container}>
                <View style={styles.view}>
                    <Text style={styles.header}>Type</Text>
                    <ModalDropdown options={types}
                        defaultIndex={0}
                        style={styles.dropdown}
                        textStyle={styles.dropdownSelectedText}
                        dropdownTextStyle={styles.dropdownText}
                        dropdownTextHighlightStyle={styles.dropdownSelectedText}
                        adjustFrame={dropdownAdjust}
                        onSelect={(idx, value) => {
                            setType(value);
                        }} />
                    {type === 'image' && 
                    <>
                        <Text style={styles.header}>Link</Text>
                        <TextInput onChangeText={(value) => setLink(value)}
                            value={link}
                            style={styles.inputLink}
                            placeholder="Enter link" />
                    </>
                    }
                    <Text style={styles.header}>Content</Text>
                    <TextInput onChangeText={(value)=>setText(value)}
                               value={text}
                               multiline={type !== 'image'}
                               style={styles.input}
                               placeholder="Enter content here"/>
                    <View style={styles.rowView}>
                        <TouchableOpacity style={[styles.button, { borderColor: 'grey' }]}
                            onPress={() => { 
                                visibleContext.setVisible(false);
                                setText('');
                                setType('');
                                 } }>
                            <Text style={styles.buttonText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { borderColor: 'green' }]}
                                          onPress={() => {
                                              console.log(type);
                                              onAdd(type, text, link, visibleContext.idx);
                                              visibleContext.setVisible(false);
                                              setText('');
                                              setType('');
                                            }}>
                            <Text style={styles.buttonText}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        margin: 30,
    },
    view: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        borderWidth: 1
    },
    header: {
        fontFamily: 'Ubuntu',
        fontSize: 25,
        textAlign: 'center'
    },
    rowView: {
        flexDirection: 'row'
    },
    button: {
        borderRadius: 15,
        borderWidth: 3,
        marginHorizontal: 10,
        marginVertical: 5
    },
    buttonText: {
        fontFamily: 'Ubuntu',
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 5
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        marginVertical: 10,
        minWidth: '40%',
    },
    dropdownSelectedText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dropdownText: {
        fontSize: 20,
    },
    input: {
        fontSize: 16,
        borderRadius: 3,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 15,
        width: '90%',
        backgroundColor: '#fffdf0'
    },
    inputLink: {
        fontSize: 16,
        borderRadius: 3,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 15,
        minWidth: '50%',
        backgroundColor: '#fffdf0'
    }
});