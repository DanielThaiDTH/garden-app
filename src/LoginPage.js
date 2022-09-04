import React, { useState, useContext, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import AppContext from './context/AppContext';
import Account from './model/Account';
import CreateModal from './components/CreateModal';
import LoginStyles from './styles/LoginStyles';
import { API_URL } from './service/Constants';

const styles = LoginStyles;

const CreateContext = createContext({
    createModalVisible: false,
    setCreateModalVisible: () => {}
});

/** The login page. Navigates to main page and uses the CreateModal to 
 * create new accounts.
 */
export default ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const context = useContext(AppContext);
    const createContextValue = {createModalVisible, setCreateModalVisible};

    /**
     * Calls the /login path with the provided credentials in 
     * the React state variables username and password.
     * @returns JSON containing JWT confirming logged in status.
     */
    const signIn = async () => {
        let res = await fetch(`${API_URL}/login`,
            {
                method: 'POST',
                headers:{ 'Content-Type': "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });
        return res;
    };

    /**
     * Calls /account path with a JWT and returns the response 
     * containing account information.
     * @param {string} token The JWT used for authorization. 
     * @returns Account information from the /account path
     */
    const accessAccount = async (token) => {
        let res = await fetch(`${API_URL}/account`,
            {
                headers: {'Authorization' : 'Bearer ' + token}
            });
        return res;
    }


    /**
     * Handler for sign-in event. If there is an account active, it 
     * will log out of the account. Otherwise calls signIn and stores 
     * the authenticated account, token and username. Stores account 
     * by calling accessAcount and storing the result in the app context.
     * Will alert on failure.
     */
    const signInPress = () => {
        if (context.curUsername && context.token) {
            context.setCurUsername("");
            context.setToken("");
            context.setAccount(null);
            context.setLocation(null);
            context.setZone(-1);
            context.setRisk(null);
        } else {
            signIn().then(res => {
                //console.log(res);
                if (res.ok) {
                    res.json().then(r => {
                        console.log(r.statusMsg);
                        context.setCurUsername(r.username);
                        //context.account.name = r.username;
                        context.setToken(r.id_token);
                        Alert.alert("Welcome " + r.username, "Don't forget to check and update your water cycle!", [{ text: "OK" }]);

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
    }

    return (

        <View style={styles.container}>
            <BlurView intensity={75*createModalVisible} tint='dark' style={styles.blurContainer}>
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
                    secureTextEntry={true}
                    value={password} />

                {/* <!--Loggin Button--> */}

                <View style={styles.fixToText}>
                    <TouchableOpacity style={styles.button}
                    onPress={() => navigation.push('home')}>
                        <Text style={styles.test}>{(context.curUsername && context.token) ? "Proceed to main page" : "Try it out!"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.buttonLoginColor]}
                                      onPress={signInPress}>
                        <Text style={styles.Login}>
                            {(context.curUsername && context.token)?"Logout" : "Login"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => { setCreateModalVisible(true) }}>
                    <Text style={styles.create2}>Create an Account</Text>
                    <Text style={styles.create}>Don&apos;t have an account?</Text>
                </TouchableOpacity>
            </BlurView>

            <CreateContext.Provider value={createContextValue}>
                <CreateModal cont={CreateContext}/>
            </CreateContext.Provider>

        </View>


    );
}






///////////////////////////////////////////////////////////////////////////////////////////
