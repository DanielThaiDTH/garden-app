import React, { useEffect, useState, useContext, useRef, Component, useCallback } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant';
import DimensionModal from './components/DimensionModal';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: "#fff",
        padding: 6,
        margin: 2,
        paddingBottom: 10

      },
      input: {
        paddingHorizontal: 10,
        borderWidth: 1
      },
      text1: {
          fontSize: 20,
          fontWeight: "bold",
          textAlign: 'center'
      },
      text2: {
          fontSize: 17,
          fontFamily: "sans-serif-condensed",
      },
      para1:{

        fontSize: 15,
        fontFamily: "sans-serif-light"

      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      buttonStyle: {
          color: 'red'
      },
      listTitle: {
        fontFamily: 'Ubuntu',
        fontSize: 25
      },
      gardenCard: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'space-around',
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10
      },
      gardenCardHeader: {
        fontFamily: "UbuntuBold",
        fontSize: 18
      },
      errorMsg: {
        fontFamily: 'Ubuntu',
        color: 'darkred'
      },
      updateView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 15
      },
      updateButton: {
        borderWidth: 5,
        borderRadius: 20,
        borderColor: '#a08730',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'center',
        justifyContent: 'center'
      },
      updateText: {
        fontFamily: 'Ubuntu',
        fontSize: 18,
      }

});


export default GardenDimensions  = ({navigation}) => {
  const context = useContext(AppContext);    
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [selectedGarden, setSelectedGarden] = useState(null);
    const [updateDim, setUpdateDim] = useState(() => {});
    const [modalVisible, setModalVisible] = useState(false);
    const [gardenList, setGardenList] = useState(context.account.getGardens() ?? []);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const showBadAlert = () =>{
        Alert.alert(
            "Dimensions Failure",
            "Garden Dimensions: Please Enter Valid Dimensions ",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Failure button checked!"),
                style: 'cancel'
              }
            ]
          )
    }

    const showAlert = () =>{
        Alert.alert(
            "Dimensions Sucess",
            "Garden Dimensions: Garden Dimensions Valid ",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Success button checked!"),
                style: 'cancel'
              }
            ]
          )

    }

    const showDimensionsAlert = () =>{
        Alert.alert(
            "Dimensions Low",
            "Garden Dimensions: 10' X 10' Garden is considered when planting for a small garden.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Dimensions button checked!"),
                style: 'cancel'
              }
            ]
          )
    }

    const showBigAlert = () =>{

        Alert.alert(
            "Dimensions Large",
            "Garden Dimensions: Average family garden pens size from 20' X 40', consider a smaller size ",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Dimensions button checked!"),
                style: 'cancel'
              }
            ]
          )

    }


    const Sum = () =>
    {
        var N1 = parseInt(length);
        var N2 = parseInt(width);

        var R = N1 * N2;

        if(R <=0){
            showBadAlert();
            
         } else if (R < 100) {
            showDimensionsAlert();
        } else if (R > 800)
        {
            showBigAlert();
        }
        else{
            showAlert();
        }
        // alert(R);
    }

    const dimCheck = (len, wid) => {
      let n1 = parseInt(len);
      let n2 = parseInt(wid);

      let r = n1*n2;

      if (r <= 0) {
        return (<Text style={styles.errorMsg}>Impossible dimensions</Text>);
      } else if (r < 100) {
        return (<Text style={styles.errorMsg}>Garden is too small.</Text>);
      } else if (r > 800) {
        return (<Text style={styles.errorMsg}>Garden is too large.</Text>);
      }
      else {
        return (<></>);
      }
    }
    
        return(
            <ScrollView style={styles.container}>
                {context.account && 
                  <>
                  <Text style={styles.listTitle}>Your Gardens</Text>
                    {gardenList.map(g => {
                      return (
                        <View key={g.id} style={styles.gardenCard}>
                          <View>
                            <Text style={styles.gardenCardHeader}>{g.name}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Width:</Text> {g.width/12}'</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Length:</Text> {g.length/12}'</Text>
                            {dimCheck(g.length/12, g.width/12)}
                          </View>
                          <View style={styles.updateView}>
                            <TouchableOpacity style={styles.updateButton}
                                              onPress={()=> {
                                                setLength(g.length);
                                                setWidth(g.width);
                                                setModalVisible(true);
                                                setSelectedGarden(g);
                                              }}>
                              <Text style={styles.updateText}>Change</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </>
                }
                <View >
                    <TextInput style={styles.input} placeholder=" Enter Length (feet)" onChangeText={len => setLength(length)}/>
                    <TextInput style={styles.input} placeholder=" Enter Width (feet)" onChangeText={wid => setWidth(wid)}/>
                    <Text></Text>
                    <Button style={styles.buttonStyle} title='Check Dimensions Of Garden' onPress={Sum}/>
                </View>
                <Text></Text>
                <View>
                    <Text style={styles.text1}>How Much Space Do You Need?</Text>
                    <Text></Text>
                    <Text >Gardens Dimension Facts to Consider</Text>
                    <Text style={styles.para1}>
                        1) Using the same space to plant multiple vegetables, will vary in your garden size as each vegatable
                        will grow at different times and of different size.
                    </Text>
                    <Text></Text>
                    
                    <Text>
                    2) Gardens should be specfic to related plants;         
                    </Text>
                    <Text style={styles.para1}>Spring Garden: Lettuce, Spinach, Cabbage</Text>
                    <Text style={styles.para1}>Summer Garden: Tomatoes, Squash, Cucumbers</Text>
                    <Text style={styles.para1}>Full Size Garden: Cabbage, Squash, Root Vegetables</Text>

                    <Text></Text>

                    <Image
                    style={{width: 350, height: 175}}
                    source={require('../assets/garden.jpg')}
                    />
                </View>
                <DimensionModal length={length}
                                width={width}
                                visible={modalVisible}
                                garden={selectedGarden}
                                complete={() => { setModalVisible(false); setGardenList(context.account.getGardens())}}
                                cancel={() => { setModalVisible(false);}}/>
            </ScrollView>
        )
}