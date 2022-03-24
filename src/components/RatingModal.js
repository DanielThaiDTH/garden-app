import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert
} from "react-native";

import React, { useContext, useState, useEffect } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import { API_URL } from "../service/Constants";
import AppContext from "../context/AppContext";

let styles;

/** Presents a rating modal. viewContext should be a React context value and the onUpdate 
 * should be a callback that will run when the rating changes.
*/
export default RatingModal = ({ viewContext, onUpdate }) => {
    const context = useContext(AppContext);
    const visibleContext = useContext(viewContext);
    const [stars, setStars] = useState([]);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        let temp = [];
        for (let i = 0; i < 5; i++) {
            temp.push("md-star-outline");
        }
        setStars(temp);
        console.log(visibleContext);

        return () => {};
    }, []);

    const ratingSelect = (val) => {
        setRating(val);
        setStars(stars.map((_, i) => {
            if (i < val)
                return "md-star";
            else
                return "md-star-outline";
        }));
    };

    const confirmRating = () => {
        onUpdate(rating);
        Alert.alert("Rating of " + rating + " given to this blog.");
        visibleContext.setVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibleContext.visible}
            onRequestClose={() => {
                visibleContext.setVisible(false);
            }}
        >
            <View style={styles.container}>
                <View style={styles.ratingView}>
                    <Text style={styles.header}>Give your rating</Text>
                    <View style={styles.rowView}>
                        <TouchableOpacity onPress={() => ratingSelect(1)}>
                            <Ionicons
                                name={stars[0]}
                                size={30}
                                color={"purple"}
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ratingSelect(2)}>
                            <Ionicons
                                name={stars[1]}
                                size={30}
                                color={"purple"}
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ratingSelect(3)}>
                            <Ionicons
                                name={stars[2]}
                                size={30}
                                color={"purple"}
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ratingSelect(4)}>
                            <Ionicons
                                name={stars[3]}
                                size={30}
                                color={"purple"}
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ratingSelect(5)}>
                            <Ionicons
                                name={stars[4]}
                                size={30}
                                color={"purple"}
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowView}>
                        <TouchableOpacity style={[styles.button, { borderColor: 'grey' }]}
                                        onPress={() => visibleContext.setVisible(false)}>
                            <Text style={styles.buttonText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {borderColor: 'green'}]}
                                          onPress={confirmRating}>
                            <Text style={styles.buttonText}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
    },
    ratingView: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.9,
        padding: 10
    },
    header: {
        fontFamily: 'Ubuntu',
        fontSize: 25,
        textAlign: 'center'
    },
    rowView: {
        flexDirection: 'row'
    },
    button: {
        borderRadius: 15,
        borderWidth: 3,
        marginHorizontal: 10,
        marginVertical: 5
    },
    buttonText: {
        fontFamily: 'Ubuntu',
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 5
    }
});