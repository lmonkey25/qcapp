'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
} from 'react-native';

import { height, width } from './source/utilities/constants'

var QCMainIcon = require('./qcMainIcon');
var Language = require('./language/language');
var isArabic = Language.isArabic();

let index = 0;
class QCMainList extends Component {

	  constructor(props) {
        super(props);
        this.state = {
            //isArabic: isArabic,
            isLoading: true,
            dataSource: [],
        };
    }
    componentWillUnmount() {
        //Language.removeChangeListener(this.onLanguageChange.bind(this));
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
        //Language.addChangeListener(this.onLanguageChange.bind(this));
    }
    onLanguageChange() {
      alert(isArabic);
        isArabic = !Language.isArabic();
        this.setState({
          isArabic: isArabic,
        });
    }
    loadingEnd() {
        if(this.props.onLoadingEnd) {
            this.props.onLoadingEnd();
        }
    }

    fetchData() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetDonationCategoryNew?categoryId=0';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                dataSource: responseData,
                isLoading: false,
            });
            self.loadingEnd();
        })
        .done();
    }
    
    
    toggleLoading(inProcess) {
      	this.setState({
      		  inProcess: inProcess,
      	});
    }
  
  	rederItem(item) {
  		  return (<QCMainIcon item={item} isArabic={isArabic} />);
  	}

    generateContents() {//alert(isArabic);
        let contents = [];
        let iconList = this.state.dataSource;
        let navigator = this.props.navigator;
        //alert(navigator)
        for (let i = 0; i < iconList.length; i++) {

          if(isArabic) {
              contents.push(
                  <View key={i} style={stylesBase.listRow}>
                      <QCMainIcon item={iconList[i + 2]} isArabic={isArabic} navigator={navigator} />
                      <QCMainIcon item={iconList[i + 1]} isArabic={isArabic} navigator={navigator} />
                      <QCMainIcon item={iconList[i]} isArabic={isArabic} navigator={navigator} />
                  </View>
              );
              i += 2;
          }
          else {
              contents.push(
                  <View key={i} style={stylesBase.listRow}>
                      <QCMainIcon item={iconList[i]} isArabic={isArabic} navigator={navigator} />
                      <QCMainIcon item={iconList[++i]} isArabic={isArabic} navigator={navigator} />
                      <QCMainIcon item={iconList[++i]} isArabic={isArabic} navigator={navigator} />
                  </View>
              );
          }
        }

        return contents;
    }
	
    render() {
        isArabic = this.props.isArabic;
        return (
            <ScrollView
              //onScroll={this.onScroll.bind(this)}
                scrollEventThrottle={16}
                automaticallyAdjustContentInsets={false}
                style={[stylesBase.container, { flex: 1, marginBottom:55}]}
                contentContainerStyle={{ alignItems: 'center' }}>
                {this.generateContents()}
            </ScrollView>
        );
    }
}
        
var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        margin:10,
    },
	  list: {
      	flexDirection: 'row',
      	flexWrap: 'wrap',
      	margin:5,
  	},
    listRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: width - 20,
    },
});

var styleLang = StyleSheet.create({	
		list: {
      	justifyContent: 'flex-start',
		},
});

module.exports = QCMainList; /* making it available for use by other files */