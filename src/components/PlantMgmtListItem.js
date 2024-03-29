import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Shadow } from "react-native-shadow-2";

import AppContext from "../context/AppContext";
import GardenPlantMgmtStyles from "../styles/GardenPlantMgmtStyles";
import { futureWater } from "../service/WateringService";

const styles = GardenPlantMgmtStyles

/**
 * A garden plant information card.
 * @param {{
 * item: *,
 * selectedID: number,
 * pressCallback: callbackFn,
 * expandCallback: callbackFn,
 * infoCallback: callbackFn,
 * plantDateCallback: callbackFn,
 * waterCallback: callbackFn}} param0.item
 * @returns React component
 */
const PlantMgmtListItem = ({
  item,
  selectedID,
  pressCallback, //For pressing the item
  expandCallback, //For pressing the expand button
  infoCallback, //For plant information button
  plantDateCallback, //For update plant date button
  waterCallback, //For watering updates
  currentRisk
}) => {
  const context = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const [waterValue, setWaterValue] = useState(0);

    console.log(item);

  const expandPanel = () => {
      setExpanded(!expanded);
      if (expandCallback && (expandCallback instanceof Function))
        expandCallback();
  };

  const plantIsAtRisk = (type) => {
      if (!currentRisk || !currentRisk.plantRisk)
        return false;

      let plant = currentRisk.plantRisk.find(pr => pr.id === item.id);
      if (plant)
          return plant.risk.some(r => r === type);
      else
        return false;
  }

  return (
      <View style={styles.itemShadow}>
        <Shadow offset={[2, 3]}
                distance={1}
                startColor="#0D0D0D20"
                finalColor="#F0F0F02A">
            <TouchableOpacity onPress={pressCallback} style={styles.plantItem}>
            <View style={styles.itemMainView}>
                <View style={[styles.horizontalView, styles.divider]}>
                    <View style={styles.iconView}>
                        {plantIsAtRisk("frost") && <Ionicons name={'ios-snow'} color={"lightblue"} size={18}/>}
                        {plantIsAtRisk("drought") && <Ionicons name={'ios-sunny'} color={"orange"} size={18} />}
                        {plantIsAtRisk("heat") && <Ionicons name={'ios-flame'} color={"red"} size={18} />}
                    </View>
                    <Text
                        style={
                        item.id === selectedID
                            ? styles.plantSelectedName
                            : styles.plantName
                        }
                    >
                        {context.getPlantName(item.plantID, context)}
                    </Text>
                    <Text style={{alignSelf: 'center'}}>
                        {item.plantDate
                        ? item.plantDate.toLocaleDateString()
                        : "Not planted yet"}
                    </Text>
                    <TouchableOpacity onPress={expandPanel}>
                        <Ionicons name={expanded ? "ios-chevron-up" : "ios-chevron-down"} size={30} color={"grey"} />
                    </TouchableOpacity>
                </View>
                {expanded && (
                    <>
                    {/* <View style={styles.horizontalView}> */}
                        <TouchableOpacity
                        onPress={plantDateCallback}
                        style={styles.plantButton}
                        >
                        <Text style={styles.plantButtonText}>
                            {item.plantDate ? "Update" : "Plant"}
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={infoCallback} style={styles.infoButton}>
                        <Text style={styles.infoText}>Plant Information </Text>
                        <Ionicons
                            name={"md-information-circle"}
                            size={30}
                            color={"blue"}
                        />
                        </TouchableOpacity>
                    {/* </View> */}
                              <Text style={styles.waterInfo}>This plant has a water {item.waterDeficit > 0 ? "deficit" : "surplus"} of {item.waterDeficit.toFixed(2)}in.</Text>
                    <Text style={styles.waterInfo}>
                        This plant has a water {item.waterDeficit > 0 ? "deficit" : "surplus"} of {futureWater(item.waterDeficit, context, item.plantID).toFixed(2)}in over the next week.
                    </Text>
                    <View style={styles.horizontalView}>
                        <TextInput keyboardType="numeric"
                                    placeholder="Enter amount of water (inches)."
                                    style={styles.waterInput}
                                    onChangeText={value => {
                                        if (value.length > 0 && !isNaN(parseFloat(value)))
                                            setWaterValue(parseFloat(value))
                                    }}/>
                        <TouchableOpacity style={styles.waterButton}
                                        onPress={()=>waterCallback(waterValue)}>
                            <Text style={styles.waterButtonText}>Water Plant</Text>
                        </TouchableOpacity>
                    </View>

                    </>
                )}
            </View>
            </TouchableOpacity>
        </Shadow>
      </View>
  )
}

export default PlantMgmtListItem;
