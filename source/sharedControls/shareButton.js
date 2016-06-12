'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants'

let btnWidth, btnHeight, btnBGColor = '';
let isArabic = true;

class ShareButton extends Component {

    constructor(props) {
        super(props);
        btnBGColor = this.props.color == 'blue' ? '#06aebb' : this.props.color == 'transparent' ? 'transparent' : '#fe345a';
        btnWidth = this.props.width;
        btnHeight = this.props.height;
        this.state = {
            inProcess: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    
    pressed() {//alert(this.props.onPressed)
      	if(this.props.onPressed){
        	this.props.onPressed();
      	}
  	}
  
    render() {
        let btnText = (<Text style={[styles.btnText, text]}>{this.props.text}</Text>);
        let icon = null;
        if(!this.props.icon && this.props.icon != null) {
            icon = (<Image style={[styles.img,]} source={this.props.icon} />);
        }
        let underlayColor = btnBGColor;
        let style = this.props.style;
        let btn;

        if(!isArabic) {
            btn = (
                <View style={styles.wrapper}>
                    {icon}
                    {btnText}
                </View>
            );
        }
        else {
            btn = (
                <View style={styles.wrapper}>
                    {btnText}
                    {icon}
                </View>
            );
        }

        let type = this.props.type;
        let shareBtn = null;
        switch(type) {
            case 1://Campaign Share
                shareBtn = (
                    <TouchableHighlight onPress={() => this.share()} 
                                    style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                        <View style={styles.iconContainer}>
                          <Image source={require("image!ic_share")} style={styles.icon} />
                          <Text style={[styles.label, text]}>{shareText }</Text>
                        </View>
                    </TouchableHighlight>
                );
                break;
        }

      	return (
        		<TouchableHighlight 
                    style={[styles.button, 
                        {
                            backgroundColor: btnBGColor,
                            height: btnHeight,
                            width: btnWidth,
                            borderWidth: 1,
                            borderColor: this.props.color == 'transparent' ? 'white' : 'transparent',
                        }, style]}
                    onPress={() => this.pressed()}
                    underlayColor={underlayColor}>
                {btn}
            </TouchableHighlight>
      	);
    }
}

QCButton.defaultProps = { 
    color: 'red',
    width: width / 2,
    height: 35,
    style: {},
};

var styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center', 
        justifyContent:'center',
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,
    },
    icon: {
        height:30,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 10,
        lineHeight: 15,
        color: '#535353',
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        flex: 1,
        resizeMode: 'cover', 
        marginLeft: 5,
        marginRight: 5,       
    },
    btnText: {
        flex: 4,
        color: '#fff',
        fontSize: 15,
        marginTop: 0,
    },
});

module.exports = ShareButton; /* making it available for use by other files */