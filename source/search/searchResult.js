
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    Image,    
    TouchableHighlight,
} from 'react-native';

import { height, width, } from '../utilities/constants'

let ProjectDetails = require('../projects/projectDetails');

let isArabic = true;
let tabbarActions = require('../../globalActions/tabbarActions');
let QCLoading =  require('../../qcLoading');

class SearchResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.result),
        });
        //this.changeTab();
        //this.fetchData();
    }
    changeTab() {
        tabbarActions.setTab('profile');
    }
    goDetails(item) {
        this.props.navigator.push({
            id: 'ProjectDetails',
            title: isArabic? item.DescriptionAr : item.DescriptionEn,
            component: ProjectDetails,
            passProps: {item: item, isArabic: this.props.isArabic, },
        });
    }

    rederItem(item) {

        let donateText = '';
        let donateIcon = '';
        if(this.state.activeIndex == 0) {
            donateText = isArabic? 'احتياجات المشروع':'Project Needs';
            donateIcon = require("image!project_needs");
        }
        else {
            donateText = isArabic? 'دفع المتأخرات':'Pay Overdue';
            donateIcon = require("image!donate");
        }
        
        let detailsText = isArabic? 'التفاصيل':'Details';


        let donateStyle = isArabic? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
        let detailsStyle = isArabic? {alignSelf: 'flex-start'} : {alignSelf: 'flex-end'};
        let donateTextStyle = isArabic? {textAlign: 'right'} : {textAlign: 'left'};
        let detailsTextStyle = isArabic? {textAlign: 'left'} : {textAlign: 'right'};

        let donateBtn = (
            <TouchableHighlight onPress={() => {return null}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={donateIcon} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{donateText}</Text>
                </View>
            </TouchableHighlight>
        );

        let detailsBtn = (
            <TouchableHighlight onPress={() => {this.goDetails(item);}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!details")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{detailsText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstIcon, lastIcon;
        if(isArabic) {
            firstIcon = detailsBtn;
            lastIcon = donateBtn;
        }
        else {
            firstIcon = donateBtn;
            lastIcon = detailsBtn;
        }

        let flag = 'flg_' + item.ContryId;
        flag = {uri: flag };

        let title = isArabic ? item.DescriptionAr : item.DescriptionEn;
        let category = isArabic ? item.CategoryNameAr : item.CategoryNameEn;
        let country = isArabic ? item.ContryNameAr : item.ContryNameEn;
        let cost = this.state.activeIndex == 0 ? item.AmountPaid : item.AmountRemaining;

        let currencyText = isArabic? 'ر.ق':'QAR';
        let totalAmountText = '';
        if(this.state.activeIndex == 0) {
            totalAmountText = isArabic? 'اجمالي المشروع' : 'Total Cost';
        }
        else {
            totalAmountText = isArabic? 'اجمالي المتبقي' : 'Remaining Amount';
        }
        

        let image = <Image source={{uri: item.Image}} style={styles.causeImage} />;
        let rightSide = (
            <View style={{flex: 1,flexWrap: 'wrap', marginRight: 20, marginLeft: 20,}}>
                <View>
                    <Text numberOfLines={2} style={styles.title}>{title}</Text>
                    <Text numberOfLines={1} style={styles.category}>{category}</Text>
                </View>                
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.country]}>{country}</Text>
                    <Image source={flag} style={styles.flag} />
                </View>
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1,color: '#fe345a'}]}>{cost} {currencyText}</Text>
                    <Text style={[styles.text, {color: '#fe345a', marginLeft: 20,}]}>{totalAmountText}</Text>
                </View> 
            </View>
        );

        return (
            <View style={styles.itemContainer}>
                <View style={styles.detailsContainer}>
                  {image}
                  {rightSide}
                </View>
                <View style={styles.actionsContainer}>
                    {firstIcon}
                    {lastIcon}
                </View>
            </View>
        );
    }

    render() {

        let loading = null;
        let listCtrl = null;
        
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {

            let dataSource = this.state.dataSource;
            listCtrl = (
                <ListView
                    dataSource={dataSource}
                    renderRow={this.rederItem.bind(this)}
                    initialListSize={1}
                    style={{flex: 1,}}
                    contentContainerStyle={[styles.contentContainer]} />
            );
        }


        return (
            <View style={styles.container}>
                {loading}
                {listCtrl}
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginBottom:55,
    },
    contentContainer: {
        width: width - 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
    itemContainer: {
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        width: width - 10,
        padding: 20,
        paddingBottom: 5,
        borderTopLeftRadius:3,
        borderTopRightRadius:3,
        backgroundColor: 'white',
        alignItems: 'flex-start', 
        justifyContent:'flex-start',
        paddingRight: 0,
    },
    causeImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 5,
        marginLeft: 5,
        alignSelf: 'flex-start', 

    },
    title: {
        color: '#535353',
        fontSize: 18,
        marginBottom: 5,
        fontFamily: 'Janna New R',
    },
    category: {
        color: '#06aebb',
        fontSize: 14,
        marginBottom: 5,
        fontFamily: 'Janna New R',
    },
    country: {
        flex: 1, 
        marginRight: 5, 
        marginLeft: 5,
        marginBottom: 5,
        color: '#cccccc',
        fontSize: 12,
        fontFamily: 'Janna New R',
    },
    flag: {
        width:22,
        height: 15,
        resizeMode: 'cover',
    },
    actionsContainer: {
        padding: 5,
        borderBottomLeftRadius:3,
        borderBottomRightRadius:3,
        backgroundColor: '#06aebb',
        height:55,
        width: width - 10,
        flex:1,
        flexDirection: 'row',
    },
    iconContainer: {
        flex:1,
        alignItems: 'center', 
        justifyContent:'center',
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,/**/
        //width:width / 4,
    },
    icon: {
        height:25,
        resizeMode: 'contain',
        
    },
    label: {
        flex:1,
        fontSize: 11,
        lineHeight: 20,
        flexWrap: 'nowrap',
        color: '#ffffff',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 2,
        fontFamily: 'Janna New R',
        //width:width / 4,
    },
    text: {
        fontFamily: 'Janna New R',
    },
});
module.exports = SearchResult;