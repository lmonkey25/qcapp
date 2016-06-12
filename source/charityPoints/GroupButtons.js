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
import { width, text, } from '../utilities/constants';

let GlobalResource = require('./GlobalResource');
let isArabic = true;

class GroupButtons extends Component{

    componentDidMount() {
        isArabic = this.props.isArabic;//alert(isArabic)
        //stringsLocal.setLanguage(isArabic ? 'ar' : 'en');
    }
    goCreateGroup() {
        this.props.navigator.push({
        	id: 'CreateGroup',
            title: isArabic? 'إنشاء مجموعة' : 'Create Group',
            passProps: {isArabic: isArabic},
        });
    }

    goMyGroups() {
        this.props.navigator.push({
        	id: 'MyGroups',
            title: isArabic? 'مجموعاتي' : 'My Groups',
            passProps: {isArabic: isArabic},
        });
    }
    
	render () {
		var btnCreateText = (<Text style={[stylesBase.btnText, styleLang.btnFont, text]}>{stringsLocal.createGroup}</Text>), 
			btnCreateIcon = (<Image style={[stylesBase.img, styleLang.iconMargin]} source={require('../../contents/icons/createGroup.png')} />);
		var btnGroupsText = (<Text style={[stylesBase.btnText, styleLang.btnFont, text]}>{stringsLocal.myGroups}</Text>), 
			btnGroupsIcon = (<Image style={[stylesBase.img, styleLang.iconMargin]} source={require('../../contents/icons/myGroups.png')} />);
			
		var btnCreateGroup, btnMyGroups;
		
		if(!isArabic) {
			btnCreateGroup = (
				<View style={stylesBase.wrapper}>
					{btnCreateIcon}
					{btnCreateText}
				</View>
			);
			
			btnMyGroups = (
				<View style={stylesBase.wrapper}>
					{btnGroupsIcon}
					{btnGroupsText}
				</View>
			);
		}
		else {
			btnCreateGroup = (
				<View style={stylesBase.wrapper}>
					{btnCreateText}
					{btnCreateIcon}
				</View>
			);
			
			btnMyGroups = (
				<View style={stylesBase.wrapper}>
					{btnGroupsText}
					{btnGroupsIcon}
				</View>
			);
		}
		
		return (
			<View style={stylesBase.btnContainer}>
                <TouchableHighlight 
                    	style={[stylesBase.button, stylesBase.addGroup]}
                    	onPress={() => this.goCreateGroup()}
                    	underlayColor={'#06aebb'}>
					{btnCreateGroup}
                </TouchableHighlight>
                <TouchableHighlight
                    	style={[stylesBase.button, stylesBase.myGroups]}
                    	onPress={() => this.goMyGroups()}
                    	underlayColor={'#ed3054'}>
            		{btnMyGroups}
                </TouchableHighlight>
            </View>
		);
	}
}


let strings = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal;

if(!isArabic) {
    stringsLocal = {
        createGroup: 'CREATE GROUP',
        myGroups: 'MY GROUPS',
    }
}
else {
    stringsLocal =  {
        createGroup: 'إنشاء مجموعة',
        myGroups: 'مجموعاتي',
    }
}

var stylesBase = {
	btnContainer: {
        width: width,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    wrapper: {
    	flex: 1,
    	flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGroup: {
    	backgroundColor: '#06aebb',
    },
    myGroups: {
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

module.exports = GroupButtons;