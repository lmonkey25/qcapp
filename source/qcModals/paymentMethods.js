'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

var Modal = require('react-native-modalbox');
import { height, width, text, } from '../utilities/constants'

let CollectorRequest = require('../collectors/collectorRequest');
let PaymentMobile = require('../payments/paymentMobile');
let PaymentVisa = require('../payments/paymentVisa');

let isArabic = true;

class PaymentMethods extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,

            inProcess: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    close() {
        this.refs.modal3.close();
    }
    onClose() {
        if(this.props.onClosed) {
            this.props.onClosed();
        }
    }
    onOpen() {

        if(this.props.item) {
            if(this.props.onOpened) {
                this.props.onOpened();
            }
        }
    }
    
    pay(methodId) {
      	
        let amount = 0, ids = [];
        let items = this.props.item;
        items.map((item, index) => {
            amount += item.Amount;
            ids.push(item.BasketId);
        });
        //alert(amount)
        let range = [
            1,2,3,4,5,6,7,8,9,
            10,15,20,25,30,
            40,50,60,70,80,90,100,
            150,200,250,300,
            400,500,600,700,750,800,900,1000
        ];
//alert(amount)
        if(methodId == 2 && range.indexOf(amount) < 0) {
            alert("مجموع مبلغ تبرعات الرسائل النصية غير متطابق مع أي من الفئات المتاحة للتبرع. الفئات المتاحة \r\n" + range.toString());
        }
        else {

            if(this.props.onPressed){
                this.props.onPressed();
            }
            
            let title, id, toGoComponent;
            if(methodId == 1) {
                id = 'Collectors';
                title =  isArabic ? 'المحصل المنزلي' : 'Collector';
                //toGoComponent = CollectorRequest;
            }
            else if(methodId == 2) {
                id = 'PaymentMobile';
                title =  isArabic ? 'االدفع بالجوال' : 'Pay By Mobile';
                toGoComponent = PaymentMobile;
            }
            else {
                id = 'PaymentVisa';
                title =  isArabic ? 'االدفع بالبطاقة الإئتمانية' : 'Pay By Credit Card';
                toGoComponent = PaymentVisa;
            }
            this.close();
            this.props.navigator.push({
                id: id,
                title: title,
                //component: toGoComponent,
                passProps: { 
                    type: this.props.type, 
                    amount: amount, 
                    payFor: ids,
                    isArabic: isArabic, 
                },
            });
        }
  	}
  
    render() {

      	return (
            <Modal  isOpen={this.props.isOpen} position={"bottom"} style={[styles.modal, styles.modal1]} ref={"modal3"} 
                    onClosed={() => this.onClose()} 
                    onOpened={() => this.onOpen()} 
                    onClosingState={() => this.onClosingState()}>
                <View style={styles.modalContainer}>
                    <View style={styles.title}>
                        <Text style={[styles.titleText, text]}>اختر طريقة الدفع</Text>
                    </View>
                    <View style={styles.methods}>
                        <TouchableHighlight 
                            style={[styles.button,]}
                            onPress={() => this.pay(1)}
                            underlayColor={'transparent'}>
                            <View style={styles.iconWrapper}>
                                <Image source={require('image!collector')} style={styles.icon} />
                                <Text style={[styles.iconText, text]}>المحصل المنزلي</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[styles.button,]}
                            onPress={() => this.pay(2)}
                            underlayColor={'transparent'}>
                            <View style={styles.iconWrapper}>
                                <Image source={require('image!mobile')} style={styles.icon} />
                                <Text style={[styles.iconText, text]}>الجوال</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[styles.button,]}
                            onPress={() => this.pay(3)}
                            underlayColor={'transparent'}>
                            <View style={styles.iconWrapper}>
                                <Image source={require('image!visa')} style={styles.icon} />
                                <Text style={[styles.iconText, text]}>البطاقة الإئتمانية</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
      	);
    }
}


var styles = StyleSheet.create({
     modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        width: width, 
        height: height/2.5,
        backgroundColor: "white",
    },
    modalContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        width: width,
        height: 60,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    titleText: {
        fontSize: 15,
        textAlign: 'center',
    },
    methods: {
        flexDirection: 'row',
        width: width,
        height: (height/3) - 60,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    button: {
        width: width/3, 
        height: (height/3) - 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: width/3, 
        height: (height/3) - 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        resizeMode: 'cover', 
        marginLeft: 5,
        marginRight: 5, 
        width: 40,
        height: 40,     
    },
    iconText: {
        width: width/3, 
        fontSize: 13,
        marginTop: 5,
        textAlign: 'center',
    },
});

module.exports = PaymentMethods; /* making it available for use by other files */