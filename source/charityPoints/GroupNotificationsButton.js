'use strict'; 

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    ListView,
    View,
    TouchableHighlight,
} from 'react-native';
   
import LocalizedStrings from 'react-native-localization';
import { text, AccountController, } from '../utilities/constants';

var GlobalResource = require('./GlobalResource');

var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/members/{0}/countinvitations';

let isArabic = true;

class GroupNotificationsButton extends Component{

	constructor(props) {
       super(props);
       this.state = {
            isLoading: true,
            dataSource: null,
       };
    }

    componentDidMount() {
        isArabic = this.props.isArabic;
        strings.setLanguage(isArabic ? 'ar' : 'en');
        this.fetchData();
    }

    fetchData() {
    
        let donorId = null;
        if(this.props.donorId && this.props.donorId != null) {
            donorId = this.props.donorId;
        }
        
        if(donorId && donorId != null && donorId > 0) {
            fetch(REQUEST_URL.replace("{0}", donorId))
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                   dataSource: responseData,
                   isLoading: false,
                });
            })
            .done();
        }
        else {
            /*let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'MyGroups',
                title: isArabic ? 'مجموعاتي' : 'My Groups',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: isArabic, redirectInfo: redirectInfo, },
            });*/
        }
    }
    
    goGroupNotifications() {
        this.props.navigator.push({
        	id: 'GroupNotifications',
            title: strings.notificationsTitle,
            passProps: {isArabic: isArabic}
        });
    }
    
	render () {
		var dataSource = this.state.dataSource;
		var btnText = (<Text style={[stylesBase.btnText, styleLang.btnFont, text]}>{strings.notifications} ({!dataSource || dataSource == null ? 0 : dataSource})</Text>); 
		var btn;
		
		if(!isArabic) {
			btn = (
				<View style={stylesBase.wrapper}>
					{btnText}
				</View>
			);
		}
		else {
			btn = (
				<View style={stylesBase.wrapper}>
					{btnText}
				</View>
			);
		}
		
		return (
            <TouchableHighlight 
                	style={[stylesBase.button, stylesBase.mynotifications]}
                	onPress={() => this.goGroupNotifications()}
                	underlayColor={'#ed3054'}>
				{btn}
            </TouchableHighlight>
		);
	}
}


let strings = new LocalizedStrings(GlobalResource.globalStrings);

var stylesBase = {
    wrapper: {
    	flex: 1,
    	flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mynotifications: {
    	backgroundColor: '#fe345a',
    },
    button: {
        height: 45,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
    },
    img: {
        flex: 1,
        resizeMode: 'cover',        
    },
    btnText: {
    	flex: 4,
        color: '#fff',
        marginTop: 0,
    }
};

var styleLang;

if(!isArabic) {
	styleLang = StyleSheet.create({	
		iconMargin: {
			marginRight: 5,
		},
		btnFont: {
        	fontSize: 14,
		},
	});
}
else {
	styleLang = StyleSheet.create({	
		iconMargin: {
			marginLeft: 5,
		},
		btnFont: {
        	fontSize: 14,
		},
	});
}

module.exports = GroupNotificationsButton;