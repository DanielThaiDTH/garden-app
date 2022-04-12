import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import { Constants } from 'expo-constants';
import { Alert, Touchable, TouchableOpacity } from 'react-native';
import {
     FlatList, 
     Text, 
     Image, 
     View,  
     TextInput, 
     Pressable, 
     Switch } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { generateDateObj, filterSearchByZone } from './utils';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import WeatherDisplay from './components/WeatherDisplay';
import AppMenu from './components/AppMenu';
import AppContext from './context/AppContext';
import LoginModal from './components/LoginModal';
import SettingsPage from './SettingsPage';
import { getCoordinates } from './service/LocationService';
import { searchPlant, searchBlog } from './service/SearchService';
import { calculatePlantRisk } from './utils';
import { API_URL } from './service/Constants';
import MainPageStyles from './styles/MainPageStyles';


let MainPage;
const styles = MainPageStyles;
const Tab = createBottomTabNavigator();




export default MainPage = ({navigation}) => {
    const context = useContext(AppContext);

    //Get location information
    useEffect(() => {
        getCoordinates(context);
        
        return () => {
           // mountRef.current = false;
        }
    }, [context.location]);


    //Get the hardiness zone
    useEffect(() => {
        (async () => {
            if (!context.location || context.zone > 0)
                return;
            
            if (context.account && context.account.getActiveGarden() &&
                                   context.account.getActiveGarden().zone &&
                                   context.account.getActiveGarden().zone > 0) {
                context.setZone(context.account.getActiveGarden().zone);
                return;
            }
            
            let response = await fetch(`${API_URL}/zone?lat=${
                                    context.location.coords.latitude}&lon=${
                                    context.location.coords.longitude}`);
            let resObj = await response.json();

            if (!resObj) {
                Alert.alert("Network error.");
            } else if (resObj.zone) {
                context.setZone(resObj.zone);
                if (context.account && context.account.activeGarden)
                    context.account.getActiveGarden().zone = resObj.zone;
            } else {
                Alert.alert(resObj.error);
            }
        })();
        return () => {
            //mountRef.current = false;
        }
    }, [context.location]);


    //Get the weather
    useEffect(() => {
        if (!context.location || !context.location.coords)
            return;

        const lat = context.location.coords.latitude;
        const long = context.location.coords.longitude;

        if (!lat || !long)
            return;

        console.log(lat + " " + long);
        fetch(`${API_URL}/weather?lat=${lat}&lon=${long}`)
            .then(res => res.json())
            .then(json => {
                if (!json || json.error) {
                    console.error(json ? json.error : "No data.");
                } else {
                    if (!json.current)
                        console.log(json);

                    json.current['date'] = generateDateObj(json.current.dt);
                    json.daily.forEach(d => {
                        d['date'] = generateDateObj(d.dt);
                    });
                    if (context.account) {
                        context.setRisk(calculatePlantRisk(json, context.account.getActiveGarden()));
                    }
                    context.setWeatherData(json);
                    //console.log(json);
                }
            }).catch(err => {
                console.log(err);
            });
        return () => {
        };
    }, [context.location]);

    //Renders options
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AppMenu navigation={navigation}
                    name={context.curUsername}
                />
            )
        });
    }, [navigation, context.curUsername]);


    const calculateRiskTotal = (type, gardenRisk) => {
        let riskPlants = gardenRisk.plantRisk.filter(pr => pr.risk.some(r => r === type));

        return riskPlants.length;
    }


    function HomeScreen()
    {
        const [isLoading, setLoading] = useState(false);
        const [connectError, setConnectError] = useState(false);
        const [filterOn, setFilterOn] = useState(true);
        const [data, setData] = useState(null);
        const [text, setText] = useState('');
        const [err, setErr] = useState('');
        const mountRef = useRef(true);

        /**
         * Searches for a plant
         * @param {string} text 
         */
        let search = (text) => {
            setLoading(true);
            searchPlant(text, context, setData, filterOn)
            .then((errMsg) => {
                if (errMsg) {
                    setErr(errMsg);
                    setConnectError(true);
                } else {
                    setConnectError(false);
                }
                setLoading(false);
            });
        };


        if (connectError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.searchLabel}>Plant Search</Text>
                    <TextInput
                        style={styles.searchbar}
                        placeholder="Enter plant to search for"
                        onChangeText={text => setText(text)}
                        onSubmitEditing={() => search(text)}
                        defaultValue={text}
                    />
                    <Text>{err}</Text>
                    <WeatherDisplay location={context.location} />
                    {context.zone > 0 &&
                        <Text style={styles.zoneMsg}>
                            Your hardiness zone is &nbsp;
                            <Text style={styles.zone}>
                                {context.zone}
                            </Text>
                        </Text>
                    }
                    <LoginModal />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Hello {(context.curUsername && context.curUsername.length > 0)? context.curUsername:"guest"}!</Text>
                {context.curUsername.length > 0 && context.account && context.account.getGardenCount() === 0 && 
                    <Pressable style={styles.addGarden}
                            onPress={()=>navigation.push('garden-list', {initialAdd: true})} >
                        <Text style={styles.addGardenText}>You have no gardens yet, add one here.</Text>
                    </Pressable> 
                }
                <Text style={styles.searchLabel}>Plant Search</Text>
                <TextInput
                    style={styles.searchbar}
                    placeholder="Enter plant to search for"
                    onChangeText={text => setText(text)}
                    onSubmitEditing={() => search(text)}
                    defaultValue={text}
                />
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Filter by climate: </Text>
                    <Switch onValueChange={()=>{setFilterOn(!filterOn)}}
                            value={filterOn}/>
                </View>
                {context.zone > 0 &&
                    <Text style={styles.zoneMsg}>
                        Your hardiness zone is &nbsp;
                        <Text style={styles.zone}>
                            {context.zone}
                        </Text>
                    </Text>
                }
                {!isLoading && data && data.length == 0 && <Text style={styles.searchNone}>No Results Found</Text>}
                {isLoading ? <ActivityIndicator size="large" color="#00ff00" /> :
                    (data && data.length > 0 &&
                        <View style={data.length > 0 ? styles.searchContainer : styles.searchContainerEmpty}>
                            <Shadow offset={[2, 3]} distance={5}>
                                <View style={styles.searchInterior}>
                                    <Text style={styles.listHeader}>Search Results</Text>
                                    <FlatList data={data}
                                        renderItem={({ item }) =>
                                            <View style={styles.listItem}>
                                                <Pressable onPress={()=>navigation.push('plant-info', { id: item.id })}
                                                    style={({ pressed }) => [{ 
                                                        backgroundColor: pressed ? '#d0c0a0' : 'beige', 
                                                        borderRadius: 3,
                                                        paddingHorizontal: 5
                                                        } ]}>
                                                    <Text>{item.name}</Text>
                                                    <Text style={styles.sub}>{item.botanicalName}</Text>
                                                </Pressable>
                                            </View>
                                        } />
                                </View>
                            </Shadow>
                        </View>
                    )}
                {context.risk && 
                <View style={styles.riskCard}>
                    <Text style={styles.riskText}>
                        The total amounts of plants at risk for your garden are: 
                    </Text>
                    <Text style={styles.riskText}>
                        <Ionicons name={'ios-snow'} color={'lightblue'} size={18}/>
                        {calculateRiskTotal("frost", context.risk)} At risk of frost
                    </Text>
                    <Text style={styles.riskText}>
                        <Ionicons name={'ios-sunny'} color={'orange'} size={18} />
                        {calculateRiskTotal("drought", context.risk)} At risk of drought
                    </Text>
                    <Text style={styles.riskText}>
                        <Ionicons name={'ios-flame'} color={'red'} size={18} />
                        {calculateRiskTotal("heat", context.risk)} At risk of heat
                    </Text>
                </View>}
                <LoginModal/>
            </View>
        );
    }

    function Forecast()
    {
        return (
            <View>
                <WeatherDisplay nav={navigation} data={context.weatherData}/>
            </View>
        );
    }

    function BlogScreen({navigation})
    {
        const [blogQuery, setBlogQuery] = useState('');
        const [blogResults, setBlogResults] = useState(null);
        const [noOfBlogs, setNoOfBlogs] = useState(0);
        const [blogLoading, setBlogLoading] = useState(false);
        const [tags, setTags] = useState([]);
        const [myBlogs, setMyBlogs] = useState([]);

        useEffect(() => {
            if ((myBlogs && (myBlogs instanceof Array) && myBlogs.length > 0) || !context || !context.account)
                return;

            
            fetch(`${API_URL}/blog/all/${context.account.id}`)
            .then(async (res) => {
                if (res.ok) {
                    let blogs = await res.json();
                    blogs.forEach(b => b.date = new Date(b.date));
                    setMyBlogs(blogs);
                } else {
                    Alert.alert((await res.json()).error);
                }
            }).catch(err => Alert.alert(err.message));

            return () => {
            }
        }, []);

        /**
         * Searches for a blog
         * @param {string} text 
         */
        let blogSearch = (text) => {
            setBlogLoading(true);
            searchBlog(text, tags)
                .then((res) => {
                    setBlogResults(res);
                    setNoOfBlogs(res.length);
                })
                .catch(err => Alert(err.message))
                .finally(() => setBlogLoading(false));
        };

        return (
        <View style={{flex: 1, padding: 5}}>
            {context.account &&
                    <TouchableOpacity onPress={() => navigation.push('blog-maker')}
                        style={styles.blogButton}>
                        <Text style={styles.blogButtonText}>
                            Make a Blog
                        </Text>
                    </TouchableOpacity> 
            }
                <Text style={styles.searchLabel}>Blog Search</Text>
                <TextInput
                    style={styles.searchbar}
                    placeholder="Enter blog to search for"
                    onChangeText={text => setBlogQuery(text)}
                    onSubmitEditing={() => blogSearch(blogQuery)}
                    defaultValue={blogQuery}
                />
                {blogLoading ? <ActivityIndicator size="large" color="#00ff00" /> :
                    (blogResults &&
                        <>
                            <View style={noOfBlogs > 0 ? styles.searchContainer : styles.searchContainerEmpty}>
                                {noOfBlogs > 0 && 
                                    <Shadow offset={[2, 3]} distance={5}>
                                        <View style={styles.searchInterior}>
                                            <Text style={styles.listHeader}>Search Results</Text>
                                            <FlatList data={blogResults}
                                                keyExtractor={item => item.BlogID}
                                                renderItem={({ item }) =>
                                                    <View style={styles.listItem}>
                                                        <Pressable onPress={() => navigation.push('blog', { id: item.BlogID })}
                                                            style={({ pressed }) => [{
                                                                backgroundColor: pressed ? '#d0c0a0' : 'beige',
                                                                borderRadius: 3,
                                                                paddingHorizontal: 5
                                                            }]}>
                                                            <Text>{item.Title}</Text>
                                                        </Pressable>
                                                    </View>
                                                } />
                                        </View>
                                    </Shadow>
                                }
                            </View>
                        { noOfBlogs === 0 && 
                        <Text style={styles.searchNone}>
                            No blog found with this search query. 
                        </Text> }
                        </>
                    )}
                {context.account && <Text style={styles.blogListHeader}>My Blogs</Text>}
                <FlatList data={myBlogs}
                        keyExtractor={blog => blog.id}
                        renderItem={({item}) => 
                            <View style={styles.blogItem}>
                                <Pressable style={styles.blogItemButton}>
                                    <Text style={styles.blogItemTitle}>{item.title}</Text>
                                    <Text style={styles.blogItemDate}>{item.date.toLocaleDateString()}</Text>
                                </Pressable>
                            </View>
                        }/>
        </View>
        );
    }

    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'forecast') {
                iconName = focused ? 'ios-cloud' : 'ios-cloud-outline';
              } else if (route.name === 'Settings') {
                  iconName = 'md-settings-outline'
              }else if (route.name === 'Blog') {
                iconName = 'md-create-outline';
              }
  
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} options={{title: "Welcome To Oracle"}} />
          <Tab.Screen name="forecast" component={Forecast} options={{title: "7-day Forecast"}} />
          <Tab.Screen name="Settings" component={SettingsPage} options={{title: "Settings"}}/>
          <Tab.Screen name="Blog" component={BlogScreen} options={{title: "Garden Blogs"}}/>
        </Tab.Navigator>
       
    );

};

