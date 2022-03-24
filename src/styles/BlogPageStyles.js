import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: Dimensions.get('window').height
    },
    blurContainer: {
        flex: 1, 
        width: '100%', 
        minHeight: '100%',
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    markdown: {
        width: Dimensions.get('window').width*0.8
    },
    ratingLine: {
        flexDirection: 'row',
    },  
    labels: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        fontWeight: 'bold'
    },
    ratingValue: {
        fontFamily: 'Ubuntu',
        textAlignVertical: 'center',
        paddingLeft: 5
    },
    ratingButton: {
        borderRadius: 15,
        borderWidth: 3,
        borderColor: 'blue',
        margin: 5,
        justifyContent: 'center'
    },
    ratingText: {
        textAlign: 'center',
        fontFamily: 'Ubuntu',
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 5
    }
});