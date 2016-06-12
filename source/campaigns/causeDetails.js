'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,    
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants'

let isArabic = true;

let QCLoading =  require('../../qcLoading');
let QuickDonationModal = require('../qcModals/quickDonationModal');

class CauseDetails extends Component {
	constructor(props) {
        super(props);
        this.state = {
            isLoading: false, //true,
            dataSource: {},
            donateModalIsOpen: false,
        };
    }
    componentWillUnmount() {
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    fetchData() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/Donation/GetDonationDetails?itemId='
                            + this.props.item.ItemId + '&itemTypeId=3&isProject=false&countryId='
                            + this.props.item.ContryId + '&campaignId='
                            + (this.props.campaignId ? this.props.campaignId : 0) + '&tafjId=null&languageId=' + 
                            (isArabic ? '1' : '2');

                            //alert(REQUEST_URL)
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData && responseData!= null && this.props.onSearchParamsDefined) {
                this.props.onSearchParamsDefined(this.props.campaignId, 1);
            }
            self.setState({
                dataSource: responseData,
                isLoading: false,
            });
        })
        .done();
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
        
        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }

        let causeNameText = isArabic? 'اسم الحالة':'Cause Name';
        let countryText = isArabic? 'البلد':'Country';
        let paidText = isArabic? 'المدفوع':'Paid Amount';
        let remainText = isArabic? 'المتبقى':'Remaining Amount';
        let currencyText = isArabic? 'ر.ق':'Q.R';
        let totalText = isArabic? 'القيمة':'Value';
        let descriptionText = isArabic? 'الوصف':'Description';

        let item = this.props.item;// this.state.dataSource;
        let countryFlag = null;
        if(item.ContryId != 613) {
            let flag = 'flg_' + item.ContryId;
            flag = {uri: flag };

            countryFlag = <Image source={flag} style={styles.flag} />;
        }

        let unPaidWidth = 0;
        if(item.AmountPaid == 0) {
            unPaidWidth = width - 60;
        }
        else if(item.AmountRemaining > 0) {
            let percent = 100 - ((item.AmountPaid * 100) / (item.AmountPaid + item.AmountRemaining));
            unPaidWidth = (percent / 10) * 30;
        }

        let title = isArabic ? item.TitleAr : item.TitleEn;
        if(!title || title == null) {
            title = item.AccountName;
        }
        let category = this.state.dataSource.Level1;
        let category2 = this.state.dataSource.Level2;
        let country = isArabic ? item.ContryNameAr : item.ContryNameEn;
        
        let itemDetails = this.state.dataSource;
        let description = itemDetails.Description && itemDetails.Description.length > 0 ? itemDetails.Description : null;
        if(description && description != null) {
            description = (
                <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                    <Text style={[styles.detailsTitle, text]}>{descriptionText}</Text>
                    <Text style={[styles.detailsText, text]}>{description}</Text>
                </View>
            );
        }
        let goals = itemDetails.Goals && itemDetails.Goals.length > 0 ? itemDetails.Goals : null;
        
        if(goals && goals != null) {
            goals = (
                <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                    <Text style={[styles.detailsTitle, text]}>{goalsText}</Text>
                    <Text style={[styles.detailsText, text]}>{goals}</Text>
                </View>
            );
        }
        let reasons = itemDetails.Reasons && itemDetails.Reasons.length > 0 ? itemDetails.Reasons : null;
        if(reasons && reasons != null) {
            reasons = (
                <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                    <Text style={[styles.detailsTitle, text]}>{reasonsText}</Text>
                    <Text style={[styles.detailsText, text]}>{reasons}</Text>
                </View>
            );
        }
        let expectedResults = itemDetails.ExpectedResults && itemDetails.ExpectedResults.length > 0 ? itemDetails.ExpectedResults : null;
        if(expectedResults && expectedResults != null) {
            expectedResults = (
                <View style={[styles.amountTitle, {flexDirection: 'column',}]}>
                    <Text style={[styles.detailsTitle, text]}>{expectedResultsText}</Text>
                    <Text style={[styles.detailsText, text]}>{expectedResults}</Text>
                </View>
            );
        }


        let basketItem =  null;
        if(itemDetails != null) {
            basketItem = {
                ItemId: item.ItemId,
                PaidThroughId: itemDetails.PaidThroughId,
                CountryId : item.ContryId,
                AccountTypeId: itemDetails.AccountTypeId,
                IsNew: item.IsNew,
                CampaignId: (this.props.campaignId ? this.props.campaignId : 0),
                ItemTitle: itemDetails.AccountName,
                ItemDiscription: '',
                AmountRemaining: item.AmountRemaining,
                PaidAmount: itemDetails.AmountPaid,
                FixedPrice: itemDetails.DefaultPrice,
                MobileDBId: 0,
            };
        }

        return (
            <View style={styles.container}>
              	<ScrollView  style={{flex: 1,}} contentContainerStyle={[styles.contentContainer]}>
                    <View style={[styles.section, styles.imageSection]}>
                        <Image source={{uri: item.Image}} style={styles.causeImage} />
                        <View style={styles.icons}>
                            <TouchableHighlight 
                                    style={[styles.iconTouch,]}
                                    onPress={() => this.openDonationModal()}
                                    underlayColor={'transparent'}>
                                <Image source={require('image!donate_normal')} style={[styles.icon, styles.donateIcon]} />
                            </TouchableHighlight>
                        </View>
                        <View style={styles.details}>
                            <Text style={[styles.title, text]}>{title}</Text>
                            <Text style={[styles.category, text]}>{category}</Text>
                            <Text style={[styles.category, text]}>{category2}</Text>
                        </View>
                        <View style={styles.country}>
                            {countryFlag}
                            <Text style={[styles.countryName, text]}>ا{country}</Text>
                            <Text style={[styles.countryTitle, text]}>{countryText} </Text>
                        </View>
                    </View>

                    <View style={[styles.section, styles.amountSection]}>
                        <View style={[styles.innerRow, {width: (width - 60),}]}>
                            <Text style={[styles.smallSectionText, text]}>{totalText}</Text>
                        </View>
                        <View style={[styles.innerRow, {width: (width - 60), marginTop: 10,}]}>
                            <Image source={require('image!amount_icon')} style={{height: 40, width: 40, resizeMode: 'contain'}} />
                            <Text style={[styles.smallSectionDetails, styles.causeTotalText, text]}>{item.DefaultPrice} <Text style={[{fontSize:14,}, text]}>{currencyText}</Text></Text>
                        </View>
                    </View>

                    <View style={[styles.section, styles.detailsSection]}>
                        {description}
                        {goals}
                        {reasons}
                        {expectedResults}
                    </View>
          		</ScrollView>
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
    detailsTitle: {
        flex: 1,    
        textAlign: 'right', 
        fontSize: 16,
        color: '#535353',
        marginBottom: 5,
    },
    detailsText: {    
        flex: 1,
        textAlign: 'right', 
        fontSize: 14,
        color: '#535353',
        marginBottom: 20,
    },
    details: {
        margin: 20,
        width: width - 20,
        padding: 15,
        borderBottomWidth:1,
        borderBottomColor: '#e8e8e8',
    },
    title: {
        fontSize: 16,
        lineHeight: 25,
        color: '#535353',
        textAlign: 'right',
        marginBottom: 10,
    },
    category: {
        fontSize: 12,
        //lineHeight: 15,
        color: '#06aebb',
        textAlign: 'right',
        marginBottom: 4,
    },
    country: {
        width: width - 20,
        flexDirection: 'row',
        padding: 15,
    },
    countryTitle: {
        fontSize: 12,
        color: '#535353',
        lineHeight: 25,
    },
    countryName: {
        flex: 1,
        color: '#535353',
        fontSize: 16,
        lineHeight: 25,
        textAlign: 'right',
        marginLeft: 5,
        marginRight: 5,
    },
    flag: {
    	flex: 1,
    },
    amountSection: {
    	padding: 20,
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
	},
	paidText: {
		alignSelf: 'flex-start', 
		flex: 1,
	},
	amountTotalGraph: {
		flex: 1,
		height: 15,
		backgroundColor: '#e8e8e8',
		marginTop: 10,
	},
	amountPaidGraph: {
		width: width - 100,
		height: 15,
		backgroundColor: '#06aebb',
		alignSelf: 'flex-end',
	},  
    innerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start', 
    },
    smallSectionDetails: {  
        flex: 1,      
        textAlign: 'right',
        fontSize: 18,
        color: '#535353',
    },
    smallSectionText: {  
        flex: 1,      
        textAlign: 'right', 
        color: '#535353',
        fontFamily: 'Janna New R',
    },
	causeTotal: {
        flex:1,
        flexDirection: 'row',
	},
	causeTotalText: {
		flex: 1,
		color: '#fe345a',
    	alignSelf: 'flex-end', 
	},
	causeTotalIcon: {
    	alignSelf: 'flex-start', 
    	height: 50,
        resizeMode: 'contain',
	},
});
module.exports = CauseDetails;