'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View, 
	Text,
	Image,
	TouchableHighlight,
    Alert,
    InteractionManager
} from 'react-native';

import Share from 'react-native-share';

import Carousel from 'react-native-spring-carousel';
import { height, width, text, AccountController, } from './source/utilities/constants'

let screenWidth = width - 20;
let screenHeight = height / 3;

let CampaignCauses = require('./source/campaigns/campaignCauses');

let currentPageIndex = 0;
let Language = require('./language/language');
let isArabic = Language.isArabic();


class QCCampaignCarousel extends Component {

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
        this.fetchData();
    	//Language.addChangeListener(this.onLanguageChange.bind(this));
    }
  	onLanguageChange() {
		isArabic = Language.isArabic();
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
    	let self = this;//DefaultAccountTypeID and DefaultCountryID
    	let REQUEST_URL = 'http://servicestest.qcharity.org/api/MobileDevice/GetCampaignsWithDefulats';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
               dataSource: responseData,
               isLoading: false,
            });
            self.loadingEnd();
        })
        .done();
    }

	onPressSlide(index){
  		//alert(index);
	}
	onPageChanged(currentPage){
		currentPageIndex = currentPage - 1;
	}

	donateNow(currentIndex) {
		if(currentIndex < this.state.dataSource.length) {
			//alert(this.props.navigator);
			let campaign = this.state.dataSource[currentIndex];
			if(this.props.onDonationPressed) {
				this.props.onDonationPressed(campaign);
			}
		}
	}
	goToCampaignCauses() {
		if(currentPageIndex < this.state.dataSource.length) {

			let campaign = this.state.dataSource[currentPageIndex];
			let campaignId = campaign.CampaignId;
			//let name = this.state.isArabic ? campaign.ArName : campaign.EnName;
			let name = this.props.isArabic ? campaign.ArName : campaign.EnName;

			this.props.navigator.push({
	        	id: 'CampaignCauses',
	            title: name,
	            component: CampaignCauses,
            	//passProps: {campaignId: campaignId, isArabic: this.state.isArabic, },
            	passProps: {campaignId: campaignId, isArabic: this.props.isArabic, },
	        });
		}
	}
	toggleInfo() {
		if(currentPageIndex < this.state.dataSource.length) {

			let campaign = this.state.dataSource[currentPageIndex];
			//let name = this.state.isArabic ? campaign.ArName : campaign.EnName;
			let name = this.props.isArabic ? 'عن ' + campaign.ArName : 'About ' + campaign.EnName;
			let details = this.props.isArabic ? campaign.DescriptionAr : campaign.DescriptionEn;
			if(this.props.onInfoPressed) {
				this.props.onInfoPressed(name, details);
			}
		}
	}
	onPressShare() {

		if(currentPageIndex < this.state.dataSource.length) {
			let item = this.state.dataSource[currentPageIndex];
			if(item && item != null) {
		        //this.setState({isLoading: true});
		        let url = isArabic ? item.ShareLinkAr : item.ShareLinkEn;
		        let title = isArabic ? item.ArName : item.EnName;
		        let img = isArabic ? item.ImageBannerUrlAr : item.ImageBannerUrlEn;

		        InteractionManager.runAfterInteractions(() => {
		            Share.open({
		                    share_URL: url,
		                    share_text: title,
		                    share_image_URL: img
		                }, (e) => {
		                    //this.setState({isLoading: false});
		                    /*if(e == null) {
		                        this.showAlertDlg("Share Notification", "Successfully Shared");
		                    }
		                    else if(e != "Canceled") {
		                        this.showAlertDlg("Share Notification", e);
		                    }*/
		            });
		        });
	    	}
    	}
    }
	
	generateContents(imageHeight) {
        let dataSource = this.state.dataSource;
        let contents = [];
        for (let i = 0; i < dataSource.length; i++) {
        	//let name = this.state.isArabic ? dataSource[i].ArName : dataSource[i].EnName;
        	//let imageUri = this.state.isArabic ? dataSource[i].ImageBannerUrlAr : dataSource[i].ImageBannerUrlEn;
        	let name = this.props.isArabic ? dataSource[i].ArName : dataSource[i].EnName;
        	let imageUri = this.props.isArabic ? dataSource[i].ImageBannerUrlAr : dataSource[i].ImageBannerUrlEn;
          contents.push(
            <View key={i} style={{width:screenWidth,height:screenHeight,backgroundColor:'transparent',}}>
           		<Image source={{uri:imageUri}} 
         				style={{width:screenWidth,height:imageHeight,}} />
         		<Text style={styles.title}>{name}</Text>
           	</View>
          );
        }

        return contents;
    }

	render() {

		if(this.state.isLoading) {
			return null;
		}
		
		let item = this.state.dataSource[currentPageIndex];

		isArabic = this.props.isArabic;// this.state.isArabic;
		let donateText = isArabic? 'تبرع الان':'Donate Now';
		let campainDonatesText  = isArabic? 'تبرعات الحملة':'Campaign Donations';
		let shareText  = isArabic? 'مشاركة':'Share';
		let aboutText  = isArabic? 'عن الحملة':'About Campaign';

		let iconBarHeight = 60
		let imageHeight = screenHeight - iconBarHeight;
		let pagerOffset = 10;
		let borderRadius = 5;
		let borderRadiusTopStyle = {borderTopLeftRadius:borderRadius,borderTopRightRadius:borderRadius,};
		
		let redirectInfo = {
			id: 'QCHome',
            title: 'Welcome',
		};
		let donate = (
			<TouchableHighlight 
				onPress={() => { AccountController.executeIfAuthenticated(this.props.currentUser, 
									this.donateNow(currentPageIndex), isArabic, 
									this.props.navigator, redirectInfo)}} 
                              	style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
	            <View style={styles.iconContainer}>
	              	<Image source={require("image!ic_donate")} style={styles.icon} />
	              	<Text style={styles.label}>{ donateText }</Text>
	            </View>
	        </TouchableHighlight>
		);
		let campainDonates = (
			<TouchableHighlight onPress={() => this.goToCampaignCauses()} 
                              	style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
	            <View style={styles.iconContainer}>
	              <Image source={require("image!ic_campaigncases")} style={styles.icon} />
	              <Text style={styles.label}>{campainDonatesText }</Text>
	            </View>
	        </TouchableHighlight>
		);
		let share = (
			<TouchableHighlight onPress={() => this.onPressShare()} 
                              	style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
	            <View style={styles.iconContainer}>
	              <Image source={require("image!ic_share")} style={styles.icon} />
	              <Text style={styles.label}>{shareText }</Text>
	            </View>
	        </TouchableHighlight>
		);
		let about = (
			<TouchableHighlight onPress={() => this.toggleInfo()} 
                              	style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
	            <View style={styles.iconContainer}>
	              <Image source={require("image!ic_info")} style={styles.icon} />
	              <Text style={styles.label}>{aboutText }</Text>
	            </View>
	        </TouchableHighlight>
		);

		let first, second, third, fourth;
		if(isArabic){
			first = about;
			second = share; 
			third = campainDonates; 
			fourth = donate;
		}
		else {
			first = donate;
			second = campainDonates; 
			third = share; 
			fourth = about;
		}
        return (
        	<View style={{marginTop: 6, width:screenWidth,height:screenHeight,flexDirection:'column', 
        					overflow:'hidden',borderRadius:5}}>
	        	<Carousel
	                width={screenWidth}
	                height={imageHeight}
	                pagerColor="transparent"
	                activePagerColor="#ffffff"
	                pagerSize={10}
	                pagerOffset={pagerOffset}
	                pagerMargin={2}
	                speed={2000}
	                onPress={this.onPressSlide}
	                onPageChanged={this.onPageChanged}
	                isArabic={isArabic}
	                >
	                {this.generateContents(imageHeight)}
	            </Carousel>
            	<View style={styles.iconsBarContainer}>
		          <View style={styles.iconsWrapper}>
		          	{first}
		            {second}
		            {third}
		            {fourth}
		          </View>
		        </View>
            </View>
        );
  	}
}

var styles = StyleSheet.create({
  iconsBarContainer: {
      backgroundColor: 'white', 
      height: 60,
      borderBottomLeftRadius:5,
      borderBottomRightRadius:5,
      alignItems: 'center', 
      justifyContent:'center',
  },
  iconsWrapper: {
      backgroundColor: 'transparent',
      flexDirection:'row',
      margin: 7,
  },
  iconContainer: {
      alignItems: 'center', 
      justifyContent:'center',
  },
  iconTouch: {
      marginLeft: 2,
      marginRight: 2,
  },
  icon: {
    height:30,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 10,
    lineHeight: 15,
    color: '#535353',
  	fontFamily: 'Janna New R', 
  },
  title: {
  	position: 'absolute', 
  	bottom: 90, 
  	width: screenWidth, 
  	color: 'white', 
  	textAlign: 'center',
  	fontFamily: 'Janna New R', 
  },
});
module.exports = QCCampaignCarousel;