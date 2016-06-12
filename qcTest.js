'use strict';
 
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import Dimensions from 'Dimensions';

class QCTest extends Component {

    constructor(props) {
       super(props);
    }

    generateContents() {
        let contents = [];
        for (let i = 0; i < 200; i++) {
          contents.push(
            <Text key={i}>My Awesome Content sss {i}</Text>
          );
        }

        return contents;
    }

    onScroll(e) {
        const {
          nativeEvent: {
            contentOffset: { y }
          }
        } = e;
        
        const { getBarRef } = this.context;
        getBarRef().setBarHeight(y);
    }
    
    render() {
        return (
          <ScrollView
            //onScroll={this.onScroll.bind(this)}
            scrollEventThrottle={16}
            style={{ flex: 1, marginBottom:55}}
            contentContainerStyle={{ alignItems: 'center' }}>
            {this.generateContents()}
          </ScrollView>
        );
    }
}

QCTest.contextTypes = {
    getBarRef: React.PropTypes.func
};

module.exports = QCTest; /* making it available for use by other files */