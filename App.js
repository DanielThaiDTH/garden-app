import React, { useEffect, useState, useMemo } from "react"
import { Constants } from "expo-constants"
import { Alert } from "react-native"
//import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, ToastAndroid } from 'react-native';
import * as Location from "expo-location"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useFonts } from "expo-font"
import { MenuProvider } from "react-native-popup-menu"
import AppContext from "./src/context/AppContext"
import MainPage from "./src/MainPage"
import PlantInfo from "./src/PlantInfo"
import Forecast from "./src/Forecast"
import LoginPage from "./src/LoginPage"
import GardenMgmt from "./src/GardenMgmt"
import Account from "./src/model/Account"
import LoginContext from "./src/context/LoginContext"
import GardenPlantMgmt from "./src/GardenPlantMgmt"
import { API_URL } from "./src/service/Constants"

const NavStack = createNativeStackNavigator()

const App = () => {
  const [fontLoaded] = useFonts({
    Ubuntu: require("./assets/fonts/Ubuntu-Regular.ttf"),
    UbuntuItalic: require("./assets/fonts/Ubuntu-Italic.ttf"),
    UbuntuBold: require("./assets/fonts/Ubuntu-Bold.ttf"),
  })
  const [location, setLocation] = useState(null)
  const [curUsername, setCurUsername] = useState("")
  const [token, setToken] = useState("")
  const [account, setAccount] = useState(null)
  const [plantInfo, setPlantInfo] = useState(null)
  const [zone, setZone] = useState(-1)
  const [weatherData, setWeatherData] = useState(null)
  const [visible, setVisible] = useState(false)
  const loginContextValue = { visible, setVisible }
  const contextValue = useMemo(
    () => ({
      curUsername,
      setCurUsername,
      token,
      setToken,
      location,
      setLocation,
      account,
      setAccount,
      plantInfo,
      setPlantInfo,
      zone,
      setZone,
      weatherData,
      setWeatherData,
    }),
    [curUsername, token, location, account, plantInfo, zone, weatherData]
  )

  useEffect(() => {
    if (plantInfo) return () => {}

    fetch(API_URL).then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => setPlantInfo(data))
          .catch((err) => Alert.alert("Unable to parse data"))
      } else {
        Alert.alert("Unable to load plant information")
      }
    })
  }, [plantInfo])

  if (!fontLoaded) return null

  return (
    <AppContext.Provider value={contextValue}>
      <LoginContext.Provider value={loginContextValue}>
        <MenuProvider>
          <NavigationContainer>
            <NavStack.Navigator
              initialRouteName="login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#90e080",
                  flexDirection: "row",
                  justifyContent: "space-around",
                },
                headerTitleStyle: { fontWeight: "bold" },
                headerTitleAlign: "center",
              }}
            >
              <NavStack.Screen
                name="login"
                component={LoginPage}
                options={{ title: "Login" }}
              />
              <NavStack.Screen
                name="home"
                component={MainPage}
                initialParams={{ location: location }}
                options={{ title: "Green Garden Oracle" }}
              />
              <NavStack.Screen
                name="plant-info"
                component={PlantInfo}
                options={{ title: "Plant Information" }}
              />
              <NavStack.Screen
                name="forecast"
                component={Forecast}
                options={{ title: "7-day Forecast" }}
              />
              <NavStack.Screen
                name="garden-list"
                component={GardenMgmt}
                options={{ title: "Garden Managment" }}
              />
              <NavStack.Screen
                name="plant-list"
                component={GardenPlantMgmt}
                options={{ title: "Plant Management" }}
              />
            </NavStack.Navigator>
          </NavigationContainer>
        </MenuProvider>
      </LoginContext.Provider>
    </AppContext.Provider>
  )
}

export default App
