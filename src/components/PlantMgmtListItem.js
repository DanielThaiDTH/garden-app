import React, {useEffect, useContext, useState} from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppContext from '../context/AppContext';
import GardenPlantMgmtStyles from '../styles/GardenPlantMgmtStyles';

const styles = GardenPlantMgmtStyles;

export default ({
  item,
  selectedID,
  pressCallback, //For pressing the item
  expandCallback, //For pressing the expand button
  infoCallback, //For plant information button
  plantDateCallback //For update plant date button
}) => {
    const context = useContext(AppContext);
    return (
        <TouchableOpacity onPress={pressCallback}
            style={styles.plantItem}>
                <View style={styles.itemMainView}>
                    <View style={[styles.horizontalView, styles.divider]}>
                        <Text style={item.id === selectedID ? styles.plantSelectedName : styles.plantName}>
                            {context.getPlantName(item.plantID, context)}
                        </Text>
                        <Text>
                            {item.plantDate ? item.plantDate.toLocaleDateString() : "Not planted yet"}
                        </Text>
                        <TouchableOpacity >
                            <Ionicons name={'ios-chevron-down'} size={30} color={'grey'}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.horizontalView}>
                        <TouchableOpacity onPress={plantDateCallback}
                            style={styles.plantButton}>
                            <Text style={styles.plantButtonText}>
                                {item.plantDate ? "Update" : "Plant"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={infoCallback}
                                          style={styles.infoButton}>
                                <Text style={styles.infoText}>Plant Information </Text>
                            <Ionicons name={'md-information-circle'} size={30} color={'blue'} />
                        </TouchableOpacity>
                    </View>
                </View>
        </TouchableOpacity>
    );
};
