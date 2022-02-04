import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';

import AppContext from '../context/AppContext';

let styles;

export default HardinessDisplay = ({zones}) => {
    const context = useContext(AppContext);

    if (zones && zones.length > 0) {
        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.zone}>
                        Min: <Text style={{color: 'blue'}}>{Math.min.apply(null, zones)}</Text>
                    </Text>
                    {
                    context.zone && context.zone > 0 && 
                    context.zone >= Math.min.apply(null, zones) &&
                    context.zone <= Math.max.apply(null, zones) &&
                    <Text style={[styles.zone, styles.zoneMatch]}>
                        {context.zone}
                    </Text>
                    }
                    <Text style={styles.zone}>
                        Max: <Text style={{color: 'red'}}>{Math.max.apply(null, zones)}</Text>
                    </Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                </View>
            </View>
        );
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get("window").width * 0.9,
    },
    rowContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }, 
    zone: {
        fontSize: 28,
        margin: 25,
        fontFamily: 'Ubuntu'
    },
    zoneMatch: {
        color: 'darkmagenta',
        borderWidth: 3,
        borderColor: 'green',
        paddingLeft: 10,
        paddingRight: 7
    }
});