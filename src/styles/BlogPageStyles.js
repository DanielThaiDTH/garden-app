import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginHorizontal: 15,
        marginVertical: 7
    },
    markdown: {
        width: Dimensions.get('window').width*0.8
    }
});