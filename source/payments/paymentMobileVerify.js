'use strict';
 
import React, { Component } from 'react';
import  {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants'

let QCLoading =  require('../../qcLoading');
let QCButton = require('../sharedControls/qcButton');

let isArabic = true;

class PaymentMobileVerify extends Component {

    constructor(props) {
       super(props);
       this.state = {
            isLoading: false,
            typedCode: '',
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        //this.fetchData();
    }
    componentWillUnmount() {
    }
    cancel() {

        this.props.navigator.replace({id: 'QCHome', title: 'Welcome',})
        /*let cards = isArabic ? 'كروت الخير' : 'Charity Cards';*/
        this.props.navigator.push({
            id: 'MyBasket',
            title: isArabic ? 'السلة' : 'Basket',
            //component: CouponList,
            passProps: {isArabic: isArabic, },
        });
    }
    /*fetchData() {
        let self = this;
        this.currentNumber = '33909713';
        self.setState({
            phoneNumber: this.currentNumber,
            isLoading: false,
        });
    }*/
    pay() {
        let number = this.props.mobile;
        let verification = this.props.verification;
        let type = this.props.type;
        let amount = this.props.amount;
        let payFor = this.props.payFor;
        let donor = this.props.donor;
        this.payByMobile(number, donor, payFor, verification);

    }
    payByMobile(mobile, donor, payFor, verification) {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/PayMobile?DonorId=' + donor.DonorId
                            + '&MobileNumber=' + mobile + '&DonationIds=' + payFor 
                            + '&ActivationCode=' + verification + '&IsOldMobile=false';
        //alert(REQUEST_URL);
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            
            if(responseData.Result == true) {
                alert('شكرا لقد تم الدفع بنجاح');
                this.props.navigator.replace({id: 'MyBasket', title: isArabic ? 'السلة' : 'Basket',})
                this.props.navigator.push({
                    id: 'QCHome',
                    title: 'Welcome',
                });
            }
        })
        .done();
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

        let payText = isArabic? 'تأكيد الدفع':'Confirm';
        let cancelText = isArabic? 'إلغاء الدفع':'Cancel';


        return (
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={[styles.title, text]}>من فضلك ادخل كود التفعيل المرسل لك</Text>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.phoneTextWrapper}>
                        <TextInput autoFocus={true} maxLength={15}
                                    keyboardType={'numeric'} 
                                    placeholder={'كود التفعيل'}
                                    style={[styles.inputText,]}
                                    placeholderTextColor={'#8a8a8a'}
                                    onChangeText={(text) => this.setState({typedCode: text, })}
                                    value={this.state.typedCode} />
                    </View>
                    <View style={styles.selectWrapper}>
                        <Text style={[{textAlign: 'right'}, text]}>{'لتأكيد التبرع بمبلغ'} {this.props.amount} {'ر.ق من فضلك اضغط على تأكيد الدفع'}</Text>
                    </View>
                    <View style={{marginTop: 20, alignItems: 'flex-start', width: width - 30, flexDirection: 'row'}}>  
                        <QCButton text={cancelText} color='blue' width={120} isArabic={isArabic} onPressed={() => this.cancel()} />
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

module.exports = PaymentMobileVerify;