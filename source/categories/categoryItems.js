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
import { height, width, text, AccountController } from '../utilities/constants';

let isArabic = true;
let QCLoading =  require('../../qcLoading');
let tabbarActions = require('../../globalActions/tabbarActions');

let QuickDonationModal = require('../qcModals/quickDonationModal');

class CategoryItems extends Component {

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
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    fetchData() {
        let category = this.props.category;

        let self = this;
        let categoryId = null;//(category.SubTypeId == 2) ? null : category.CategoryId;
        
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorDonationListSearchNew?DonorId=0&CategoryId=' 
                            + categoryId + '&TypeId=' 
                            + category.TypeId + '&CountryId=0&SubTypeId='
                            + category.SubTypeId + '&DonationTypeId='
                            + category.DonationTypeId + '&LanguageId='
                            + ((isArabic) ? 1 : 2) + '&MaxPrice=0&MinPrice=0&InternalCategory='
                            + category.InternalCategory; 
        //alert(REQUEST_URL)

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(responseData),
                isLoading: false,
            });
        })
        .done();
    }
    goDetails(item) {
        let title = isArabic? item.TitleAr : item.TitleEn;
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
        let addBasketText = isArabic? 'إضافة للسلة':'Add to Basket';
        let shareText = isArabic? 'مشاركة':'Share';

        //Total
        let itemType = '';
        if(isArabic) {
            itemType = item.IsProduct ? ' المشروع' : ' الكفالة'
        }
        else {
            itemType = item.IsProduct ? 'Project ' : 'Kafala '
        }
        let totalAmountText = isArabic? 'إجمالي' + itemType : itemType + 'Total';
        let currencyText = isArabic? 'ر.ق':'QAR';

        let donateStyle = isArabic? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
        let detailsStyle = isArabic? {alignSelf: 'flex-start'} : {alignSelf: 'flex-end'};
        let donateTextStyle = isArabic? {textAlign: 'right'} : {textAlign: 'left'};
        let detailsTextStyle = isArabic? {textAlign: 'left'} : {textAlign: 'right'};

        let redirectInfo = {
            id: 'QCHome',
            title: 'Welcome',
        };
        let donateBtn = (
            <TouchableHighlight onPress={() => {AccountController.executeIfAuthenticated(this.props.currentUser,
                                    this.openDonationModal(item), isArabic, this.props.navigator, redirectInfo)}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!donate")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{donateText}</Text>
                </View>
            </TouchableHighlight>
        );

        /*let basketBtn = (
            <TouchableHighlight onPress={() => {return null}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!cart")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{addBasketText}</Text>
                </View>
            </TouchableHighlight>
        );*/

        let shareBtn = (
            <TouchableHighlight onPress={() => this.onPressShare(item)} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!share")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{shareText}</Text>
                </View>
            </TouchableHighlight>
        );

        let detailsBtn = (
            <TouchableHighlight onPress={() => this.goDetails(item)} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer]}>
                    <Image source={require("image!details")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{detailsText}</Text>
                </View>
            </TouchableHighlight>
        );

        let firstIcon, secondIcon, thirdIcon, lastIcon;
        if(isArabic) {
            firstIcon = detailsBtn;
            secondIcon = shareBtn;
            //thirdIcon = basketBtn;
            lastIcon = donateBtn;
        }
        else {
            firstIcon = donateBtn;
            //secondIcon = basketBtn;
            thirdIcon = shareBtn;
            lastIcon = detailsBtn;
        }
        
        let countryFlag = null;
        if(item.ContryId != 613) {
            let flag = 'flg_' + item.ContryId;
            flag = {uri: flag };

            countryFlag = <Image source={flag} style={styles.flag} />;
        }
        
        let title = isArabic ? item.TitleAr : item.TitleEn;
        let category = isArabic ? item.CategoryNameAr : item.CategoryNameEn;
        let country = isArabic ? item.ContryNameAr : item.ContryNameEn;

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
                {/*<View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1,color: '#fe345a'}]}>{item.DefaultPrice} {currencyText}</Text>
                    <Text style={[styles.text, {color: '#fe345a', marginLeft: 20,}]}>{'إجمالي التكلفة'}</Text>
                </View> */}
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
                    {thirdIcon}
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
                    style={{flex: 1, marginBottom:55,}}
                    contentContainerStyle={[styles.contentContainer]} />
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
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginTop: -1,
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
        width: width - 10,
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
        fontSize: 10,
        lineHeight: 15,
        flexWrap: 'nowrap',
        color: '#ffffff',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
        fontFamily: 'Janna New R',
        //width:width / 4,
    },
    text: {
        fontFamily: 'Janna New R',
    },
    title: {
        color: '#535353',
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Janna New R',
    },
    category: {
        color: '#06aebb',
        fontSize: 12,
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
    },
    flag: {
        width:22,
        height: 15,
        resizeMode: 'cover',
    },
});
module.exports = CategoryItems;