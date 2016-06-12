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

import { height, width, AccountController, } from '../utilities/constants'

let isArabic = true;
let MySponsrshipDetails = require('./mySponsrshipDetails');

let AllLatePaymentsModal = require('../qcModals/allLatePaymentsModal');
let LatePaymentsModal = require('../qcModals/latePaymentsModal');
let PaymentMethodsModal = require('../qcModals/paymentMethods');
let QCLoading =  require('../../qcLoading');

class Kafalaty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            shponsered: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            donateModalIsOpen: false,
            typedDonationAmount: 0,
            selectedBasketItem: null,
            bulkPaymentModalIsOpen: false,
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    fetchData() {
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }

        if(donorId && donorId != null && donorId > 0) {
            let self = this;
            let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorSponsorShipWithAmount?DonorId=' 
                              + donorId;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                self.setState({
                    shponsered: responseData,
                    dataSource: self.state.dataSource.cloneWithRows(responseData),
                    isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'Kafalaty',
                title: this.props.isArabic ? 'كفلاتي' : 'My Sponsorships',
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
        this.props.navigator.push({
            id: 'MySponsrshipDetails',
            title: isArabic? item.TypeNameAr : item.TypeNameEn,
            component: MySponsrshipDetails,
            passProps: {item: item, isArabic: this.props.isArabic, },
        });
    }

    openDonationModal(item) {
        if(item != null && this.props.currentUser != null) {

            this.setState({
                isLoading: true,
            });

            let self = this;
            let latePayments = {};

           /* fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {*/

                //let sponserDetails = responseData;

                fetch('http://servicestest.qcharity.org/api/User/GetDonorSponsorShipsLatePayments?DonorId='
                                + this.props.currentUser.DonorId + '&SponsorshipId=' 
                                + item.SponsorshipId + '&IsActive=null')
                .then((response) => response.json())
                .then((responseData) => {
                    //let shponsered = this.state.shponsered;
                    //alert(shponsered.indexOf(item))
                    latePayments = responseData[0];
                    //alert(item.PaidThroughId)
                    //alert(latePayments.Sub.length)
                    let basketItem =  null;
                    if(latePayments != null) {
                        basketItem = {
                            ItemId: latePayments.SponsorshipId,
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
                            LatePayments: latePayments,
                        };
                    }
                    self.setState({
                        selectedBasketItem: basketItem,
                        donateModalIsOpen: true,
                        isLoading: false,
                    });
                })
                .done();
           /* })
            .done();*/
        }
    }
    donateModalClosed() {
        this.setState({ 
            donateModalIsOpen: false,
        });
    }
    bulkModalClosed() {
        this.setState({ 
            bulkPaymentModalIsOpen: false,
        });
    }
    openBulkPaymentModal() {
        let self = this;
        if(!this.state.bulkPaymentModalIsOpen) {
            fetch('http://servicestest.qcharity.org/api/User/GetDonorSponsorShipsLatePayments?DonorId='
                                    + 19953 + '&SponsorshipId=null&IsActive=null')
            .then((response) => response.json())
            .then((responseData) => {

                let allAmount = 0, lastMonthAmount = 0;

                responseData.map((delay, index) => {
                    allAmount += delay.Amount * delay.Sub.length;
                    if(delay.Sub.length > 0) {
                        lastMonthAmount += delay.Amount;
                    }
                });

                let basketItem =  null;
                if(true) {
                    basketItem = {
                        AllAmount: allAmount,
                        LastMonthAmount: lastMonthAmount,
                        PaidThroughId: 1,
                        CountryId : 0,
                        AccountTypeId: 0,
                        IsNew: "0",
                        CampaignId: 0,
                        ItemTitle: '',
                        ItemDiscription: '',
                        AmountRemaining: 0,
                        MobileDBId: 0,
                    };
                }
                self.setState({
                    selectedBasketItem: basketItem,
                    donateModalIsOpen: false,
                    bulkPaymentModalIsOpen: true,
                    isLoading: false,
                });
            })
            .done();
        }
    }

    rederItem(item) {


        let donateText = isArabic? 'دفع المتأخرات':'Pay Overdue';
        let detailsText = isArabic? 'التفاصيل':'Details';

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

        let donateBtn = (
            <TouchableHighlight onPress={() => {this.openDonationModal(item);}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer,]}>
                    <Image source={require("image!donate")} style={[styles.icon,]} />
                    <Text style={[styles.label,]}>{donateText}</Text>
                </View>
            </TouchableHighlight>
        );

        let detailsBtn = (
            <TouchableHighlight onPress={() => {this.goDetails(item);}} 
                                style={[styles.iconContainer, styles.iconTouch]} underlayColor={'transparent'}>
                <View style={[styles.iconContainer]}>
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

        let title = isArabic ? item.TypeNameAr : item.TypeNameEn;
        let category = isArabic ? item.DescriptionAr : item.DescriptionEn;
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
                    <Text numberOfLines={2} style={styles.title}>{title}</Text>
                    <Text numberOfLines={1} style={styles.category}>{category}</Text>
                </View>             
                <View style={{flexDirection: 'row',}}>
                    <Text style={[styles.country]}>{country}</Text>
                    {countryFlag}
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
        
        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }

        let delayedIcon = null;
        if(this.state.shponsered && this.state.shponsered != null && this.state.shponsered.length > 0) {
            delayedIcon = (
                <View style={styles.delayedIconWrapper}>
                    <TouchableHighlight style={styles.delayedIconTouch} 
                                        onPress={() => {this.openBulkPaymentModal()}} 
                                        underlayColor={'#fe345a'}>
                        <Image source={require('image!delayed')} style={styles.delayedIcon} />
                    </TouchableHighlight>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ListView
                  dataSource={this.state.dataSource}
                    renderRow={this.rederItem.bind(this)}
                    initialListSize={1}
                    style={{flex: 1, marginBottom:55,}}
                    contentContainerStyle={[styles.contentContainer]} />
                {delayedIcon}
                <AllLatePaymentsModal isOpen={this.state.bulkPaymentModalIsOpen} navigator={this.props.navigator}                           
                            onClosed={() => this.bulkModalClosed()} isArabic={isArabic}
                            onStartRequest={() => this.setState({isLoading: true, bulkPaymentModalIsOpen: false, })}
                            onEndRequest={() => this.setState({isLoading: false,})}
                            item={this.state.selectedBasketItem}
                            currentUser={this.props.currentUser} />
                <LatePaymentsModal isOpen={this.state.donateModalIsOpen} navigator={this.props.navigator}                           
                            onClosed={() => this.donateModalClosed()} isArabic={isArabic}
                            onStartRequest={() => this.setState({isLoading: true, donateModalIsOpen: false, })}
                            onEndRequest={() => this.setState({isLoading: false,})}
                            item={this.state.selectedBasketItem}
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
    delayedIconWrapper: {
        position: 'absolute',
        bottom: 65,
        left: 20,
    },
    delayedIconTouch: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fe345a',
        alignItems: 'center', 
        justifyContent:'center',
    },
    delayedIcon: {
        resizeMode: 'contain',
        width:30,
        height: 30,
    },
    text: {
        fontFamily: 'Janna New R',
    },
});
module.exports = Kafalaty;