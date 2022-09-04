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
import LoginContext from "./src/context/LoginContext"
import GardenPlantMgmt from "./src/GardenPlantMgmt"
import BlogPage from "./src/BlogPage"
import BlogMaker from "./src/BlogMaker"
import AccountReport from "./src/AccountReport"
import { API_URL } from "./src/service/Constants"
import Blog from "./src/model/Blog"
import GardenDimensions from "./src/GardenDimensions"

const NavStack = createNativeStackNavigator()

const App = () => {
  const [fontLoaded] = useFonts({
    Ubuntu: require("./assets/fonts/Ubuntu-Regular.ttf"),
    UbuntuItalic: require("./assets/fonts/Ubuntu-Italic.ttf"),
    UbuntuBold: require("./assets/fonts/Ubuntu-Bold.ttf"),
  })
  const [location, setLocation] = useState(null);
  const [curUsername, setCurUsername] = useState("");
  const [token, setToken] = useState("");
  const [account, setAccount] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [zone, setZone] = useState(-1);
  const [weatherData, setWeatherData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [risk, setRisk] = useState(null);
  const [riskCache, setRiskCache] = useState({});
  const [weatherCache, setWeatherCache] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const loginContextValue = { visible, setVisible };
  const getPlantName = (id, context) => {
    let found = context.plantInfo.find(pi => pi.UID === id);
    if (found)
      return found.plantName;
    else
      return "Name not found";
  };
  
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
      weatherCache,
      setWeatherCache,
      initialLoad,
      setInitialLoad,
      risk,
      setRisk,
      riskCache,
      getPlantName
    }),
    [curUsername, token, location, account, plantInfo, zone, weatherData, weatherCache, initialLoad, risk, riskCache]
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
              <NavStack.Screen
                name="blog"
                component={BlogPage}
                options={{title: "Blog"}}
              />
              <NavStack.Screen
                name="account-report"
                component={AccountReport}
                options={{ title: "Account" }}
              />
              <NavStack.Screen
                name="blog-maker"
                component={BlogMaker}
                options={{title: "Make a Blog"}}
              />
              <NavStack.Screen
                name="garden-dimension"
                component={GardenDimensions}
                options={{title: "Dimensions"}}
              />
              
            </NavStack.Navigator>
          </NavigationContainer>
        </MenuProvider>
      </LoginContext.Provider>
    </AppContext.Provider>
  )
}

export default App
