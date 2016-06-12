'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    Image,    
    TouchableHighlight,
    InteractionManager,
} from 'react-native';

import Share from 'react-native-share';
import { height, width, text, AccountController } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let isArabic = true;

let QuickDonationModal = require('../qcModals/quickDonationModal');

class OldDonations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            donateModalIsOpen: false,
            basketItem: null,
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        isArabic = this.props.isArabic;//alert(this.props.campaignId)
        this.fetchData();
    }
    fetchData() {
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }

        if(donorId && donorId != null && donorId > 0) {
            let self = this;
            let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorOldDonation?DonorId='
                                + donorId;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                let data = [];
                if(responseData && responseData.length && responseData.length > 0) {
                    responseData.map((item, index) => {
                        if(item.AmountPaid > 0) {
                            data.push(item);
                        }
                    });
                }
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(data),
                    isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'OldDonations',
                title: this.props.isArabic ? 'تبرعاتي القديمة' : 'My Old Donations',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: this.props.isArabic, redirectInfo: redirectInfo, },
            });
        }   
    }
    goDetails(item) {
        let title = isArabic? item.DescriptionAr : item.DescriptionEn;
        if(item.PaidThroughId == 1) {
            this.props.navigator.push({
                id: 'MySponsrshipDetails',
                title: title,
                passProps: {item: item, isArabic: this.props.isArabic, },
            });
        }
        else if(item.PaidThroughId == 4) {
            this.props.navigator.push({
                id: 'ProjectDetails',
                title: title,
                passProps: {item: item, isArabic: this.props.isArabic, },
            });
        }
        else {
            this.props.navigator.push({
                id: 'CauseDetails',
                title: title,
                passProps: {item: item, campaignId: this.props.campaignId, isArabic: this.props.isArabic, },
            });
        }
    } 

    onPressShare(item) {

        if(item && item != null) {
            //this.setState({isLoading: true});
            let url = isArabic ? item.ShareLink : item.ShareLinkEn;
            let title = isArabic ? item.DescriptionAr : item.DescriptionEn;
            let img = item.Image;

            InteractionManager.runAfterInteractions(() => {
                Share.open({
                        share_URL: url,
                        share_text: title,
                        share_image_URL: img
                    }, (e) => {
                });
            });
        }
    }   
    openDonationModal(item) {
        this.setState({ 
            basketItem: item,
            donateModalIsOpen: true,
        });
    }
    donateModalClosed() {
        this.setState({ 
            donateModalIsOpen: false,
        });
    }

    rederItem(item) {


        let donateText = isArabic? 'تبرع الان':'Donate Now';
        let detailsText = isArabic? 'التفاصيل':'Details';
        let paidAmountText = isArabic? 'المبلغ المدفوع':'Paid Amount';
        let remainingAmountText = isArabic? 'المبلغ المتبقي':'Remaining Amount';
        let currencyText = isArabic? 'ر.ق':'Q.R';
        let shareText = isArabic? 'مشاركة':'Share';

        let donateStyle = isArabic? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
        let detailsStyle = isArabic? {alignSelf: 'flex-start'} : {alignSelf: 'flex-end'};
        let donateTextStyle = isArabic? {textAlign: 'right'} : {textAlign: 'left'};
        let detailsTextStyle = isArabic? {textAlign: 'left'} : {textAlign: 'right'};

        let redirectInfo = {
            id: 'OldDonations',
            title: isArabic? 'تبرعاتي القديمة' :'Old Donations',
        };

        let donateBtn = (
            <TouchableHighlight onPress={() => { AccountController.executeIfAuthenticated(this.props.currentUser,
                                    this.openDonationModal(item), isArabic, this.props.navigator, redirectInfo)}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!donate")} style={[styles.icon, donateStyle]} />
                    <Text style={[styles.label, donateTextStyle]}>{donateText}</Text>
                </View>
            </TouchableHighlight>
        );

        let detailsBtn = (
            <TouchableHighlight onPress={() => this.goDetails(item)} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer]}>
                    <Image source={require("image!details")} style={[styles.icon, detailsStyle]} />
                    <Text style={[styles.label, detailsTextStyle]}>{detailsText}</Text>
                </View>
            </TouchableHighlight>
        );

        let shareBtn = (
            <TouchableHighlight onPress={() => this.onPressShare(item)} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!share")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{shareText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstIcon, secondIcon, lastIcon;
        if(isArabic) {
            firstIcon = detailsBtn;
            secondIcon = shareBtn;
            lastIcon = donateBtn;
        }
        else {
            firstIcon = donateBtn;
            secondIcon = shareBtn;
            lastIcon = detailsBtn;
        }

        let title = isArabic? item.DescriptionAr : item.DescriptionEn;
        let category = isArabic ? item.TitleAr : item.TitleEn;
        let country = isArabic ? item.ContryNameAr : item.ContryNameEn;

        let countryFlag = null;
        if(item.ContryId != 613) {
            let flag = 'flg_' + item.ContryId;
            flag = {uri: flag };

            countryFlag = <Image source={flag} style={styles.flag} />;
        }

        let image = <Image source={{uri: item.Image}} style={styles.causeImage} />;
        let rightSide = (
            <View style={{flex: 1,flexWrap: 'wrap', marginRight: 20, marginLeft: 20,}}>
                <View>
                    <Text numberOfLines={2} style={[styles.text, styles.title]}>{title}</Text>
                    <Text numberOfLines={1} style={[styles.text, styles.category]}>{category}</Text>
                </View>                
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, styles.country]}>{country}</Text>
                    {countryFlag}
                </View>
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1,color: '#fe345a'}]}>{item.AmountPaid} {currencyText}</Text>
                    <Text style={[styles.text, {color: '#fe345a', marginLeft: 20,}]}>{paidAmountText}</Text>
                </View> 
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1,color: '#fe345a'}]}>{item.AmountRemaining} {currencyText}</Text>
                    <Text style={[styles.text, {color: '#fe345a', marginLeft: 20,}]}>{remainingAmountText}</Text>
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
                    {secondIcon}
                    {lastIcon}
                </View>
            </View>
        );
    }

    render() {
        let basketItem = null, loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        if(this.state.basketItem != null) {
            let item = this.state.basketItem;

            basketItem = {
                ItemId: item.ItemId,
                PaidThroughId: item.PaidThroughId,
                CountryId : item.ContryId,
                AccountTypeId: item.AccountTypeId,
                IsNew: item.IsNew,
                CampaignId: 0,
                ItemTitle: '',
                ItemDiscription: '',
                AmountRemaining: item.AmountRemaining,
                PaidAmount: item.AmountPaid,
                FixedPrice: item.DefaultPrice,
                MobileDBId: 0,
            };
        }

        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.rederItem.bind(this)}
                    initialListSize={1}
                    style={{flex: 1,}} />
                <QuickDonationModal isOpen={this.state.donateModalIsOpen} navigator={this.props.navigator}                         
                    onClosed={() => this.donateModalClosed()} isArabic={isArabic}
                    onStartRequest={() => this.setState({isLoading: true, donateModalIsOpen: false, })}
                    onEndRequest={() => this.setState({isLoading: false,})}
                    item={basketItem}
                    currentUser={this.props.currentUser} />
                {loading}
            </View>
        );
  	}
}


var styles = StyleSheet.create({  	
    container: {
        flex: 1,
        paddingTop: 10,
        marginBottom:50,
    },
    itemContainer: {
        //marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
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
    actionsContainer: {
        padding: 5,
        borderBottomLeftRadius:3,
        borderBottomRightRadius:3,
        backgroundColor: '#06aebb',
        height:60,
        flex:1,
        flexDirection: 'row',
    },
    title: {
        color: '#535353',
        fontSize: 16,
        marginBottom: 5,
    },
    category: {
        color: '#06aebb',
        fontSize: 12,
        marginBottom: 5,
    },
    country: {
        flex: 1, 
        marginRight: 5, 
        marginLeft: 5,
        marginBottom: 5,
        color: '#cccccc',
        fontSize: 12,
    },
    flag: {
        width:22,
        height: 15,
        resizeMode: 'cover',
    },
    iconContainer: {
        flex:1,
        alignItems: 'center', 
        justifyContent:'center',
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,
        /*alignItems: 'center', 
        justifyContent:'center',
        width:width / 2,*/
    },
    icon: {
        height:25,
        resizeMode: 'contain',
        
    },
    label: {
        flex:1,
        fontSize: 12,
        lineHeight: 15,
        color: '#ffffff',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
        fontFamily: 'Janna New R', 
    },
    text: {
        fontFamily: 'Janna New R',
    },
});
module.exports = OldDonations;