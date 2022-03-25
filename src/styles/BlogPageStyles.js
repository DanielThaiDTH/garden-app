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
    section: {
        borderWidth: 1, 
        borderRadius: 10,
        marginTop: 25,
        padding: 10,
        width: '100%', 
        alignSelf: 'center' 
    },
    tagHeader: {
        fontSize: 20,
        fontFamily: 'UbuntuBold',
        marginBottom: 10
    },
    tagView: {
        flexWrap: "wrap",
        flexDirection: 'row',
        maxWidth: Dimensions.get('window').width*0.9
    },
    tagPill: {
        borderRadius: 25,
        fontSize: 18,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        color: '#aa3080',
        backgroundColor: '#e5b5d5',
        borderWidth: 2,
        borderColor: '#aa3080',
        paddingHorizontal: 8, 
        paddingVertical: 3,
        marginVertical: 5,
        marginHorizontal: 10
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