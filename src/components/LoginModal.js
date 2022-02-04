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

import Account from '../model/Account';
import AppContext from '../context/AppContext';
import LoginContext from '../context/LoginContext';



let styles;

export default LoginModal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const context = useContext(AppContext);
    const viewContext = useContext(LoginContext);

    const signIn = async () => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/login',
            {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });
        return res;
    };

    const accessAccount = async (token) => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/account',
            {
                headers: { 'Authorization': 'Bearer ' + token }
            });
        return res;
    };

    const loadAccount = (res) => {
            //console.log(res);
            if (res.ok) {
                res.json().then(r => {
                    console.log(r.statusMsg);
                    context.setCurUsername(r.username);
                    //context.account.name = r.username;
                    context.setToken(r.id_token);
                    Alert.alert("Success", "Logging in as " + r.username, [{ text: "OK" }]);

                    accessAccount(r.id_token)
                        .then(acc => {
                            if (acc.ok) {
                                acc.json().then(account => {
                                    context.setAccount(new Account(account));
                                    viewContext.setVisible(false);
                                }).catch(err => Alert.alert("Account access error", err.message, [{ text: "OK" }]));
                            } else {
                                Alert.alert("Account access expired, try logging in again");
                                context.setCurUsername("");
                                context.setToken("");
                            }
                        }).catch(err => Alert.alert("Account access error", err.error, [{ text: "OK" }]));

                });
            } else {
                res.json().then(resObj => {
                    Alert.alert("Unable to Login", resObj.error, [{ text: "OK" }]);
                });
            }
    }
    

    const signInPress = () => {
        if (context.curUsername && context.token) {
            context.setCurUsername("");
            context.setToken("");
            context.setAccount(null);
            context.setLocation(null);
            context.setZone(-1);
        } else {
            signIn().then(loadAccount).catch(err => Alert.alert("Network error"));
        }
    };

    return (
        <Modal animationType='slide'
            transparent={true}
            visible={viewContext.visible}
            onRequestClose={() => {
                setPassword("");
                setUsername("");
                viewContext.setVisible(false);
            }}>
            <View style={styles.container}>
                <View style={styles.view}>
                    <Text style={styles.text}>
                        Enter your account username and password
                    </Text>
                    <TextInput
                        style={styles.usernameInput}
                        placeholder="Username"
                        onChangeText={name => setUsername(name)}
                        value={username} />
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        onChangeText={pass => setPassword(pass)}
                        secureTextEntry={secure}
                        secureTextEntry={true}
                        value={password} />
                    <TouchableOpacity style={[styles.buttons, styles.buttonOk]}
                        onPress={signInPress}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => {
                        viewContext.setVisible(false);
                        setPassword("");
                        setUsername("");
                    }}
                        style={styles.buttons}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    view: {
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
    usernameInput: {
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
    passwordInput: {
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
    buttonText: {
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
    buttons: {
        borderWidth: 2,
        borderRadius: 12,
        margin: 5
    },
    buttonOk: {
        borderColor: '#90e080'
    }

});
