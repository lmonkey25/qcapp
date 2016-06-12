'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View, 
    Text,
    Image,
} from 'react-native';

//import { Dimensions } from 'react-native'
//var {height, width} = Dimensions.get('window');
import { height, width } from './source/utilities/constants'
//let height = 9, width = 0;


class QCLoading extends Component {

    render() {		
        return (
          	<View style={[styles.loading,]}>
      				  <Image source={require('./contents/icons/loading.gif')} 
      						      style={[{resizeMode: 'contain',}]} />
      			</View>
        );
  	}
}


let loadingWidth = width;
if(loadingWidth > 100) {
    loadingWidth = 100;
}
var styles = StyleSheet.create({  	
    loading: {
      	backgroundColor: 'white', 
      	width: loadingWidth, 
      	height: loadingWidth, 
      	justifyContent: 'center', 
      	alignItems: 'center', 
      	borderRadius: 10,
      	position: 'absolute',
      	left: (width - loadingWidth) / 2,
      	top: (height - loadingWidth) / 3,
    },
});
module.exports = QCLoading;