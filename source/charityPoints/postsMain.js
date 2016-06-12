'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

var PostList = require('./PostList');
var GroupButtons = require('./GroupButtons');
let isArabic = true;

class PostsMain extends Component {
    constructor(props) {
       super(props);
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    componentWillUnmount() {
    }
    
    render() {
        return (
            <View style={styles.container}>
                <GroupButtons navigator={this.props.navigator} isArabic={isArabic} />
                <PostList navigator={this.props.navigator} isArabic={isArabic} currentUser={this.props.currentUser} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginBottom:55,
    },
});
module.exports = PostsMain;