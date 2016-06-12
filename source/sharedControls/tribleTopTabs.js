'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants'

let isArabic = true;

class TribleTopTabs extends Component {

    constructor(props) {
       super(props);
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }

    firstPressed() {
        if(this.props.onFirstPressed) {
            this.props.onFirstPressed();
        }
    }
    secondPressed() {
        if(this.props.onSecondPressed) {
            this.props.onSecondPressed();
        }
    }
    thirdPressed() {
        if(this.props.onThirdPressed) {
            this.props.onThirdPressed();
        }
    }
    
    render() {
        let props = this.props;
        let firstText = props.firstBtnText;
        let secondText = props.secondBtnText;
        let thirdText = props.thirdBtnText;
        let firstBadge = props.firstBtnBadge;
        let secondBadge = props.secondBtnBadge;
        let thirdBadge = props.thirdBtnBadge;
        let fBadge = null, ndBadge = null, rdBadge = null;

        let activeIndex = props.activeIndex;

        if(firstBadge) {
            fBadge = (
                <View style={styles.badge}><Text style={[styles.badgeText, text]}>{firstBadge}</Text></View>
            );
        }

        if(secondBadge) {
            ndBadge = (
                <View style={styles.badge}><Text style={[styles.badgeText, text]}>{secondBadge}</Text></View>
            );
        }

        if(thirdBadge) {
            rdBadge = (
                <View style={styles.badge}><Text style={[styles.badgeText, text]}>{thirdBadge}</Text></View>
            );
        }

        let thirdBtn = (
            <TouchableHighlight 
                    style={[styles.tabButton, activeIndex == 2 && styles.tabActive]}
                    onPress={() => {this.thirdPressed()}}
                    underlayColor={'transparent'}>
                <View style={styles.tabWrapper}>
                    {rdBadge}
                    <Text style={[styles.btnText, text]}>{thirdText}</Text>
                </View>
            </TouchableHighlight>
        );

        let secondBtn = (
            <TouchableHighlight 
                    style={[styles.tabButton, activeIndex == 1 && styles.tabActive]}
                    onPress={() => {this.secondPressed()}}
                    underlayColor={'transparent'}>
                <View style={styles.tabWrapper}>
                    {ndBadge}
                    <Text style={[styles.btnText, text]}>{secondText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstBtn = (
            <TouchableHighlight
                    style={[styles.tabButton, activeIndex == 0 && styles.tabActive]}
                    onPress={() => {this.firstPressed()}}
                    underlayColor={'transparent'}>
                <View style={styles.tabWrapper}>
                    {fBadge}
                    <Text style={[styles.btnText, text]}>{firstText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstCtrl, secondCtrl, thirdCtrl;
        if(isArabic) {
            firstCtrl = (
                thirdBtn
            );

            secondCtrl = (
                secondBtn
            );

            thirdCtrl = (
                firstBtn
            );
        }
        else {

            firstCtrl = (
                firstBtn
            );

            secondCtrl = (
                secondBtn
            );

            thirdCtrl = (
                thirdBtn
            );
        }

        return (
            <View style={styles.tabs}>
                {firstCtrl}
                {secondCtrl}
                {thirdCtrl}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#444444',
        width: width,
        height: 50,
        marginTop: -1,
    },
    tabButton: {
        flex: 1,
    },
    tabActive: {
        borderBottomWidth: 4,
        borderBottomColor: '#06aebb',
    },
    tabWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent:'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fe345a',
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'center',
    },
    badgeText: {
        color: 'white',
        textAlign: 'center',
    },
});

module.exports = TribleTopTabs;