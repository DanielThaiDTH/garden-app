import React from 'react';
import { ImageBackground } from 'react-native';

function WelcomeScreen(props) {
    return (
        <ImageBackground 
        source = {require("./assets/icon.png")}
        ></ImageBackground>

    );
}

const styles = StyleSheet.create({
    background: {
        felx:1,
    },
})

export default WelcomeScreen;