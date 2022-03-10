import {
    Modal, 
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    secure,
    Alert
} from 'react-native';

import React, {
    useState,
    useContext
} from 'react';

import { API_URL } from '../service/Constants';

let styles;

export default CreateModal = ({cont}) => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const context = useContext(cont)

    const createAccount = async () => {
        let res = await fetch(API_URL + '/signup',
            {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ username: newUsername, password: newPassword })
            });
        return res;
    }

    return (
        <Modal animationType='slide'
            transparent={true}
            visible={context.createModalVisible}
            onRequestClose={() => {
                setNewPassword("");
                setNewUsername("");
                context.setCreateModalVisible(false);
            }}>
            <View style={styles.createContainer}>
                <View style={styles.createView}>
                    <Text style={styles.createText}>
                        Enter your account username and password
                    </Text>
                    <TextInput
                        style={styles.usernameCreateInput}
                        placeholder="Username"
                        onChangeText={name => setNewUsername(name)}
                        value={newUsername} />
                    <TextInput
                        style={styles.passwordCreateInput}
                        placeholder="Password"
                        onChangeText={pass => setNewPassword(pass)}
                        secureTextEntry={secure}
                        secureTextEntry={true}
                        value={newPassword} />
                    <TouchableOpacity style={[styles.createButtons, styles.createButtonOk]}
                        onPress={() => {
                            createAccount().then(res => {
                                if (res.ok) {
                                    res.json().then(r => {
                                        Alert.alert("Account created", r.statusMsg ? r.statusMsg : "Error", [{ text: "OK" }]);
                                        setNewPassword("");
                                        setNewUsername("");
                                        context.setCreateModalVisible(false);
                                    });
                                } else {
                                    res.json().then(resObj => {
                                        Alert.alert("Unable to create account", resObj.error, [{ text: "OK" }]);
                                    });
                                }
                            })
                        }}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => {
                        context.setCreateModalVisible(false);
                        setNewPassword("");
                        setNewUsername("");
                    }}
                        style={styles.createButtons}>
                        <Text style={styles.createButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

styles = StyleSheet.create({
    createContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    createView: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.9,
        shadowColor: '#002211',
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.2,
        padding: 10
    },
    usernameCreateInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        width: Dimensions.get('window').width * 0.8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderWidth: 0.5,
        padding: 5,
    },
    passwordCreateInput: {
        justifyContent: 'center',
        fontSize: 20,
        height: 40,
        width: Dimensions.get('window').width * 0.8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 0.5,
        padding: 5,
        backgroundColor: 'white'
    },
    createButtonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu'
    },
    button: {
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        justifyContent: 'center'
    },
    buttonLoginColor: {
        borderColor: '#666620'
    },
    buttonCreateColor: {
        borderColor: '#0033AA'
    },
    createButtons: {
        borderWidth: 2,
        borderRadius: 12,
        margin: 5
    },
    createButtonOk: {
        borderColor: '#90e080'
    }

});