'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,    
    TouchableHighlight,
} from 'react-native';

import { height, width, } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let QCHome = require('../../qcHome');
let CategoryIcon = require('./categoryIcon');
let CategoryItems = require('./categoryItems');
let isArabic = true;

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        if(this.props.category.CategoryId) {
            isArabic = this.props.isArabic;
            this.fetchData();
        }
        //This shouldn't be happen but just in case
        else {
            this.props.navigator.replace({id: 'QCHome', title: 'welcome',});
            this.props.navigator.push({
                id: 'QCHome',
                title: 'welcome',
                component: QCHome,
            });
        }
    }
    fetchData() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetDonationCategoryNew?categoryId=' 
                          + this.props.category.CategoryId;
                          //alert(this.props.category.categoryId)
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
          //if(responseData && responseData.length > 0) {
              self.setState({
                  dataSource: responseData,
                  isLoading: false,
              });
          //}
          /*else {
              //Go to details
              this.props.navigator.push({
                  id: 'CategoryItems',
                  title: this.props.name,
                  component: CategoryItems,
                  passProps: {categoryId: this.props.categoryId, isArabic: this.props.isArabic, },
              });
          }*/
        })
        .done();
    }

    rederItems() {
        let contents = [];
        let iconList = this.state.dataSource;
        navigator = this.props.navigator;
        for (let i = 0; i < iconList.length; i++) {

          if(isArabic) {
              contents.push(
                  <View key={i} style={stylesBase.listRow}>
                      <CategoryIcon item={iconList[i + 2]} isArabic={isArabic} navigator={navigator} />
                      <CategoryIcon item={iconList[i + 1]} isArabic={isArabic} navigator={navigator} />
                      <CategoryIcon item={iconList[i]} isArabic={isArabic} navigator={navigator} />
                  </View>
              );
              i += 2;
          }
          else {
              contents.push(
                  <View key={i} style={stylesBase.listRow}>
                      <CategoryIcon item={iconList[i]} isArabic={isArabic} navigator={navigator} />
                      <CategoryIcon item={iconList[++i]} isArabic={isArabic} navigator={navigator} />
                      <CategoryIcon item={iconList[++i]} isArabic={isArabic} navigator={navigator} />
                  </View>
              );
          }
        }

        return contents;
    }

    render() {
        
        if(this.state.isLoading) {   
            return (
                <View style={stylesBase.container}>
                    <QCLoading />
                </View>
            );
        }

        return (
          <ScrollView
                scrollEventThrottle={16}
                automaticallyAdjustContentInsets={false}
                initialListSize={1}
                style={[stylesBase.container,]}
                contentContainerStyle={{ alignItems: 'center' }}>
                {this.rederItems()}
            </ScrollView>
        );
    }
}

var stylesBase = StyleSheet.create({    
    container: {
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom:55,
    },
    listRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
        width: width - 20,
    },
});

module.exports = Categories;