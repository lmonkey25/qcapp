'use strict';
  
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image, 
    View,
    ScrollView,
    ListView,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants';

let QCLoading =  require('../../qcLoading');
let TopTabs = require('../sharedControls/tribleTopTabs');
let MobileRegister = require('./mobileRegister');
let SocialRegister = require('./socialRegister');
let UserNameRegister = require('./userNameRegister');

let isArabic = true;

class RegisterHome extends Component {

    constructor(props) {
       super(props);
        this.state = {
            activeIndex: 0,
            isLoading: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    componentWillUnmount() {
    }
    switchTab(tabIndex) {
        if(!this.state.isLoading) {
            this.setState({ activeIndex: tabIndex, });
        }
    }
    
    render() {

        let activeIndex = this.state.activeIndex;
        let firstText = isArabic? 'بالجوال':'By Mobile';
        let secondText = isArabic? 'بالتواصل الاجتماعي':'By Social Media';
        let thirdText = isArabic? 'بالاسم':'By UserName';

        let currentTabContent = null;
        let loading = null;

        if(this.state.isLoading) {
            loading = (
                <QCLoading />
            );
        }
        else {
            if(activeIndex == 2) {
                currentTabContent = (
                    <UserNameRegister isArabic={isArabic} navigator={this.props.navigator} redirectInfo={this.props.redirectInfo} />
                );
            }
            else if(activeIndex == 1) {
                currentTabContent = (
                    <SocialRegister isArabic={isArabic} navigator={this.props.navigator} redirectInfo={this.props.redirectInfo} />
                );
            }
            else {
                currentTabContent = (
                    <MobileRegister isArabic={isArabic} navigator={this.props.navigator} redirectInfo={this.props.redirectInfo} />
                );
            }
        }
        return (
            <View style={styles.container}>
                <TopTabs isArabic={isArabic} 
                         firstBtnText={firstText} 
                         secondBtnText={secondText} 
                         thirdBtnText={thirdText} 
                         activeIndex={activeIndex}
                         onFirstPressed={() => this.switchTab(0)}
                         onSecondPressed={() => this.switchTab(1)}
                         onThirdPressed={() => this.switchTab(2)} />
                <ScrollView style={{flex: 1,}} contentContainerStyle={[styles.contentContainer]}>
                    {loading}
                    {currentTabContent}
                </ScrollView>
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
    contentContainer: {
        width: width - 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
});

module.exports = RegisterHome;