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

import { height, width, AccountController } from '../utilities/constants'

let ProjectDetails = require('../projects/projectDetails');
let TopTabs = require('../sharedControls/topTabs');
let QCLoading =  require('../../qcLoading');
let isArabic = true;

let QuickDonationModal = require('../qcModals/quickDonationModal');
let PaymentMethodsModal = require('../qcModals/paymentMethods');

class MyProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            isLoading: true,
            dataSourceFinished: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            dataSourcePending: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            donateModalIsOpen: false,
            payNowModalIsOpen: false,
            typedDonationAmount: 0,
            selectedBasketItem: null,
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    changeTab() {
        //tabbarActions.setTab('profile');
    }
    fetchData() {
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }

        if(donorId && donorId != null && donorId > 0) {
            let self = this;
            let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorProjects?DonorId=' 
                              + donorId;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                let dataSourceFinished = [];
                let dataSourcePending = [];

                for(var i = 0; i < responseData.length; i++) {
                    if(responseData[i].AmountRemaining == 0) {
                        dataSourceFinished.push(responseData[i]);
                    }
                    else {
                        dataSourcePending.push(responseData[i]);
                    }
                }
                
                self.setState({
                    dataSourcePending: self.state.dataSourcePending.cloneWithRows(dataSourcePending),
                    dataSourceFinished: self.state.dataSourceFinished.cloneWithRows(dataSourceFinished),
                    isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'MyProjects',
                title: this.props.isArabic ? 'مشاريعي' : 'My Projects',
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
            id: 'ProjectDetails',
            title: isArabic? item.DescriptionAr : item.DescriptionEn,
            component: ProjectDetails,
            passProps: {item: item, isArabic: this.props.isArabic, },
        });
    }
    switchProjectsType(isFinished) {
        if(!this.state.isLoading) {
            this.setState({ 
                activeIndex: isFinished ? 0 : 1,
                selectedBasketItem: null,
                typedDonationAmount: 0,
                donateModalIsOpen: false,
                payNowModalIsOpen: false, 
            });
        }
    }
    
    goToNeeds(item) {

    }

    openDonationModal(item) {
        if(item.AmountRemaining > 0 ) {
            let basketItem =  null;
            if(item != null) {
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
            this.setState({
                selectedBasketItem: basketItem,
                donateModalIsOpen: true,
                payNowModalIsOpen: false,
            });
        }
    }
    donateModalClosed() {
        this.setState({ 
            donateModalIsOpen: false,
        });
    }
    openPayNowModal(amount) {
        if(amount > 0) {
            this.setState({
                donateModalIsOpen: false,
                typedDonationAmount: amount,
                payNowModalIsOpen: true,
            });
        }
    }
    payNowModalClosed() {
        this.setState({ 
            payNowModalIsOpen: false,
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
            <TouchableHighlight onPress={() => this.openDonationModal(item)} 
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
            
        let firstBtnText = isArabic? 'مشاريع منجزة' : 'Finished Projects';
        let secondBtnText = isArabic? 'مشاريع قيد التنفيذ' : 'Pending Projects';
        let activeIndex = this.state.activeIndex;

        let loading = null;
        let listCtrl = null;
        
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {

            let dataSource = activeIndex == 0 ? this.state.dataSourceFinished : this.state.dataSourcePending;
            listCtrl = (
                <ListView
                    dataSource={dataSource}
                    renderRow={this.rederItem.bind(this)}
                    initialListSize={1}
                    style={{flex: 1, marginBottom:55,}}
                    contentContainerStyle={[styles.contentContainer]} />
            );
        }

        return (
            <View style={styles.container}>
                <TopTabs isArabic={isArabic} 
                         firstBtnText={firstBtnText} 
                         secondBtnText={secondBtnText} 
                         activeIndex={activeIndex}
                         onFirstPressed={() => this.switchProjectsType(true)}
                         onSecondPressed={() => this.switchProjectsType(false)} />
                {listCtrl}
                <QuickDonationModal isOpen={this.state.donateModalIsOpen}                            
                            onClosed={() => this.donateModalClosed()} isArabic={isArabic}
                            onStartRequest={() => this.setState({isLoading: true, donateModalIsOpen: false, })}
                            onEndRequest={() => this.setState({isLoading: false,})}
                            onPayNowClicked={(amount) => this.openPayNowModal(amount)}
                            item={this.state.selectedBasketItem}
                            currentUser={this.props.currentUser} />
                <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                            onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                            onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                            item={this.state.selectedBasketItem}  amount={this.state.typedDonationAmount} type='myProjects'
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
        marginTop:-1,
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
module.exports = MyProjects;