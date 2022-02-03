import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

let styles;

/** Expects to be wrapped in a Menu Provider */
export default AppMenu = ({navigation, name, active}) => { 
    const [opened, setOpened] = useState(false);
    

    return (
            <Menu opened={opened} 
                  onBackdropPress={()=>{ 
                                  setOpened(false);}}
                onSelect={value => setOpened(false)}
                >
                <MenuTrigger text='Settings' onPress={()=>setOpened(true)}/>
                <MenuOptions>
                    <Text style={styles.menuHeader}>
                        {(name && name.length > 0) ? name : "Guest"}
                    </Text>
                    <MenuOption value={1} 
                                text='Manage Gardens' 
                                disabled={!active}
                                customStyles={{optionText: styles.option}}
                                onSelect={() => navigation.push('garden-list', {initialAdd: false})}>
                    </MenuOption>
                    <MenuOption value={2} 
                                text={active?'Logout':'Login'}
                                customStyles={{ optionText: styles.option }}
                                onSelect={() => {

                                }}/>
                </MenuOptions>
            </Menu>
    );
};

styles = StyleSheet.create({
    menuHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'darkgrey'
    },
    option: {
        fontSize: 16
    }
});