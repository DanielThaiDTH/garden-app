import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, 
        secure, Image, ImageBackground, ImageBackgroundComponent, Alert } from 'react-native';
import { Modal } from 'react-native';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContext from './context/AppContext';

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgreen',
    },
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
        width: Dimensions.get('window').width*0.9,
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
        fontSize: 25,
        height: 45,
        width: Dimensions.get('window').width*0.9,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white',
        marginBottom: 15,
        borderWidth: 0.5,
        padding: 5,
    },
    passwordInput: {
        justifyContent: 'center',
        fontSize: 25,
        height: 45,
        width: Dimensions.get('window').width*0.9,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 0.5,
        padding: 5,
        backgroundColor: 'white'
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
    welcome: {
        fontSize: 50,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        marginBottom: 50,
    },
    welcome2: {
        fontSize: 50,
        fontStyle: "italic",
        justifyContent: 'center',
        alignItems: 'center',
        //fontFamily: 'Ubuntu'
    },
    createText: {
        fontSize: 20,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        marginHorizontal: 12,
        marginVertical: 5
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
        width: Dimensions.get('window').width*0.4,
        fontFamily: 'Ubuntu'
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
    createButtonText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width: Dimensions.get('window').width * 0.35,
        fontFamily: 'Ubuntu'
    },
    create: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Ubuntu',
        marginVertical: 10,
        width: Dimensions.get('window').width * 0.8 + 10,
    }, 

    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 25
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

export default LoginPage = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const { curUsername, setCurUsername, token, setToken } = useContext(AppContext);

    const signIn = async () => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/login',
            {
                method: 'POST',
                headers:{ 'Content-Type': "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });
        return res;
    };

    const createAccount = async () => {
        let res = await fetch('https://pure-plateau-52218.herokuapp.com/signup', 
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': "application/json" },
                                    body: JSON.stringify({ username: newUsername, password: newPassword })
                                });
        return res;
    }

    return (

        <View style={styles.container}>

            <Text style={styles.welcome2}>Welcome To</Text>
            <Text style={styles.welcome}>Green Garden Oracle</Text>

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
                    <Text style={styles.test}>{(curUsername && token) ? "Proceed to main page" : "Try it out!"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonLoginColor]}
                onPress={() => {
                    if (curUsername && token) {
                        setCurUsername("");
                        setToken("");
                    } else {
                        signIn().then(res => {
                            //console.log(res);
                            if (res.ok) {
                                res.json().then(r => {
                                    console.log(r.statusMsg);
                                    setCurUsername(r.username);
                                    setToken(r.id_token);
                                    Alert.alert("Success", "Logging in as " + r.username, [{ text: "OK" }]);
                                    navigation.push('home');
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
                        {(curUsername && token)?"Logout" : "Login"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, styles.buttonCreateColor]}
                              onPress={()=>{setCreateModalVisible(true)}}>
                <Text style={styles.create}>Create an Account</Text>
            </TouchableOpacity>

            <Modal animationType='slide'
                   transparent={true}
                   visible={createModalVisible}
                   onRequestClose={() => {
                       setNewPassword("");
                       setNewUsername("");
                       setCreateModalVisible(false);
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
                                                          Alert.alert("Account created", r.statusMsg ? r.statusMsg : "Error", [{text: "OK"}]);
                                                          setNewPassword("");
                                                          setNewUsername("");
                                                          setCreateModalVisible(false);
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
                                                        setCreateModalVisible(false);
                                                        setNewPassword("");
                                                        setNewUsername("");
                                          }}
                                          style={styles.createButtons}>
                            <Text style={styles.createButtonText}>Cancel</Text>
                        </TouchableOpacity>
                   </View>
                </View>
            </Modal>


        </View>





    );
}