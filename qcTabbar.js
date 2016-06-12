'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View, 
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
} from 'react-native';

var Tabs = require('react-native-tabs');

var Language = require('./language/language');
let TabEventEmitter = require('./globalEventEmitters/tabbarEmitter');
var isAr = Language.isArabic();

class QCTabbar extends Component {

    constructor(props, context) {
        super(props);
        this.toggle = false;
        this.state = {
      			isArabic: this.props.isArabic,
      			selectedPage: 'home',
		    };
    }
    componentDidMount() {
        //Language.addChangeListener(this.onChangeLanguage.bind(this));
        //TabEventEmitter.addChangeTabListener(this.onChangeTab.bind(this));
  	}
    componentWillUnmount() {
         //Language.removeChangeListener(this.onChangeLanguage.bind(this));
		    //TabEventEmitter.removeChangeTabListener(this.onChangeTab.bind(this));
    }
  	onChangeLanguage() {
        //isAr = !Language.isArabic();

    		this.setState({
    		    isArabic: isAr,
    		});
    }
    onChangeTab() {
var currentTab = TabEventEmitter.CurrentTab();

        
        this.setState({
            selectedPage: currentTab,
        });
    }
    changeScreen(newTabName) {
        if(this.props.onTabPressed) {
            let index = 0;
            if(newTabName == 'basket') {
                index = 1;
            }
            else if(newTabName == 'cards') {
                index = 2;
            }
            else if(newTabName == 'profile') {
                index = 3;
            }
            this.props.onTabPressed(index);
        }
    }
    tabChanged(tab) {
     // alert(tab.props.name);
        this.setState({selectedPage: tab.props.name});
        this.changeScreen(tab.props.name);
    }

    render() {
      	
        isAr = this.props.isArabic;
        let selectedPage = this.state.selectedPage;

      	let home = isAr ? 'الرئيسية' : 'Home';
      	let basket = isAr ? 'السلة' : 'Basket';
      	let cards = isAr ? 'كروت الخير' : 'Charity Cards';
      	let profile = isAr ? 'الملف الشخصي' : 'Profile';

      	let homeText = null, basketText = null, cardsText = null, profileText = null;
      	switch(selectedPage) {
        		case 'home':
          			homeText = <Text style={styles.tabText}>{home}</Text>;
          			break;
        		case 'basket':
          			basketText = <Text style={styles.tabText}>{basket}</Text>;
          			break;
        		case 'cards':
          			cardsText = <Text style={styles.tabText}>{cards}</Text>;
          			break;
        		case 'profile':
          			profileText = <Text style={styles.tabText}>{profile}</Text>;
          			break;
      	}
      	
      	let homeTab = (
      		  <View name="home" key='tab1' style={styles.tab}>
              	<Image source={require('image!ic_home')} style={[{height:20,resizeMode: 'contain',}]} />
              	{homeText}
            </View>
      	);
      	let basketTab = (
      		  <View name="basket" key='tab2' style={styles.tab}>
              	<Image source={require('image!ic_cart')} style={[{height:20,resizeMode: 'contain',}]} />
              	{basketText}
            </View>
      	);
      	let cardsTab = (
      		  <View name="cards" key='tab3' style={styles.tab}>
              	<Image source={require('image!ic_card')} style={[{height:20,resizeMode: 'contain',}]} />
              	{cardsText}
            </View>
      	);
      	let profileTab = (
      		  <View name="profile" key='tab4' style={styles.tab}>
              	<Image source={require('image!ic_profile')} style={[{height:20,resizeMode: 'contain',}]} />
              	{profileText}
            </View>
      	);

      	let content = [];
      	if(isAr) {
        		content.push(profileTab);
        		content.push(cardsTab);
        		content.push(basketTab);
        		content.push(homeTab);
      	}
      	else {
        		content.push(homeTab);
        		content.push(basketTab);
        		content.push(cardsTab);
        		content.push(profileTab);
      	}
      	let self = this;
      	return (
      		  <Tabs selected={selectedPage} style={{backgroundColor:'#2d2d2d', justifyContent: 'space-between'}}
      				    selectedIconStyle={{backgroundColor:'#fe345a'}}
  	              onSelect={(el) => self.tabChanged(el)}>
  	            {content}
  	        </Tabs>
      	);
	 }
}
 
var styles = StyleSheet.create({
  	container: {
  	    flexDirection: 'row',
  	    alignItems: 'center',
  	    marginBottom: 5,
  	},
  	tab:{
  		flex:1, 
  		justifyContent: 'center',
  		alignItems: 'center',
  	},
  	tabText: {
  	    fontSize: 13, 
  	    fontFamily: 'Janna New R', 
  	    color: 'white',
  	    marginTop: 5,
  	},
  	labelContainer: {
  	    marginLeft: 10,
  	    marginRight: 10
  	},
});

module.exports = QCTabbar; /* making it available for use by other files */