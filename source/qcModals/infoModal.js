'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

var Modal = require('react-native-modalbox');

import { height, width, text } from '../utilities/constants'

let isArabic = true;

class InfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    openModal1(id) {
        this.refs.modal1.open();
    }
    onClose() {
        if(this.props.onClosed) {
            this.props.onClosed();
        }
    }
    onOpen() {
        if(this.props.onOpened) {
            this.props.onOpened();
        }
    }
    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }

    render() {

        let details = this.props.details;//new DomParser().parseFromString(this.props.details,'text/html').querySelect('p')
        if(details){
            details = details.replace(/(<([^>]+)>)/ig , "");
        }
      	return (
            <Modal  isOpen={this.props.isOpen} position={"center"} style={[styles.modal, styles.modal1]} ref={"modal1"} 
                    /*swipeToClose={this.state.swipeToClose} */
                    onClosed={() => this.onClose()} 
                    onOpened={() => this.onOpen()} 
                    onClosingState={() => this.onClosingState()}>
                <View style={styles.title}>
                    <Text style={[styles.titleText, text]}>{this.props.title}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={[styles.detailsText, text]}>{details}</Text>
                </View>
            </Modal>
      	);
    }
}


var styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        width: width *.9, 
        height: width *.7, 
        backgroundColor: "white",
        borderRadius: 3,
    },
    title: {
        width: width *.9,
        height: 60,
        justifyContent: 'center', 
        alignItems: 'flex-end',
        padding: 15,
    },
    titleText: {
        fontSize: 15,
        textAlign: 'right',
    },
    details: {        
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'flex-end',
        padding: 15,
        paddingTop: 0,
    },
    detailsText: {
        fontSize: 13,
        textAlign: 'right',
    },
});

module.exports = InfoModal; /* making it available for use by other files */