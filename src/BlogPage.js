import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { ScrollView, View, Alert, Text, TouchableOpacity, Touchable } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { API_URL } from './service/Constants';
import Blog from './model/Blog';
import AppContext from './context/AppContext';
import BlogPageStyles from './styles/BlogPageStyles';

const styles = BlogPageStyles;

export default BlogPage = ({navigation, route}) => {
    const context = useContext(AppContext);
    const [blogData, setBlogData] = useState(null);
    const [blogStyle, setBlogStyle] = useState({});
    const [rating, setRating] = useState(null);
    const { id } = route.params;

    useEffect(() => {
        if (!id)
            return;

        Blog.getBlog(id)
        .then((blog) => {
            console.log(blog.markdown);
            console.log(blog);
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
    }, [blogData])

    return (
        <ScrollView style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
            {blogData && 
            <>
                <Markdown style={styles.markdown}>
                    {blogData.markdown}
                </Markdown>
                <View>
                    <Text>Average Rating: {blogData.rating}</Text>
                    <Text>Reviews: {blogData.ratingCount}</Text>
                    {context.account && 
                    <>
                        {rating && <Text>Your Rating: {rating}</Text>}
                        {rating? 
                        <TouchableOpacity>
                            <Text>Update Rating</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity>
                            <Text>Add Rating</Text>
                        </TouchableOpacity>
                        }
                    </>
                    }
                </View>
            </>
            }
        </ScrollView>
    );
};