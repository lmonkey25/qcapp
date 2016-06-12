'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import { height, width, } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let CouponList = require('./couponList');
let isArabic = true;

class CharityCards extends Component {

    constructor(props) {
       super(props);
       this.state = {
            lastKeyword: '',
            dataSource: [],
            isLoading: true,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    componentWillUnmount() {
    }
    fetchData() {
        let self = this;

        /*var data = [];
        for(var i = 0; i < 10; i++) {
            data.push({id: i,});
        }
        self.setState({
            dataSource: data,
            isLoading: false,
        });*/
        this.setState({isLoading: true,});
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetCouponCategoryList?CategoryName='
                            + this.state.lastKeyword;
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            //alert(responseData.length)
            self.setState({
                dataSource: responseData,
                isLoading: false,
            });
        })
        .done();
    }
    goDetails(item) {
        let cards = isArabic ? 'كروت الخير' : 'Charity Cards';
        this.props.navigator.push({
            id: 'CouponList',
            title: cards,
            component: CouponList,
            passProps: {item: item, isArabic: isArabic, },
        });
    }
    renderItem(item, index) {
        if(item) {
        let title = (isArabic) ? item.TitleAr : item.TitleEn
        return (
            <TouchableHighlight key={'item_' + index} onPress={() => this.goDetails(item)} 
                                style={[styles.item, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.item, {backgroundColor: 'transparent'}]}>
                    <Image source={{uri: item.ImageURL}} style={styles.cardImage} />
                    <View style={styles.cardTitleWrapper}><Text style={styles.cardTitle}>{title}</Text></View>
                </View>
            </TouchableHighlight>
        );
        }
        else {
            return null;
        }
    }
    rederItems() {
        let contents = [];
        let iconList = this.state.dataSource;
        let navigator = this.props.navigator;
        
        for (let i = 0; i < iconList.length; i++) {
            var items = [];
            if(isArabic) {
                if (i + 1 < iconList.length) {
                    items.push(
                        this.renderItem(iconList[i + 1], i)
                    );
                }
                items.push(
                    this.renderItem(iconList[i])
                );
                contents.push(
                    <View key={i} style={styles.listRow}>
                        {items}
                    </View>
                );
                i += 1;
            }
            else {
                items.push(
                    this.renderItem(iconList[i])
                );
                if (i + 1 < iconList.length) {
                    items.push(
                        this.renderItem(iconList[++i])
                    );
                }
                contents.push(
                    <View key={i} style={styles.listRow}>
                        {items}
                    </View>
                );
            }
        }

        return contents;
    }
    searchChanged(search) {
        
        this.setState({search: search,isLoading: false,}); 
        //this.fetchData();
    }
    
    render() {
        if(this.state.isLoading) {   
            return (
                <View style={styles.container}>
                    <QCLoading />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.search}>
                    <TextInput autoFocus={true} maxLength={35} 
                        placeholder={'البحث'}
                        style={[styles.inputText,]}
                        placeholderTextColor={'#8a8a8a'}
                        onChangeText={(text) => this.setState({lastKeyword: text})}
                        onSubmitEditing={(text) => this.fetchData()}
                        value={this.state.lastKeyword} />
                </View>
                <ScrollView
                    scrollEventThrottle={16}
                    automaticallyAdjustContentInsets={false}
                    initialListSize={1}
                    style={[styles.list,]}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', }}>
                    {this.rederItems()}
                </ScrollView>
            </View>
        );
    }
}

var itemWidth = (width - 35) / 2;
var styles = StyleSheet.create({    
    container: {
        flex: 1,
        marginBottom:55,justifyContent: 'flex-start',
    },
    search: {
        flexDirection: 'row',
        width: width,
        height: 50,
        backgroundColor: 'white',
        marginBottom:10,
    },
    inputText: {
        borderWidth: 0,
        width: width - 5,
        fontFamily: 'Janna New R',
    },
    list: {
        flex: 1,
        width: width - 20,
        marginTop: 0,
        marginLeft: 10,
        marginRight: 10,
    },
    listRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        width: width - 20,
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,/**/
        //width:width / 4,
    },
    item: {
        width: itemWidth,
        height: itemWidth + 50,
        marginBottom: 8,
    },
    cardTitleWrapper: {
        flex: 1,
        width: itemWidth,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center', 
        justifyContent:'center',
        paddingRight: 10,

    },
    cardTitle: {
        flexWrap: 'nowrap',
        width: itemWidth,
        lineHeight: 35,
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
        fontFamily: 'Janna New R',
    },
    cardImage: {
        width: itemWidth,
        height: itemWidth + 50,
        resizeMode: 'contain',
    },
});

module.exports = CharityCards;