import React,{ useState, useContext } from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from '../context/AppContext';
import LoginContext from '../context/LoginContext';

let styles;

/** Expects to be wrapped in a Menu Provider */
export default AppMenu = ({navigation, name}) => { 
    const [opened, setOpened] = useState(false);
    const context = useContext(AppContext);
    const loginContext = useContext(LoginContext);

    let logout = () => {
        context.setAccount(null);
        context.setLocation(null);
        context.setToken("");
        context.setCurUsername("");
        context.setZone(-1);
    };

    return (
            <Menu opened={opened} 
                  onBackdropPress={()=>{ 
                                  setOpened(false);}}
                  onSelect={value => setOpened(false)}
                >
                <MenuTrigger onPress={()=>setOpened(true)}>
                    <Ionicons name={'md-menu'} size={30}/>
                </MenuTrigger>
                <MenuOptions>
                    <Text style={styles.menuHeader}>
                        {(name && name.length > 0) ? name : "Guest"} 
                        {context.account && context.account.activeGarden ? ('\n' + context.account.activeGarden) : ""}
                    </Text>
                    <MenuOption value={1} 
                                text='Manage Gardens' 
                                disabled={!context.account}
                                customStyles={{optionText: styles.option}}
                                onSelect={() => {
                                        setOpened(false);
                                        navigation.push('garden-list', {initialAdd: false});
                                    }}>
                    </MenuOption>
                    <MenuOption value={2}
                                text='Manage Plants'
                                disabled={!context.account || !context.account.activeGarden}
                                customStyles={{optionText: styles.option}}
                                onSelect={() => {
                                        setOpened(false);
                                        navigation.push('plant-list');
                                    }}>
                    </MenuOption>
                    <MenuOption value={3} 
                                text={context.account?'Logout':'Login'}
                                customStyles={{ optionText: styles.option }}
                                onSelect={() => {
                                    if (context.account) {
                                        logout();
                                    } else {
                                        loginContext.setVisible(true);
                                    }
                                    setOpened(false);
                                }}/>
                </MenuOptions>
            </Menu>
    );
};

styles = StyleSheet.create({
    menuHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey'
    },
    option: {
        fontSize: 18
    }
});