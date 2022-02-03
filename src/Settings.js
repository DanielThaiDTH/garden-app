import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking, Touchable, TouchableOpacity } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AppMenu from './components/AppMenu';
import AppContext from './context/AppContext';

export default Settings = ({navigation, name}) => {
    return (
        <View>
            <Text>{name}</Text>
        </View>
    );
};