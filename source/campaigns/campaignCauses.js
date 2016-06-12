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

import { height, width, text, AccountController, } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let CauseDetails = require('./causeDetails');
let isArabic = true;

let QuickDonationModal = require('../qcModals/quickDonationModal');

class CampaignCauses extends Component {

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
        if(this.props.onSearchParamsDefined) {
            this.props.onSearchParamsDefined(this.props.campaignId, 1);
        }
        this.fetchData();
    }
    fetchData() {
        let donorId = 0;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }

        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetCampaignCausesList?DonorId='
                            + donorId +'&CampaignId=' 
                            + this.props.campaignId;
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            let data = [];
            if(responseData && responseData.length && responseData.length > 0) {
                responseData.map((item, index) => {
                    if(item.DefaultPrice > 0) {
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
    goDetails(item) {
        let title = isArabic? item.TitleAr : item.TitleEn;
        if(item.PaidThroughId == 1) {
            this.props.navigator.push({
                id: 'MySponsrshipDetails',
                title: title,
                passProps: {
                    item: item, isArabic: this.props.isArabic,
                    campaignId: this.props.campaignId 
                },
            });
        }
        else if(item.PaidThroughId == 4) {
            this.props.navigator.push({
                id: 'ProjectDetails',
                title: title,
                passProps: {item: item, isArabic: this.props.isArabic,
                    campaignId: this.props.campaignId  },
            });
        }
        else {
            this.props.navigator.push({
                id: 'CauseDetails',
                title: title,
                component: CauseDetails,
                passProps: {item: item, campaignId: this.props.campaignId, isArabic: this.props.isArabic, },
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
        let totalAmountText = isArabic? 'القيمة الإجمالية':'Total Amount';
        let currencyText = isArabic? 'ر.ق':'Q.R';

        let donateStyle = isArabic? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
        let detailsStyle = isArabic? {alignSelf: 'flex-start'} : {alignSelf: 'flex-end'};
        let donateTextStyle = isArabic? {textAlign: 'right'} : {textAlign: 'left'};
        let detailsTextStyle = isArabic? {textAlign: 'left'} : {textAlign: 'right'};

        let redirectInfo = {
            id: 'QCHome',
            title: 'Welcome',
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

        let firstIcon, lastIcon;
        if(isArabic) {
            firstIcon = detailsBtn;
            lastIcon = donateBtn;
        }
        else {
            firstIcon = donateBtn;
            lastIcon = detailsBtn;
        }

        //let flag = '../../contents/icons/flags/' + item.ContryId + '.png';
        let flag = 'flg_' + item.ContryId;// + '.png';
        flag = {uri: flag };
        let image = <Image source={{uri: item.Image}} style={styles.causeImage} />;
        let rightSide = (
            <View style={{flex: 1,flexWrap: 'wrap', marginRight: 20, marginLeft: 20,}}>
                <View>
                    <Text numberOfLines={2} style={styles.text}>{item.TitleAr}</Text>
                    <Text numberOfLines={1} style={styles.text}>{item.CategoryNameAr}</Text>
                </View>                
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1, marginRight: 5, marginLeft: 5,}]}>{item.ContryNameAr}</Text>
                    <Image source={flag} style={styles.flag} />
                </View>
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.text, {flex: 1,color: '#fe345a'}]}>{item.DefaultPrice} {currencyText}</Text>
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
                CampaignId: this.props.campaignId,
                ItemTitle: '',
                ItemDiscription: '',
                AmountRemaining: 0,
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
module.exports = CampaignCauses;