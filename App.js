import React, { useEffect, useState } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, ToastAndroid } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import MainPage from './src/MainPage';
import PlantInfo from './src/PlantInfo';
import Forecast from './src/Forecast';
import LoginPage from './src/LoginPage';

let styles;
const NavStack = createNativeStackNavigator();

const App = () => {
  const [fontLoaded] = useFonts({ 
    Ubuntu: require("./assets/fonts/Ubuntu-Regular.ttf")});
  const [location, setLocation] = useState(null);

  if (!fontLoaded) return null;

  // useEffect(() => {
  //   (async () => {
  //     if (location) return;
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission to access location was denied');
  //       return;
  //     }

  //     let firstlocation = await Location.getCurrentPositionAsync({});
  //     setLocation(firstlocation);
  //     console.log(location);
  //   })();
  // }, []);

  return (
    <NavigationContainer>
      <NavStack.Navigator initialRouteName="login" 
        screenOptions={{
          headerStyle: { backgroundColor: '#90e080' },
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center'
      }}>
        <NavStack.Screen name="login" component={ LoginPage } options={{title: "Login"}}/>
        <NavStack.Screen name="home" 
                         component={ MainPage } 
                         initialParams={{ location: location }}
                         options={{ title: "Green Garden Oracle" }}/>
        <NavStack.Screen name="plant-info" component={ PlantInfo } options={{ title: "Plant Information"}}/>
        <NavStack.Screen name="forecast" component={Forecast} options={{title: "7-day Forecast"}}/>
      </NavStack.Navigator>
    </NavigationContainer>
  );

};


export default App;