'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import { height, width, text, } from '../utilities/constants'
import Radio, {RadioButton} from 'react-native-simple-radio-button'

let QCLoading =  require('../../qcLoading');
let PaymentMobileVerify = require('./paymentMobileVerify');
let QCButton = require('../sharedControls/qcButton');

//let CouponList = require('./couponList');
let isArabic = true;

class PaymentMobile extends Component {

    constructor(props) {
       super(props);
       this.user = null
       this.currentNumber = '';
       this.state = {
            phoneNumber: '',
            isLoading: true,
            selectedNumberIndex: 0,
            typedNumber: '',
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    componentWillUnmount() {
    }
    fetchData() {
        let self = this;
        this.user =  this.props.currentUser;
        this.currentNumber = this.user.Phone;
        self.setState({
            phoneNumber: this.currentNumber,
            isLoading: false,
        });
    }
    pay() {
        let number = this.state.phoneNumber;
        this.sendVerfication(number);

        /*let cards = isArabic ? 'كروت الخير' : 'Charity Cards';
        this.props.navigator.push({
            id: 'CouponList',
            title: cards,
            component: CouponList,
            passProps: {item: item, isArabic: isArabic, },
        });*/
    }
    sendVerfication(mobile) {
        if(mobile == '') {
            alert('من فضلك ادخل رقم الجوال');
        }
        else {
            let self = this;
            let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/SendMobileVerification?Mobile=' 
                              + mobile;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                
                if(responseData.Result == true) {
                    this.props.navigator.push({
                        id: 'PaymentMobileVerify',
                        title: 'كود التفعيل',
                        component: PaymentMobileVerify,
                        passProps: { 
                            type: this.props.type, 
                            amount: this.props.amount, 
                            payFor: this.props.payFor,
                            mobile: mobile,
                            verification: responseData.ActivationCode,
                            isArabic: isArabic, 
                            donor: self.user,
                        },
                    });
                }
            })
            .done();
        }
    }

    phoneChanged(value) {  
        //alert(value)
        let mobile = (value == 0 ? this.currentNumber : this.state.typedNumber); 
        this.setState({phoneNumber: mobile, selectedNumberIndex: value, isLoading: false,}); 
    }
    
    render() {
        if(this.state.isLoading) {   
            return (
                <View style={styles.container}>
                    <QCLoading />
                </View>
            );
        }

        let payText = isArabic? 'إكمال الدفع':'Continue';
        let option1 = 'الدفع بواسطة الجوال رقم ' + this.currentNumber, 
            option2 = 'الدفع برقم جوال آخر';
        var radio_props = [
          {label: option1, value: 0 },
          {label: option2, value: 1 },
        ];
        var radio_props2 = [
          {label: '', value: (this.state.selectedNumberIndex == 1 ? 1 : -1) }
        ];

        let inputText = null;
        if(this.state.selectedNumberIndex == 1) {
            inputText = (
                <View style={styles.phoneTextWrapper}>
                    <TextInput autoFocus={true} maxLength={15}
                                keyboardType={'numeric'} 
                                placeholder={'رقم الهاتف'}
                                style={[styles.inputText,]}
                                placeholderTextColor={'#8a8a8a'}
                                onChangeText={(text) => this.setState({typedNumber: text, phoneNumber: text,})}
                                value={this.state.typedNumber} />
                </View>
            );
        }
/*
<View style={{flexDirection: 'row', width: width - 30,}}>
                            <View style={{width: width - 70,}}>
                                <Text style={[text]}>{option2}</Text>
                            </View>
                            <Radio
                              radio_props={radio_props2}
                              //isSelected={(this.state.selectedNumberIndex == 1)}
                              initial={1}
                              buttonColor={'#50C900'}
                              onPress={(value) => {this.phoneChanged(value)}} />
                        </View>
*/
        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={[styles.title, text]}>اختار رقم الجوال</Text>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.selectWrapper}>
                        
                            <Radio
                              radio_props={radio_props} 
                              //isSelected={(this.state.selectedNumberIndex == 0)}
                              initial={0}
                              buttonColor={'#50C900'}
                              style={{flex: 1, alignItems: 'flex-end'}}
                              onPress={(value) => {this.phoneChanged(value)}} />
                        
                    </View>
                    {inputText}
                    <View style={{marginTop: 20, alignItems: 'flex-start', width: width - 30,}}>  
                        <QCButton text={payText} color='red' width={120} isArabic={isArabic} onPressed={() => this.pay()} />
                    </View>
                </View>
            </View>
        );
    }
}

var itemWidth = (width - 35) / 2;
var styles = StyleSheet.create({    
    container: {
        flex: 1,
        marginBottom:55,
        justifyContent: 'flex-start',
    },
    titleWrapper: {
        width: width,
        height: 50,
        alignItems: 'center', 
        justifyContent:'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        width: width,
        textAlign: 'right',
        marginRight: 15,
    },
    bodyWrapper: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent:'flex-start',
        padding: 15,
    },
    selectWrapper: {
        width: width,
        padding: 15,
        //alignItems:'flex-end',
    },
    phoneTextWrapper: {
        //flexDirection: 'row',
        width: width,
        height: 50,
        backgroundColor: 'white',
        marginBottom:10,
    },
    inputText: {
        borderWidth: 0,
        width: width - 5,
        fontFamily: 'Janna New R',
    },
    list: {
        flex: 1,
        width: width - 20,
        marginTop: 0,
        marginLeft: 10,
        marginRight: 10,
    },
    listRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        width: width - 20,
    },
    iconTouch: {
        marginLeft: 2,
        marginRight: 2,/**/
        //width:width / 4,
    },
    item: {
        width: itemWidth,
        height: itemWidth + 50,
        marginBottom: 8,
    },
    cardTitleWrapper: {
        flex: 1,
        width: itemWidth,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center', 
        justifyContent:'center',
        paddingRight: 10,

    },
    cardTitle: {
        flexWrap: 'nowrap',
        width: itemWidth,
        lineHeight: 35,
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
        fontFamily: 'Janna New R',
    },
    cardImage: {
        width: itemWidth,
        height: itemWidth + 50,
        resizeMode: 'contain',
    },
});

module.exports = PaymentMobile;