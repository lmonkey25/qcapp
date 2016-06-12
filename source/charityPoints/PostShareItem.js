'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    TouchableHighlight,
    Linking,
} from 'react-native';

import LocalizedStrings from 'react-native-localization';
//var KDSocialShare = require('NativeModules').KDSocialShare;

var GlobalResource = require('./GlobalResource');

var userId = null;
let isArabic = true;
var thisObj;
class PostShareItem extends Component{
	
	  constructor(props) {
        super(props);
        this.state = {
            isActive: false,
        };
    }

    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');
    }

    share() {
  	}
  	shareStopped() {
  		  if(this.props.onShare){
        		this.props.onShare(false);
      	}
  	}
  
  	addPoints(socialMediaId){
  	
  		  fetch('http://portal.qcharity.net/QCPointsApiTest/api/posts/share', {
      			method: 'POST',
      			headers: {
          			'Accept': 'application/json',
          			'Content-Type': 'application/json',
      			},
      			body: JSON.stringify({
          			PostId: '' + this.props.post.PostId + '',
          			UserId: '' + this.props.userId + '',
          			SocialMediaId: '' + socialMediaId + '',
      			}),		
		    })
    		.then(function (response) {
        		if(response.status == 201 || response.status == 200) {
          			if(socialMediaId != 4) {
          				  alert(stringsLocal.successMsg);
          			}
        		}
        		thisObj.shareStopped();
    		})
    		.catch (function (error) {
        		alert(stringsLocal.requestFailed + error);
        		thisObj.shareStopped();
    		});
  	}
  
  	changeIcon(active) {	
  		  this.setState({isActive: active});
  	}
  	
    render () {
		    var icon = (this.state.isActive ? this.props.item.IconActive : this.props.item.Icon);
    		return (
            <TouchableHighlight onPress={() => this.share()} 
    								onPressIn={() => this.changeIcon(true)}
    								onPressOut={() => this.changeIcon(false)} delayPressOut={3000}
                                  	style={[styles.item, {margin: 8,}]} underlayColor={'transparent'}>
                <Image source={icon} style={[styles.item, {resizeMode: 'contain',}]} />
            </TouchableHighlight>
    		);
	}
}

let stringsLocal = new LocalizedStrings({
	en: {
		requestFailed: 'Request failed ',
		successMsg: 'Thank you..\r\nYou shared the case successfully, and gained more points.',
		registerFirst: 'Please, sign in into your {0} account first.',
		facebook: 'Facebook',
		twitter: 'Twitter',
		google: 'Google+',
		notAvailable: 'Not avilable',
	},
	ar: {
		requestFailed: 'لقد فشل الطلب ',
		successMsg: 'شكرا لك..\r\nلقد تمت المشاركة بنجاح، وتم اضافة نقاط الخير في حسابك.',
		registerFirst: 'من فضلك، قم بتسجيل الدخول إلى حسابك على {0} أولا.',
		facebook: 'فيسبوك',
		twitter: 'تويتر',
		google: 'جوجل بلس',
		notAvailable: 'غير متاح',
	},
});

var styles = StyleSheet.create({    
    item: {
    	alignItems: 'center',
        
        width: 75,//(window.height/8.3350)/2,
        height: 100,//window.height/8.335,
    }, 
});

module.exports = PostShareItem;