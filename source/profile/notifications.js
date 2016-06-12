'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let isArabic = true;

class Notifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    
    pressed() {
      	if(this.props.onPressed){
        	this.props.onPressed();
      	}
  	}
  
    render() {
        let sponsershipsText = isArabic? 'متأخرات كفالات':'Sponserships Overdue';
        let projectsText = isArabic? 'مستحقات مشاريع':'Projects Overdue';
        
        let loading = null, contents = [];

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {
            contents.push(
                <View key={1} style={styles.rowContainer}>
                    <TouchableHighlight 
                        style={[styles.rowToutch,]}
                        onPress={() => this.pressed()}
                        underlayColor={'transparent'}>
                        <View style={styles.contentWrapers}>
                            <View style={styles.badgeWrapper}>
                                <View style={styles.badge}><Text style={[styles.badgeText, text]}>{5}</Text></View>
                            </View>
                            <View style={styles.titleWrapper}>
                                <Text style={[styles.title, text]}>{sponsershipsText}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            );

            contents.push(
                <View key={2} style={styles.rowContainer}>
                    <TouchableHighlight 
                        style={[styles.rowToutch,]}
                        onPress={() => this.pressed()}
                        underlayColor={'transparent'}>
                        <View style={styles.contentWrapers}>
                            <View style={styles.badgeWrapper}>
                                <View style={styles.badge}><Text style={[styles.badgeText, text]}>{12}</Text></View>
                            </View>
                            <View style={styles.titleWrapper}>
                                <Text style={[styles.title, text]}>{projectsText}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        }

      	return (
        	<View style={styles.container}>
                {loading}
                {contents}
            </View>
      	);
    }
}

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 5,
    },
    rowContainer: {
        width: width,
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
    },
    rowToutch: {
        flex: 1,
    },
    contentWrapers: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent:'center',
    },
    badgeWrapper: {
        width: 80,
    },
    titleWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        textAlign: 'right',
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

module.exports = Notifications; /* making it available for use by other files */