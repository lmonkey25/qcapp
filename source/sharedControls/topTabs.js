'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import { height, width } from '../utilities/constants'

let isArabic = true;

class TopTabs extends Component {

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
    
    render() {
        let props = this.props;
        let firstText = props.firstBtnText;
        let secondText = props.secondBtnText;
        let firstBadge = props.firstBtnBadge;
        let secondBadge = props.secondBtnBadge;
        let fBadge = null, ndBadge = null;

        let activeIndex = props.activeIndex;

        if(firstBadge) {
            fBadge = (
                <View style={styles.badge}><Text style={styles.badgeText}>{firstBadge}</Text></View>
            );
        }

        if(secondBadge) {
            ndBadge = (
                <View style={styles.badge}><Text style={styles.badgeText}>{secondBadge}</Text></View>
            );
        }

        let secondBtn = (
            <TouchableHighlight 
                    style={[styles.tabButton, activeIndex == 1 && styles.tabActive]}
                    onPress={() => {this.secondPressed()}}
                    underlayColor={'transparent'}>
                <View style={styles.tabWrapper}>
                    {ndBadge}
                    <Text style={[styles.btnText,]}>{secondText}</Text>
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
                    <Text style={[styles.btnText,]}>{firstText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstCtrl, secondCtrl;
        if(isArabic) {
            firstCtrl = (
                secondBtn
            );

            secondCtrl = (
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
        }

        return (
            <View style={styles.tabs}>
                {firstCtrl}
                {secondCtrl}
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
        fontFamily: 'Janna New R',
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
        fontFamily: 'Janna New R',
    },
});

module.exports = TopTabs;