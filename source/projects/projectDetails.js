'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image, 
    View,
    ScrollView,
    ListView,
    TouchableHighlight,
} from 'react-native';

import { height, width, } from '../utilities/constants'

let QuickDonationModal = require('../qcModals/quickDonationModal');

let TopTabs = require('../sharedControls/topTabs');
let ProjectPhases = require('./projectPhases');
let QCLoading =  require('../../qcLoading');

let isArabic = true;

//https://portal.qcharity.net/Exportpath/
//https://portal.qcharity.net/
class ProjectDetails extends Component {

    constructor(props) {
       super(props);
        this.state = {
            activeIndex: 0,
            isLoading: true,
            itemDetails: {},
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            donateModalIsOpen: false,
            typedDonationAmount: 0,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    fetchData() {
        let item = this.props.item;
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetDonationDetails?itemId=' 
                          + item.ItemId + '&itemTypeId=4&isProject=true&countryId=' 
                          + item.ContryId + '&languageId=' + (isArabic ? '1' : '2');
        //alert("REQUEST_URL " + REQUEST_URL);
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {

            self.setState({
                itemDetails: responseData,
                //isLoading: false,
            });
        })
        .done();

        let url = ('http://servicestest.qcharity.org/api/Donation/GetProjectsProgress?ProjectId=' 
                          + this.props.item.ItemId);
        fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(responseData),
                isLoading: false,
            });
        })
        .done();
    }
    componentWillUnmount() {
    }
    switchTab(isFirstTab) {
        if(!this.state.isLoading) {
            this.setState({ activeIndex: isFirstTab ? 0 : 1, });
        }
    }

    openDonationModal() {
        this.setState({ 
            donateModalIsOpen: true,
        });
    }
    donateModalClosed() {
        this.setState({ 
            donateModalIsOpen: false,
        });
    }

    
    render() {

        let itemDetails = this.state.itemDetails;
        let item = this.props.item;

        let activeIndex = this.state.activeIndex;
        let aboutText = isArabic? 'عن المشروع':'About Project';
        let picsText = isArabic? 'المراحل':'Phases';

        let currentTabContent = null;
        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {
            if(activeIndex == 1) {
                currentTabContent = (
                    <ProjectPhases isArabic={isArabic} dataSource={this.state.dataSource} currentUser={this.props.currentUser} />
                );
            }
            else {
                let paidText = isArabic? 'المدفوع':'Paid Amount';
                let remainText = isArabic? 'المتبقى':'Remaining Amount';
                let currencyText = isArabic? 'ر.ق':'Q.R';

                let beneficiaryText = isArabic? 'عدد المستفيدين':'Beneficiaries';
                let totalText = isArabic? 'إجمالي المشروع':'Total Cost';
                let countryText = isArabic? 'البلد':'Country';
                let donationText = isArabic? 'عدد مرات التبرع':'Donation Times';

                let descriptionText = isArabic? 'وصف المشروع':'Description';
                let goalsText = isArabic? 'أهداف المشروع':'Project Goals';
                let reasonsText = isArabic? 'مبررات المشروع':'Project Reasons';
                let expectedResultsText = isArabic? 'النتائج المتوقعة':'Expected Results';

                let title = itemDetails.AccountName;
                let category = itemDetails.Level1;
                let category2 = itemDetails.Level2;
                let country = isArabic ? item.ContryNameAr : item.ContryNameEn;

                let description = itemDetails.Description && itemDetails.Description.length > 0 ? itemDetails.Description : null;
                if(description && description != null) {
                    description = (
                        <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                            <Text style={styles.detailsTitle}>{descriptionText}</Text>
                            <Text style={styles.detailsText}>{description}</Text>
                        </View>
                    );
                }
                let goals = itemDetails.Goals && itemDetails.Goals.length > 0 ? itemDetails.Goals : null;
                
                if(goals && goals != null) {
                    goals = (
                        <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                            <Text style={styles.detailsTitle}>{goalsText}</Text>
                            <Text style={styles.detailsText}>{goals}</Text>
                        </View>
                    );
                }
                let reasons = itemDetails.Reasons && itemDetails.Reasons.length > 0 ? itemDetails.Reasons : null;
                if(reasons && reasons != null) {
                    reasons = (
                        <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                            <Text style={styles.detailsTitle}>{reasonsText}</Text>
                            <Text style={styles.detailsText}>{reasons}</Text>
                        </View>
                    );
                }
                let expectedResults = itemDetails.ExpectedResults && itemDetails.ExpectedResults.length > 0 ? itemDetails.ExpectedResults : null;
                if(expectedResults && expectedResults != null) {
                    expectedResults = (
                        <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                            <Text style={styles.detailsTitle}>{expectedResultsText}</Text>
                            <Text style={styles.detailsText}>{expectedResults}</Text>
                        </View>
                    );
                }

                let unPaidWidth = 0;
                if(item.AmountPaid == 0) {
                    unPaidWidth = width - 60;
                }
                else if(item.AmountRemaining > 0) {
                    let percent = 100 - ((item.AmountPaid * 100) / (item.AmountPaid + item.AmountRemaining));
                    unPaidWidth = (percent / 10) * 30;
                }

                let countryFlag = null;
                if(item.ContryId != 613) {
                    let flag = 'flg_' + item.ContryId;
                    flag = {uri: flag };

                    countryFlag = <Image source={flag} style={styles.flag} />;
                }

                let img = 'https://portal.qcharity.net' + itemDetails.Image;
                currentTabContent = (
                    <ScrollView style={{flex: 1,}} contentContainerStyle={[styles.contentContainer]}>
                        <View style={[styles.section, styles.imageSection]}>
                            <Image source={{uri: img}} style={styles.causeImage} />
                            <View style={styles.icons}>
                                <TouchableHighlight 
                                        style={[styles.iconTouch,]}
                                        onPress={() => this.openDonationModal()}
                                        underlayColor={'transparent'}>
                                    <Image source={require('image!donate_normal')} style={[styles.icon, styles.donateIcon]} />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.category}>{category}</Text>
                                <Text style={styles.category}>{category2}</Text>
                            </View>
                        </View>

                        <View style={[styles.section, styles.amountSection]}>
                            <View style={styles.amountTitle}>
                                <Text style={styles.remainText}>{remainText}</Text>
                                <Text style={styles.paidText}>{paidText}</Text>
                            </View>
                            <View style={styles.amountTitle}>
                                <Text style={styles.remainText}>{item.AmountRemaining} {currencyText}</Text>
                                <Text style={styles.paidText}>{item.AmountPaid} {currencyText}</Text>
                            </View>
                            <View style={styles.amountTotalGraph}>
                                <View style={[styles.amountPaidGraph, {width: (width - 60) - unPaidWidth,}]}></View>
                            </View>
                        </View>
                        <View style={[styles.section, styles.amountSection]}>
                            <View style={[styles.innerRow, {width: (width - 60),}]}>
                                <Text style={styles.smallSectionText}>{totalText}</Text>
                            </View>
                            <View style={[styles.innerRow, {width: (width - 60), marginTop: 10,}]}>
                                <Image source={require('image!amount_icon')} style={{height: 30, width: 30, resizeMode: 'contain'}} />
                                <Text style={[styles.smallSectionDetails, styles.redText]}>{(item.AmountPaid + item.AmountRemaining)} <Text style={{fontSize:14,}}>{currencyText}</Text></Text>
                            </View>
                        </View>
                        <View style={[styles.section, styles.sectionSmalls, ]}>                        
                            <View style={styles.smallSection}>
                                <View style={styles.innerRow}>
                                    <Text style={styles.smallSectionText}>{countryText}</Text>
                                </View>
                                <View style={styles.innerRow}>
                                    {countryFlag}
                                    <Text style={styles.smallSectionDetails}>{country}</Text>
                                </View>
                            </View>
                            <View style={styles.smallSection}>
                                <View style={styles.innerRow}>
                                    <Text style={styles.smallSectionText}>{beneficiaryText}</Text>
                                </View>
                                <View style={styles.innerRow}>
                                    <Image source={require('image!male')} style={{height: 30, width: 30, resizeMode: 'contain'}} />
                                    <Text style={styles.smallSectionDetails}>{itemDetails.NoOfBeneficiary}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.section, styles.detailsSection]}>
                            {description}
                            {goals}
                            {reasons}
                            {expectedResults}
                        </View>
                    </ScrollView>
                );
            }
        }

        let basketItem =  null;
        if(itemDetails != null) {
            basketItem = {
                ItemId: item.ItemId,
                PaidThroughId: itemDetails.PaidThroughId,
                CountryId : item.ContryId,
                AccountTypeId: itemDetails.AccountTypeId,
                IsNew: item.IsNew,
                CampaignId: 0,// 
                ItemTitle: itemDetails.AccountName,
                ItemDiscription: '',
                AmountRemaining: item.AmountRemaining,
                PaidAmount: item.AmountPaid,
                FixedPrice: item.DefaultPrice,
                MobileDBId: 0,
            };
        }
        
        return (
            <View style={styles.container}>
                <TopTabs isArabic={isArabic} 
                         firstBtnText={aboutText} 
                         secondBtnText={picsText} 
                         activeIndex={activeIndex}
                         onFirstPressed={() => this.switchTab(true)}
                         onSecondPressed={() => this.switchTab(false)} />
                {currentTabContent}
                <QuickDonationModal isOpen={this.state.donateModalIsOpen} navigator={this.props.navigator}                          
                            onClosed={() => this.donateModalClosed()} isArabic={isArabic}
                            onStartRequest={() => this.setState({isLoading: true, donateModalIsOpen: false, })}
                            onEndRequest={() => this.setState({isLoading: false,})}
                            item={basketItem}
                            currentUser={this.props.currentUser} />
                {/*<PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                            onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                            onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                            item={basketItem} amount={this.state.typedDonationAmount} type='project' />*/}
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
        marginBottom:55,
    },
    contentContainer: {
        width: width - 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
    section: {
        width: width - 20,
        backgroundColor: 'white',
        borderRadius: 3,
        marginBottom: 8,
        alignItems: 'center', 
        justifyContent:'center',
    },
    sectionSmalls: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        borderRadius: 0,
        justifyContent:'space-between',
    },
    smallSection: {
        width: (width - 30) / 2,
        height: 100,
        borderRadius: 3,
        backgroundColor: 'white',
        padding: 15,
    },
    innerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start', 
    },
    smallSectionText: {  
        flex: 1,      
        textAlign: 'right', 
        color: '#535353',
        fontFamily: 'Janna New R',
    },
    smallSectionDetails: {  
        flex: 1,      
        textAlign: 'right',
        fontSize: 18,
        color: '#535353',
        fontFamily: 'Janna New R',
    },
    redText: {
        color: '#fe345a',
    },
    detailsTitle: {
        flex: 1,    
        textAlign: 'right', 
        fontSize: 16,
        color: '#535353',
        marginBottom: 5,
        fontFamily: 'Janna New R',
    },
    detailsText: {    
        flex: 1,
        textAlign: 'right', 
        fontSize: 14,
        color: '#535353',
        marginBottom: 20,
        fontFamily: 'Janna New R',
    },
    detailsSection: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    causeImage: {
        width: width - 20,
        height: 170,
        resizeMode: 'cover',
    },
    icons: {
        width: width - 60,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent:'center',
        marginTop: -50,
    },
    iconTouch: {        
        flex:1,
        alignItems: 'center', 
        justifyContent:'center',
    },
    icon: {
        resizeMode: 'contain',
    },
    shareIcon: {
        width: 80,
        height: 80,
        //backgroundColor: 'green',
    },
    donateIcon: {
        width: 115,
        height: 110,
        //backgroundColor: 'gray',
    },
    cartIcon: {
        width: 80,
        height: 80,
        //backgroundColor: 'black',
    },
    iconContainer: {
        flex:1,
    },
    details: {
        width: width - 20,
        padding: 15,
    },
    title: {
        fontSize: 16,
        lineHeight: 25,
        color: '#535353',
        textAlign: 'right',
        marginBottom: 10,
        fontFamily: 'Janna New R',
    },
    category: {
        fontSize: 12,
        //lineHeight: 15,
        color: '#06aebb',
        textAlign: 'right',
        marginBottom: 4,
        fontFamily: 'Janna New R',
    },
    amountSection: {
        padding: 15,
    },
    amountTitle: {
        width: width - 20,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
    },
    remainText: {
        alignSelf: 'flex-end', 
        flex: 1,
        textAlign: 'left',
        color: '#535353',
        fontFamily: 'Janna New R',
    },
    paidText: {
        alignSelf: 'flex-start', 
        flex: 1,
        color: '#535353',
        fontFamily: 'Janna New R',
    },
    amountTotalGraph: {        
        width: width - 60,
        marginLeft: 15,
        marginRight: 15,
        height: 15,
        backgroundColor: '#e8e8e8',
        marginTop: 10,
    },
    amountPaidGraph: {
        
        height: 15,
        backgroundColor: '#06aebb',
        alignSelf: 'flex-end',
    },
    country: {
        flex:1,
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 20,
    },
    countryTitle: {
        fontSize: 12,
        color: '#535353',
        lineHeight: 25,
        fontFamily: 'Janna New R',
    },
    countryName: {
        color: '#535353',
        fontSize: 16,
        lineHeight: 25,
        marginLeft: 5,
        marginRight: 5,
        fontFamily: 'Janna New R',
    },
    flag: {
        flex: 1,
    },
    causeTotal: {
        flex:1,
        flexDirection: 'row',
    },
    causeTotalText: {
        flex: 1,
        color: '#fe345a',
        alignSelf: 'flex-end', 
        fontFamily: 'Janna New R',
    },
    causeTotalIcon: {
        alignSelf: 'flex-start', 
        height: 50,
        resizeMode: 'contain',
    },
});

module.exports = ProjectDetails;