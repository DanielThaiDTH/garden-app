import React, { useEffect, useState, useContext, useRef, Component } from 'react';
import { Alert, Modal, Platform, Dimensions } from 'react-native';
import { FlatList, Text, Image, View, ScrollView, StyleSheet, Button, TextInput, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from './context/AppContext';
import Garden from './model/Garden';
import Account from './model/Account';
import Plant from './model/Plant'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: "#fff",
        padding: 6,
        margin: 2,
        paddingBottom: 10

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
      }

});


export default class GardenDimensions extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {Num1: 0, Num2: 0};
    }

    showBadAlert = () =>{
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

    showAlert = () =>{
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

    showDimensionsAlert = () =>{
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

    showBigAlert = () =>{

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


    Sum = () =>
    {
        var N1 = parseInt(this.state.Num1);
        var N2 = parseInt(this.state.Num2);

        var R = N1 * N2;

        if(R <=0){
            this.showBadAlert();
            
        }else if (R < 100) {
            this.showDimensionsAlert();
        }else if (R > 800)
        {
            this.showBigAlert();
        }
        else{
            this.showAlert();
        }
        // alert(R);

    }

    render()
    {
        return(
            <ScrollView style={styles.container}>

                <View >
                    <TextInput style={{borderWidth: 1,margin: 10}} placeholder=" Enter Length" onChangeText={Num1 => this.setState({Num1})}/>
                    <TextInput style={{borderWidth: 1,margin: 10}} placeholder=" Enter Width" onChangeText={Num2 => this.setState({Num2})}/>
                    <Text></Text>
                    <Button style={styles.buttonStyle} title='Check Dimensions Of Garden' onPress={this.Sum}/>
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

            </ScrollView>

        )
    }
}