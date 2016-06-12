'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
  	Image,
  	Text,
  	View,
  	TouchableHighlight,
} from 'react-native';


class QCCheckbox extends Component {

    constructor(props) {
        super(props);
        this.clicked = false;
        this.state = {
            currentCheckSource: require('image!check_normal'),
            checked: this.props.checked,
        };
    }

    componentDidMount() {
        //alert("componentDidMount")
    }
    componentWillUnmount() {
        //alert("componentWillUnmount")
    }
    
    changed() {//alert()
        var ischecked = !this.state.checked;
        this.clicked = true;
        this.setState({
            checked: ischecked, 
            currentCheckSource: ischecked ? this.props.checkedIcon : this.props.uncheckedIcon, 
        });
        if(this.props.onChange){//alert(2)
            this.props.onChange(ischecked, this);
        }
/*
      	var ischecked = !this.state.checked;
        
      	this.clicked = true;
        var source;
        //alert(this.props.selected)
        if(!this.props.selected && !ischecked) {
            source = this.props.uncheckedIcon;
        }
        else if((ischecked && this.clicked) || this.props.selected){

            source = this.props.checkedIcon;

        }
        else {
            source = this.props.uncheckedIcon;
        }
        //alert(ischecked + ' ' + this.clicked)
        this.setState({
            checked: ischecked,
            currentCheckSource: source,
        });
      	if(this.props.onChange){
        		this.props.onChange(ischecked, this);
      	}*/
  	}

  
    render() {//alert(this.state.checked + ' ' + this.clicked)
        var source;// = this.props.uncheckedIcon;// this.state.currentCheckSource;//require('./icons/cb_disabled.png');
        //alert(source)
        if(this.state.checked && this.clicked) {
           //alert();
            source = this.props.checkedIcon;//require('./icons/cb_enabled.png');
            //alert(this.state.checked + ' 44 ' + this.clicked)
            //tct += ' ' + 1
        }
        else {
          source = this.props.uncheckedIcon;
            //tct += ' ' + 2
        }
        this.clicked = false;
/*
        var source = this.state.currentCheckSource;
        if(!this.props.selected && !this.state.checked) {
            source = this.props.uncheckedIcon;
        }
        else if((this.state.checked && this.clicked) || this.props.selected){

            source = this.props.checkedIcon;

        }
        else {
            source = this.props.uncheckedIcon;
        }
if(this.props.id == 'selectAll') {
                //alert('1 ' + this.props.selected)
        }*/
      	/*if((this.state.checked && this.clicked) || this.props.selected){

        		source = this.props.checkedIcon;
            if(this.props.id == 'selectAll') {
                alert('1 ' + source.uri)
            }
      	}
        else {
            source = this.props.uncheckedIcon;
            if(this.props.id == 'selectAll') {
                alert('2 ' + source.uri)
            }
        }
  		  this.clicked = false;
        if(this.props.id == 'selectAll') {
                alert('0 ' + source.uri)
            }*/
      	var container = (
          	<View style={[styles.container, {flexDirection: 'column'}]}>
              	<Image style={styles.checkbox} source={source} />
          	</View>
      	);
        //alert(source.uri)
      	return (
        		<TouchableHighlight onPress={this.changed.bind(this)} underlayColor='transparent'>
          		  {container}
        		</TouchableHighlight>
      	);
    }
}

QCCheckbox.defaultProps = { 
    checked: false,
    checkedIcon : require('image!check_checked'),
    uncheckedIcon : require('image!check_normal'), 
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

module.exports = QCCheckbox; /* making it available for use by other files */