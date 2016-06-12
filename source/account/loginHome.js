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

import { height, width, text } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let TopTabs = require('../sharedControls/tribleTopTabs');
let MobileLogin = require('./mobileLogin');
let SocialLogin = require('./socialLogin');
let UserNameLogin = require('./userNameLogin');

let isArabic = true;

class LoginHome extends Component {

    constructor(props) {
        super(props);
        let activeIndex = 0;
        if(this.props.activeTab && this.props.activeTab >= 1 && this.props.activeTab <= 3) {
            activeIndex = this.props.activeTab - 1;
        }
        this.state = {
            activeIndex: activeIndex,
            isLoading: false,
        };
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
    }
    switchTab(tabIndex) {
        if(!this.state.isLoading) {
            this.setState({ activeIndex: tabIndex, });
        }
    }
    userLoggedIn(notifyBack) {
        if(this.props.onLoggedin) {
            this.props.onLoggedin(notifyBack);
        }
    }
    
    render() {
        isArabic = this.props.isArabic;
        let activeIndex = this.state.activeIndex;
        let firstText = isArabic? 'بالجوال':'By Mobile';
        let secondText = isArabic? 'بالتواصل الاجتماعي':'By Social Media';
        let thirdText = isArabic? 'بالاسم':'By UserName';

        let currentTabContent = null;
        let loading = null;
        let self = this;
        if(this.state.isLoading) {
            loading = (
                <QCLoading />
            );
        }
        else {
            if(activeIndex == 2) {
                currentTabContent = (
                    <UserNameLogin isArabic={isArabic} navigator={this.props.navigator} 
                                    onLogin={(notifyBack) => self.userLoggedIn(notifyBack)}
                                    redirectInfo={this.props.redirectInfo} />
                );
            }
            else if(activeIndex == 1) {
                currentTabContent = (
                    <SocialLogin isArabic={isArabic} navigator={this.props.navigator} 
                                    onLogin={(notifyBack) => self.userLoggedIn(notifyBack)}
                                    redirectInfo={this.props.redirectInfo} />
                );
            }
            else {
                currentTabContent = (
                    <MobileLogin isArabic={isArabic} navigator={this.props.navigator} 
                                    onLogin={(notifyBack) => self.userLoggedIn(notifyBack)}
                                    redirectInfo={this.props.redirectInfo} />
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

module.exports = LoginHome;