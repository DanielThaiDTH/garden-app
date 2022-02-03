import React, { useEffect, useState, useContext, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, 
        secure, Image, ImageBackground, ImageBackgroundComponent, Alert } from 'react-native';
import { Modal } from 'react-native';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContext from './context/AppContext';
import Account from './model/Account';
import CreateModal from './components/CreateModal';

let styles;

const CreateContext = createContext({
    createModalVisible: false,
    setCreateModalVisible: () => {}
});

export default LoginPage = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const context = useContext(AppContext);
    const createContextValue = {createModalVisible, setCreateModalVisible};

    const signIn = async () => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/login',
            {
                method: 'POST',
                headers:{ 'Content-Type': "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });
        return res;
    };

    const accessAccount = async (token) => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/account',
            {
                headers: {'Authorization' : 'Bearer ' + token}
            });
        return res;
    }

    return (

        <View style={styles.container}>

            <Image style={styles.image} source={require('../assets/Image3.jpg')} />
            <Text style={styles.welcome}>Green Garden Oracle</Text>
            <Text style={styles.textUnderMain}>Your One Stop Gardening App</Text>
            <Text style={styles.welcomeBack}>Welcome Back!</Text>
            <Text style={styles.welcome2}>Sign in to continue</Text>
            {/* <!--Username--> */}
            <TextInput
                style={styles.usernameInput}
                placeholder="Username"
                onChangeText={name => setUsername(name)}
                value={username} />
            {/* <!--Password--> */}
            <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                onChangeText={pass => setPassword(pass)}
                secureTextEntry={secure}
                secureTextEntry={true}
                value={password} />

            {/* <!--Loggin Button--> */}

            <View style={styles.fixToText}>
                <TouchableOpacity style={styles.button}
                onPress={() => navigation.push('home')}>
                    <Text style={styles.test}>{(context.curUsername && context.token) ? "Proceed to main page" : "Try it out!"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonLoginColor]}
                onPress={() => {
                    if (context.curUsername && context.token) {
                        context.setCurUsername("");
                        context.setToken("");
                        context.setAccount(null);
                    } else {
                        signIn().then(res => {
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
                                                navigation.push('home');
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
                        });
                    }
                }}>
                    <Text style={styles.Login}>
                        {(context.curUsername && context.token)?"Logout" : "Login"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => { setCreateModalVisible(true) }}>
                <Text style={styles.create2}>Create an Account</Text>
                <Text style={styles.create}>Don't have an account?</Text>
            </TouchableOpacity>

            <CreateContext.Provider value={createContextValue}>
                <CreateModal cont={CreateContext}/>
            </CreateContext.Provider>

        </View>


    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
        paddingTop: 0
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
        width: Dimensions.get("window").width*1.2,
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
        fontSize: 25,
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
        fontStyle: "italic",
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 5,
        color: '#818589'
        //fontFamily: 'Ubuntu'
    },
    welcomeBack: {
        color: '#4F7942',
        bottom: 10,
        fontSize: 25
    },
    test:
    {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 25,
        marginVertical: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.4,
        fontFamily: 'Ubuntu',
    },
    Login: {
        justifyContent: 'center',
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
        bottom: 29
    },
    create2: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        marginVertical: 10,
        width: Dimensions.get('window').width * 0.8 + 10,
        bottom: 29,
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






///////////////////////////////////////////////////////////////////////////////////////////
