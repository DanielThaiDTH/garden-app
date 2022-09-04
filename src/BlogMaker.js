import React, { useEffect, useState, useContext, createContext } from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert, Image, TextInput, Touchable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

import Blog from './model/Blog';
import BlogBuilder from './model/BlogBuilder';
import AppContext from './context/AppContext';
import SectionAddModal from './components/SectionAddModal';

let styles;

const MakeBlogContext = createContext({
    visible: false,
    setVisible: () => {},
    idx: 0,
    setIdx: () => {}
});

/**
 * A section of a blog that is being created. Send the type of section in 
 * type, send the content in children and callback to call on close in close.
 * @param {{type: string, children: React.Element, close: callbackFn}} param0 
 * @returns 
 */
const Section = ({type, children, close}) => {
    return(
        <View style={styles.section}>
            <View style={styles.leftSection}>
                <Text style={styles.type}>{type}</Text>
                <TouchableOpacity style={styles.remove}
                                  onPress={close}>
                    <Ionicons name={'md-close'} size={20} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={styles.rightSection}>
                {children}
            </View>
        </View>
    );
};

/**
 * Adds a new blog section after the specified index. Add handling 
 * to be provided in callback.
 * @param {{callback: callbackFn, index: number}} param0 
 * @returns 
 */
const AddSection = ({callback, index}) => {
    return (
        <TouchableOpacity style={styles.addSection}
                          onPress={() => callback(index)}>
            <Ionicons name={'md-add'} color={'darkgreen'} size={30}/>
        </TouchableOpacity>
    );  
};

/**
 * A deletable tag. Value is the tag name and onDelete handles 
 * the delete tag event.
 * @param {{value: string, onDelete: callbackFn}} param0 
 * @returns 
 */
const DeleteableTag = ({value, onDelete}) => {
    return (
        <View style={styles.tag}>
            <Text style={styles.tagText}>
                {value}
            </Text>
            <TouchableOpacity onPress={() => onDelete(value)}>
                <Ionicons name={'md-close'} color={'darkred'} size={18}/>
            </TouchableOpacity>
        </View>
    );
};

/** Block maker page. Can create blogs section by section. Also allows adding
 * tags to a blog.
 */
export default BlogMaker = ({navigation}) => {
    const [blogBuilder, setBlogBuilder] = useState(new BlogBuilder());
    const [visible, setVisible] = useState(false);
    const [idx, setIdx] = useState(0);
    const [title, setTitle] = useState('');
    const [newTag, setNewTag] = useState('');
    const [tagList, setTagList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [sectionLength, setSectionLength] = useState(0);
    const context = useContext(AppContext);
    const blogContextValue = { visible, setVisible, idx, setIdx };


    const addComponent = (i) => {
        setIdx(i);
        setVisible(true);
    }

    const addHandler = (type, text, link, idx) => {
        console.log(type);
        if (type === 'image') {
            blogBuilder.addImage(link, text, idx);
        } else if (type === 'quote') {
            blogBuilder.addQuote(text, idx);
        } else {
            blogBuilder.addBlockSection(text, type, idx);
        }

        setSectionList(blogBuilder.markdownComponentList);
        setSectionLength(sectionLength + 1);
    }

    const removeSection = (i) => {
        console.log("removing section " + i);
        blogBuilder.removeSection(i);
        setSectionList(blogBuilder.markdownComponentList);
        setSectionLength(sectionLength - 1);
    }

    const saveBlog = () => {

        if (!title || title.length === 0) {
            Alert.alert("You are missing the title.");
            return;
        } else if (sectionLength === 0) {
            Alert.alert("You have no content on the blog.");
            return;
        }

        let blog = blogBuilder.buildBlog();
        blog.title = title;
        blog.userID = context.account.id;
        console.log(blog);

        blog.saveBlog(context.token, (msg) => Alert.alert(msg))
        .then((status) => {
            if (status) {
                Alert.alert(`Your blog ${title} has been saved.`);
                navigation.pop();
            }
        });
    }

    const deleteTag = (value) => {
        blogBuilder.removeTag(value);
        setTagList(blogBuilder.getTagList());
    }

    const componentSelector = (c, idx) => {
        if (c.type === 'image') {
            //console.log(c.link);
            return (<Image source={{ uri: c.link }} style={styles.imageStyle}/>);
        } else if (c.type === 'regular') {
            return (<Text style={styles.regular}>{c.text}</Text>);
        } else if (c.type === 'h1') {
            return (<Text style={styles.h1}>{c.text}</Text>);
        } else if (c.type === 'h2') {
            return (<Text style={styles.h2}>{c.text}</Text>);
        } else if (c.type === 'h3') {
            return (<Text style={styles.h3}>{c.text}</Text>);
        } else if (c.type === 'quote') {
            return (<Text style={styles.quote}>{c.raw}</Text>);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <BlurView intensity={75*visible} tint={'dark'} style={styles.viewContainer}>
                <Text style={styles.title}>Create Your blog</Text>
                <View style={{flexDirection: 'row', marginVertical: 20 }}>
                    <Text style={styles.addText}>Title: </Text>
                    <TextInput onChangeText={(value) => setTitle(value)}
                               value={title}
                               style={styles.titleInput}
                               placeholder='Enter the blog title'/>
                </View>
                {sectionLength > 0 ?
                    sectionList.map((c, i) => {
                        return (
                            <View key={c.type + i} style={{ alignItems: 'center' }}>
                                <Section type={c.type} close={() => removeSection(i)}>
                                    {componentSelector(c, i)}
                                </Section>
                                {i + 1 < blogBuilder.markdownComponentList.length && <AddSection callback={addComponent} index={i + 1} />}
                            </View>
                        );
                    }) : <></>
                }
                <AddSection callback={addComponent} index={-1}/>
                <Text style={styles.addText}>Add Tags: </Text>
                <TextInput onSubmitEditing={() => { 
                    blogBuilder.addTag(newTag); 
                    setTagList(blogBuilder.getTagList());
                    setNewTag('');
                }}
                           onChangeText={(value) => setNewTag(value)}
                           value={newTag}
                           style={styles.tagInput}
                           placeholder='Enter a new tag'/>
                <View style={styles.tagView}>
                    {tagList.map(t => (<DeleteableTag key={t} value={t} onDelete={deleteTag} />))}
                </View>
                <TouchableOpacity style={styles.addButton}
                                  onPress={saveBlog}>
                    <Ionicons name={'md-add'} size={25} color={'green'} />
                    <Text style={styles.addText}>
                        Add Blog
                    </Text>
                </TouchableOpacity>
            </BlurView>
            <MakeBlogContext.Provider value={blogContextValue}>
                <SectionAddModal viewContext={MakeBlogContext} onAdd={addHandler}/>
            </MakeBlogContext.Provider>
        </ScrollView>
    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    viewContainer: {
        flex: 1,
        width: '100%',
        minHeight: '100%',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'UbuntuBold',
        fontSize: 30
    },  
    titleInput: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 25,
        paddingHorizontal: 20
    },  
    section: {
        borderColor: '#A0A0A0',
        borderRadius: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginVertical: 10,
        width: Dimensions.get('window').width*0.9
    },
    leftSection: {
        borderRightWidth: 1,
        paddingVertical: 20,
        flexDirection: 'column',
        alignItems: 'center'
    },
    rightSection: {
        padding: 20
    },
    type: {
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        padding: 10,
        fontFamily: 'UbuntuBold',
        fontSize: 20,
        margin: 5
    },
    remove: {
        backgroundColor: 'red',
        borderRadius: 40,
        padding: 10,
        maxWidth: 40,
        marginVertical: 10
    },
    addSection: {
        width: Dimensions.get('window').width*0.9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'darkgrey',
        paddingVertical: 10,
        marginVertical: 20
    },
    addButton: {
        borderWidth: 3,
        borderColor: 'green',
        borderRadius: 10,
        paddingVertical: 5, 
        paddingHorizontal: 15,
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    addText: {
        fontFamily: 'Ubuntu',
        fontSize: 25
    },
    h1: {
        fontSize: 25,
        fontWeight: 'bold',
        maxWidth: Dimensions.get('window').width*0.6
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
        maxWidth: Dimensions.get('window').width * 0.6
    },
    h3: {
        fontSize: 18,
        fontWeight: 'bold',
        maxWidth: Dimensions.get('window').width * 0.6
    },
    regular: {
        fontSize: 16,
        maxWidth: Dimensions.get('window').width * 0.6
    },
    quote: {
        borderLeftColor: 'grey',
        borderLeftWidth: 10,
        paddingLeft: 20,
        backgroundColor: 'lightgrey',
        fontFamily: 'monospace'
    },
    imageStyle: {
        width: Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").height * 0.3,
        resizeMode: 'contain'
    },
    tagInput: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 18,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 3,
        marginVertical: 10
    },  
    tag: {
        borderRadius: 20,
        backgroundColor: '#e5b5d5',
        borderWidth: 2,
        borderColor: '#aa3080',
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginVertical: 5,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    tagText: {
        fontSize: 18,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
        color: '#aa3080',
        paddingRight: 5
    },
    tagView: {
        flexWrap: "wrap",
        flexDirection: 'row',
        maxWidth: Dimensions.get('window').width * 0.9
    },
});
