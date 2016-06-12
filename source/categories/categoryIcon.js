'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';

import { height, width } from '../utilities/constants'

let Categories = require('./categoryList');
let CategoryItems = require('./categoryItems');
let PostsMain = require('../charityPoints/postsMain');
let TroublesMain = require('../troublesRelief/troublesMain');
let CollectorRequest = require('../collectors/collectorRequest');
let KafalatHome = require('../kafalat/kafalatHome');

class CategoryIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
        };
    }

    goSubCategories(category, name) {
        //Has TabIndex
        if(category.TabIndex > -1 || category.CategoryId == 1) {
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
                    this.props.navigator.push({
                        id: 'KafalatHome',
                        title: name,
                        component: KafalatHome,
                        passProps: {category: category, isArabic: this.props.isArabic, },
                    });
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
                        <View style={[styles.icon,]}>
                            <Image source={icon} style={[{resizeMode: 'contain', width:70,height:70,}]} />
                        </View>
                        <Text style={[styles.categoryName]}>{name}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
        else {return null;}
    }
}

let iconWrapperWidth = (width - 20)/3.3;
let iconWidth = (width - 20)/4.0;

var styles = StyleSheet.create({    
    item: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 5,
        marginRight: 5,
    },
    iconTouch: {
        margin: 0,
        width: iconWrapperWidth,
        height: iconWrapperWidth + 30,
    },
    iconWrapper: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: iconWidth,
        height: iconWidth,
        borderRadius: iconWidth/2,
        borderWidth: 1,
        borderColor: '#06aebb',
    },
    categoryName: {
        color: '#535353',
        fontSize: 12,
        textAlign: 'center',
        //width: iconWidth,
        flexWrap: 'nowrap',
        fontFamily: 'Janna New R',
    },
});

module.exports = CategoryIcon;