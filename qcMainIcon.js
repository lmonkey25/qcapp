'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';

import { height, width } from './source/utilities/constants'

let Categories = require('./source/categories/categoryList');
let PostsMain = require('./source/charityPoints/postsMain');
let TroublesMain = require('./source/troublesRelief/troublesMain');
let CollectorRequest = require('./source/collectors/collectorRequest');
let KafalatHome = require('./source/kafalat/kafalatHome');
let CategoryItems = require('./source/categories/categoryItems');

class QCMainIcon extends Component {
	constructor(props) {
       super(props);
       this.state = {
            isActive: false,
       };
    }

    goSubCategories(category, name) {
        //alert(category.PaidThroughId + ' ' + category.AccountTypeId)
        //Has TabIndex
        if(category.TabIndex > -1 || category.CategoryId == 1 || category.CategoryId == 118) {
            switch(category.TabIndex) {
                case 4:
                    //Tafrij Korba
                    this.props.navigator.push({
                        id: 'TroublesRelief',
                        title: name,
                        component: TroublesMain,
                        passProps: {category: category, isArabic: this.props.isArabic, },
                    });
                    break;
                case 5:
                    //Collectors
                    this.props.navigator.push({
                        id: 'Collectors',
                        title: name,
                        component: CollectorRequest,
                        passProps: {category: category, isArabic: this.props.isArabic, },
                    });
                    break;
                case 7:
                    //Charity Points
                    this.props.navigator.push({
                        id: 'CharityPointsHome',
                        title: name,
                        component: PostsMain,
                        passProps: {category: category, isArabic: this.props.isArabic, },
                    });
                    break;
                case 8:
                case -1:
                    //Kafalat
                    if(category.CategoryId == 1) {
                        this.props.navigator.push({
                            id: 'KafalatHome',
                            title: name,
                            component: KafalatHome,
                            passProps: {category: category, isArabic: this.props.isArabic, },
                        });
                    }
                    //Fasting
                    else if(category.CategoryId == 118) {
                        this.props.navigator.push({
                            id: 'FastingHome',
                            title: name,
                            passProps: {category: category, isArabic: this.props.isArabic, },
                        });
                    }
                    break;
            }
        }
        else if(category.IsCoupon) {
            this.props.navigator.push({
                id: 'CharityCards',
                title: name,
                passProps: {category: category, isArabic: this.props.isArabic, },
            });
        }
        //IsProduct
        else if(category.IsProduct) {

        }
        //IsTerminal
        else if(category.IsTerminal) {
            this.props.navigator.push({
                id: 'CategoryItems',
                title: name,
                component: CategoryItems,
                passProps: {category: category, isArabic: this.props.isArabic, },
            });
        }
        //Has Subcategories
        else {
            this.props.navigator.push({
                id: 'Categories',
                title: name,
                component: Categories,
                passProps: {category: category, isArabic: this.props.isArabic, },
            });
        }
    }

    render () {
    	if(this.props.item){
        	var uri = this.props.item.ImagePath;
    		var icon = ({uri: uri,});
    		let name = this.props.isArabic ? this.props.item.CategoryNameAr : this.props.item.CategoryNameEn;
    		return (
    			<TouchableHighlight onPress={() => this.goSubCategories(this.props.item, name)} 
                                  	style={[styles.item, styles.iconTouch]} underlayColor={'transparent'}>
                	<View style={[styles.item, styles.iconWrapper]}>
                		<Image source={icon} style={{resizeMode: 'contain', width:50,height:70,}} />
                		<Text style={[styles.categoryName]}>{name}</Text>
                	</View>
            	</TouchableHighlight>
    		);
		}
		else {return null;}
	}
}

let iconWidth = (width - 20)/3.3;

var styles = StyleSheet.create({    
    item: {
    	backgroundColor: 'white',
    	alignItems: 'center',
        borderRadius: 5,
        
        //window.height/8.335,
    },
    iconTouch: {
    	margin: 0,
    	width: iconWidth,
    	height: iconWidth,
    },
    iconWrapper: {
    	flex:1,
    	justifyContent: 'center',
    	alignItems: 'center',
    },
    categoryName: {
    	color: '#06aebb',
    	fontSize: 12,
        //fontWeight: 'bold',
    	textAlign: 'center',
    	width: iconWidth,
        fontFamily: 'Janna New R',
    },
});

module.exports = QCMainIcon;