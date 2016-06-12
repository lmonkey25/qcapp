'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import CheckBox from 'react-native-icon-checkbox';

class QCCheckboxVIcon extends Component {

    constructor(props) {
        super(props);
        this.clicked = false;
        this.state = {
            isChecked: false,
      		isRadioSelected: true,
        };
    }

    componentDidMount() {
        //alert("componentDidMount")
    }
    componentWillUnmount() {
        //alert("componentWillUnmount")
    }

    handlePressCheckedBox(checked) {
    	this.clicked = true;
	    this.setState({
			isChecked: checked,
	    });
	    if(this.props.onPressed) {
	    	this.props.onPressed(checked);
	    }
	}
    render() {
    	let isChecked;
    	if(this.state.isChecked && (this.clicked || this.props.freez)) {
    		isChecked = true;
    		this.clicked = false;
    	}
    	else {
    		isChecked = false;
    	}

    	let checkboxCtrl = (
    		<CheckBox
	          	label=""
	          	iconStyle={{marginLeft: 10,}}
	          	color={this.props.color}
	          	underlayColor='transparent'
	          	size={this.props.size}
	          	checked={isChecked}
	          	onPress={(checked) => this.handlePressCheckedBox(checked)} />
    	);

    	//alert(isChecked);

    	return (
    		checkboxCtrl
    	);
    }
}

QCCheckboxVIcon.defaultProps = { 
    checked: false,
    size : 30,
    color: '#06aebb',
    backgroundColor: '',
};

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 5,
    },
    checkbox: {
        width: 26,
        height: 26,
    },
    /*labelContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    label: {
        fontSize: 15,
        lineHeight: 15,
        color: 'grey',
    }*/
});

module.exports = QCCheckboxVIcon; /* making it available for use by other files */