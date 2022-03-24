import React, { useEffect, useContext, useState, useLayoutEffect, createContext } from 'react';
import { ScrollView, View, Alert, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import Markdown from 'react-native-markdown-display';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { API_URL } from './service/Constants';
import Blog from './model/Blog';
import RatingModal from './components/RatingModal';
import AppContext from './context/AppContext';
import BlogPageStyles from './styles/BlogPageStyles';

const styles = BlogPageStyles;

/**
 * 
 * @param {{label: string, children: *}} params
 * @returns React component
 */
const RatingLine = ({label, children}) => {
    return (
        <View style={styles.ratingLine}>
            <Text style={styles.labels}>
                {label}
            </Text>
            {children}
        </View>
    );
};

/**
 * 
 * @param {{rating: number}} param0 
 * @returns React component
 */
const RatingStars = ({rating}) => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        let filled = [];

        for (let i = 0; i < 5; i++) {
            if (i + 0.5 < rating)
                filled.push('md-star');
            else if (i + 0.5 > rating && i < rating)
                filled.push('md-star-half');
            else
                filled.push('md-star-outline');
        }

        setStars(filled);

        return () => {
            
        }
    }, []);

    return (
        <>
            {stars.map((filledText, idx) => {
                    return (<Ionicons key={idx} name={filledText} size={20} color={'purple'} style={{ marginHorizontal: 3 }}/>);
            })}
        </>
    );
};


const RatingContext = createContext({
    visible: false,
    setVisible: () => {}
})


export default BlogPage = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [blogData, setBlogData] = useState(null);
    const [blogStyle, setBlogStyle] = useState({});
    const [rating, setRating] = useState(null);
    const [visible, setVisible] = useState(false);
    const ratingContextValue = { visible, setVisible };
    const { id } = route.params;


    useEffect(() => {
        if (!id)
            return;

        Blog.getBlog(id)
        .then((blog) => {
            //console.log(blog.markdown);
            //console.log(blog);
            setBlogData(blog);
        })
        .catch((err) => Alert.alert(err.message));

        if (!context.account)
            return;

        fetch(`${API_URL}/blog/rating/${id}?userID=${context.account.id}`, { headers: { Authorization: "Bearer " + context.token }})
        .then((res) => {
            if (res.ok) {
                res.json().then(result => setRating(result.rating));
            } else if (res.status !== 404) { //404 indicates no rating found, so no alert should be given
                res.json().then(obj => Alert.alert(obj.error));
            }
        }).catch(err => Alert.alert(err.message)); 

        return () => {
        }
    }, [id]);


    useLayoutEffect(() => {
        if (blogData instanceof Blog)
            navigation.setOptions({ title: blogData.title });
    }, [blogData]);


    const ratingUpdate = (newRating) => {
        const errHandle = (msg) => {
            Alert.alert(msg);
        }
        blogData.addUpdateRating(newRating, context.token, context.account.id, errHandle)
            .then(status => {

                if (!rating) 
                    blogData.ratingCount += 1;

                setRating(newRating);
            });
    };


    return (
        <ScrollView style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
            {blogData && 
            <BlurView intensity={75 * visible} tint='dark' style={styles.blurContainer}>
                <Markdown style={styles.markdown}>
                    {blogData.markdown}
                </Markdown>
                <View style={{borderTopWidth: 1, width: '100%', alignSelf: 'center'}}>
                    <RatingLine label={'Average Rating:'}>
                        <RatingStars rating={blogData.rating}/>
                        <Text style={styles.ratingValue}>
                            {blogData.rating}
                        </Text>
                    </RatingLine>
                    <RatingLine label={'Reviews:'}>
                        <Text style={styles.ratingValue}>
                            {blogData.ratingCount}
                        </Text>
                    </RatingLine>
                    {context.account && 
                    <>
                        {rating && 
                        <RatingLine label={'Your Rating:'}>
                            <Text style={styles.ratingValue}>
                                {rating}
                            </Text>
                        </RatingLine>}
                        {rating? 
                        <TouchableOpacity style={styles.ratingButton}
                                          onPress={() => setVisible(true)}>
                            <Text style={styles.ratingText}>Update Rating</Text>
                        </TouchableOpacity>
                        :
                            <TouchableOpacity style={styles.ratingButton}
                                              onPress={() => setVisible(true)}>
                            <Text style={styles.ratingText}>Add Rating</Text>
                        </TouchableOpacity>
                        }
                    </>
                    }
                </View>
                <RatingContext.Provider value={ratingContextValue}>
                    <RatingModal viewContext={RatingContext} onUpdate={ratingUpdate} />
                </RatingContext.Provider>
            </BlurView>
            }
        </ScrollView>
    );
};