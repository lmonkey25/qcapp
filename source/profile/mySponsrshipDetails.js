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

let QCLoading =  require('../../qcLoading');

let isArabic = true;

class MySponsrshipDetails extends Component {

    constructor(props) {
       super(props);
        this.state = {
            isLoading: true,
            itemDetails: {},
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    fetchData() {
        let item = this.props.item;
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetSponsoredDetails?SponsoredId=' 
                            + item.ItemId + '&LanguageId=' 
                            + (isArabic ? '1' : '2');

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {

            self.setState({
                itemDetails: responseData,
                isLoading: false,
            });
        })
        .done();
    }
    componentWillUnmount() {
        //ScreenEventEmitter.removeChangeScreenListener(this.onChangeScreen.bind(this));
    }
    onChangeScreen() {
        var currentScreen = ScreenEventEmitter.CurrentScreen();
        this.props.navigator.push(currentScreen);
    }
    
    render() {

        let item = this.props.item;
        let itemDetails = this.state.itemDetails;
        let reports = itemDetails.Reports;
        let sponsored = itemDetails.Sponsored;

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
            let applicationText = isArabic? 'استمارة المكفول':'Sponsored Application';
            let myNameText = isArabic? 'اسمي هو':'My Name is';
            let sponsershipDateText = isArabic? 'تاريخ الكفالة':'Sponsership Date';
            let sponsershipTypeText = isArabic? 'نوع الكفالة':'Sponsership Type';
            let sponseredGenderText = isArabic? 'نوع المكفول':'Sponsered Gender';
            let sponseredDOBText = isArabic? 'تاريخ الميلاد':'Date of Birth';
            let dOBMSGText = isArabic? ' يوم لكي أبلغ من العمر {0} عاماً':' days to be {0} years old';
            let sponsershipAmountText = isArabic? 'قيمة الكفالة':'Sponsership Amount';
            let currencyText = isArabic? 'ر.ق':'Q.R';

            let countryText = isArabic? 'بلدي':'My Country';
            let languageText = isArabic? 'لغتي':'My Language';
            let englishText = isArabic? 'الإنجليزية':'English';
            let reportText = isArabic? 'تقرير':'Report';

            let title = isArabic ? item.TypeNameAr : item.TypeNameEn;
            let category = sponsored.CategoryName;
            let category2 = sponsored.Category2Name;
            let dob = sponsored.BirthDate;
            let sponsershipDate = sponsored.SponsorshipBeginDate;
            let sponsershipType = sponsored.Category3Name;
            let country = isArabic ? item.ContryNameAr : item.ContryNameEn;

            let dOBMSG = sponsored.DaysToBirthday && sponsored.DaysToBirthday > 0 ? 
                            sponsored.DaysToBirthday + dOBMSGText.replace('{0}', sponsored.Age + 1) : null;

            if(dOBMSG != null) {
                dOBMSG = (
                    <View style={styles.innerRow}>
                        <Text numberOfLines={2} style={[styles.category, {flex: 1, marginTop: 15,}]}>{dOBMSG}</Text>
                    </View>
                );
            }
            let reportsRows = [];
            
            if(reports && reports != null && reports.length > 0) {
                for(var i = 0; i < reports.length; i++) {
                    reportsRows.push(
                        <View key={i} style={[styles.section, {flexDirection: 'row', }, i == 0 && {marginTop: 7,}]}>
                            <TouchableHighlight style={[styles.iconPDFTouch,{flex: 1,}]} onPress={() => {return null}} 
                                                underlayColor='transparent'>
                                <Image style={styles.pdf} source={require('image!pdf')} />
                            </TouchableHighlight>
                            <Text style={[styles.text, {flex: 1, marginRight: 15,}]}>{reportText} {reports[i].ReportYear}</Text>
                        </View>
                    );
                }
            }5

            let flag = 'flg_' + item.ContryId;
            flag = {uri: flag };


            let img = item.Image;
            currentTabContent = (
                <ScrollView style={{flex: 1,}} contentContainerStyle={[styles.contentContainer]}>
                    <View style={[styles.section, styles.imageSection]}>
                        <Image source={{uri: img}} style={styles.causeImage} />
                        <View style={styles.icons}>
                            <TouchableHighlight 
                                    style={[styles.iconTouch,]}
                                    onPress={() => {return null}}
                                    underlayColor={'transparent'}>
                                <View style={styles.applictionWrapper}>
                                    <Image source={require('image!estemara')} style={[styles.icon,]} />
                                    <Text numberOfLines={2} style={styles.applicationText}>{applicationText}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.details}>
                            <Text style={[styles.mainTitle, styles.centeredText]}>{myNameText} {title}</Text>
                            <Text style={[styles.category, styles.centeredText]}>{sponsershipDateText} {sponsershipDate}</Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column', marginRight: 10, width: (width - 10)/2}}>
                            <View style={styles.smallSection}>
                                <Text style={styles.title}>{sponsershipAmountText}</Text>                                
                                <View style={styles.innerRow}>
                                    <Image source={require('image!amount_icon')} style={{height: 22, width: 22, resizeMode: 'contain'}} />
                                    <Text style={styles.smallSectionDetails}>{sponsored.SponsorshipCost}</Text>
                                </View>
                            </View>
                            <View style={[styles.smallSection, {marginTop: 10,}]}>
                                <Text style={styles.title}>{sponseredDOBText}</Text>                                
                                <View style={styles.innerRow}>
                                    <Text style={styles.smallSectionDetails}>{sponsored.BirthDate}</Text>
                                </View>                            
                                {dOBMSG}
                            </View>
                            <View style={[styles.smallSection, {marginTop: 10,}]}>
                                <View style={styles.innerRow}>
                                    <Text style={[styles.title, {flex: 1, }]}>{languageText}</Text>
                                </View>                       
                                <View style={styles.innerRow}>
                                    <Image source={require('image!place_btn')} style={{height: 22, width: 22, resizeMode: 'contain'}} />
                                    <Text style={[styles.smallSectionDetails, {flex: 1, }]}>{englishText}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{flexDirection: 'column', width: (width - 20)/2}}>
                            <View style={styles.smallSection}>
                                <View style={styles.innerRow}>
                                    <Text style={[styles.title, {flex: 1, marginRight: 15,}]}>{sponsershipTypeText}</Text>
                                </View>
                                <View style={styles.innerRow}>
                                    <Text style={[styles.smallSectionDetails, {marginRight: 15, marginBottom: 10,}]}>{sponsershipType}</Text>
                                </View>                              
                                <View style={styles.innerRow}>
                                    <Text style={[styles.category, {flex: 1, marginRight: 15,}]}>{category}</Text>
                                </View>                             
                                <View style={styles.innerRow}>
                                    <Text style={[styles.category, {flex: 1, marginRight: 15,}]}>{category2}</Text>
                                </View>
                            </View>
                            <View style={[styles.smallSection, {marginTop: 10,}]}>
                                <View style={styles.innerRow}>
                                    <Text style={[styles.title, {flex: 1, marginRight: 15,}]}>{sponseredGenderText}</Text>  
                                </View>                              
                                <View style={styles.innerRow}>
                                    <Image source={require('image!male')} style={{height: 22, width: 22, marginRight: 15, resizeMode: 'contain'}} />
                                    <Text style={[styles.smallSectionDetails, {flex: 1, marginRight: 15,}]}>{sponsored.Sex}</Text>
                                </View>
                            </View>
                            <View style={[styles.smallSection, {marginTop: 10,}]}>
                                <View style={styles.innerRow}>
                                    <Text style={[styles.title, {flex: 1, marginRight: 15,}]}>{countryText}</Text>
                                </View>                       
                                <View style={styles.innerRow}>
                                    <Image source={flag} style={{height: 15, width: 22, resizeMode: 'cover'}} />
                                    <Text style={[styles.smallSectionDetails, {flex: 1, marginRight: 15,}]}>{country}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {reportsRows}
{/*
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
                                <Image source={require('image!flg_1')} style={{height: 15, width: 22, resizeMode: 'cover'}} />
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
                    </View>*/}
                </ScrollView>
            );
        }
        
        return (
            <View style={styles.container}>
                {loading}
                {currentTabContent}
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
        width: (width - 10) / 2,
        borderRadius: 3,
        backgroundColor: 'white',
        padding: 15,
    },
    innerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start', 
        justifyContent: 'flex-start', 
    },
    smallSectionText: {  
        flex: 1,      
        textAlign: 'right', 
        fontWeight: 'bold',
        color: '#535353',
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
        fontFamily: 'Janna New R',
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
    applictionWrapper: {
        width: 110, 
        height: 110,
        borderRadius: 55,
        backgroundColor: '#fe345a',
        alignItems: 'center', 
        justifyContent:'center',
    },
    icon: {
        resizeMode: 'contain',
        width: 55,
        height: 55,
    },
    applicationText: {
        color: 'white',
        textAlign: 'center',
        width: 60,
        fontFamily: 'Janna New R',
    },
    donateIcon: {
        //backgroundColor: 'gray',
    },
    iconContainer: {
        flex:1,
    },
    details: {
        width: width - 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainTitle: {
        fontSize: 16,
        color: '#535353',
        lineHeight: 30,
        marginBottom: 10,
        fontFamily: 'Janna New R',
    },
    title: {
        fontSize: 13,
        textAlign: 'right', 
        color: '#535353',
        marginBottom: 10,
        fontFamily: 'Janna New R',
    },
    category: {
        fontSize: 12,
        lineHeight: 25,
        color: '#06aebb',
        marginBottom: 4,
        textAlign: 'right', 
        fontFamily: 'Janna New R',
    },
    centeredText: {
        textAlign: 'center',
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
    pdf: {
        height: 50,
        resizeMode: 'contain',
    },
    text: {
        fontFamily: 'Janna New R',
    },
});

module.exports = MySponsrshipDetails;