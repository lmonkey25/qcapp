'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    TouchableHighlight,
} from 'react-native';

var Modal = require('react-native-modalbox');

import { height, width, text } from '../utilities/constants'

let PaymentMethodsModal = require('./paymentMethods');

let isArabic = true;

class AllLatePaymentsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            paymentAmount: 0,
            active: null,
            payNowModalIsOpen: false,
            payAll: null,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    openModal1(id) {
        this.refs.modal4.open();
    }
    onClose() {
        if(this.props.onClosed) {
            this.props.onClosed();
        }
    }
    onOpen() {
        if(this.props.onOpened) {
            this.props.onOpened();
        }
    }
    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    requestStarted() {
        if(this.props.onStartRequest) {
            this.props.onStartRequest();
        }
    }
    requestEnd() {
        if(this.props.onEndRequest) {
            this.props.onEndRequest();
        }
    }

    openPayNowModal(amount, payAll) {
        if(amount > 0) {
            this.setState({
                payAll: payAll,
                payNowModalIsOpen: true,
            });
        }
    }
    payNowModalClosed() {
        this.setState({ 
            payNowModalIsOpen: false,
        });
    }


    selectCheckedChanged(isChecked, amount) {
        let counterSeed = isChecked ? 1 : -1;
        let paymentAmount = this.state.paymentAmount;
        paymentAmount += amount * counterSeed;

        this.setState({ 
            paymentAmount: paymentAmount,
        });
    }

    payNow(type) {
        if(type == 1 && this.props.item.AllAmount > 0) {
            this.refs.modal4.close();
            this.openPayNowModal(this.props.item.AllAmount, true);
            if(this.props.onPayNowClicked) {
                this.props.onPayNowClicked(this.props.item.AllAmount);
            }
        }
        else if(this.props.item.LastMonthAmount > 0) {
            this.refs.modal4.close();
            this.openPayNowModal(this.props.item.LastMonthAmount, false);
            if(this.props.onPayNowClicked) {
                this.props.onPayNowClicked(this.props.item.LastMonthAmount);
            }
        }
        else {
            alert('You don\'t have overdue');
        }
    }

    render() {

        let totalAmount = 0;
        let delaiedMonths = [];

        let item =  this.props.item;
        let modalCtrl = null;

        if(true) {

            if(this.state.payNowModalIsOpen) {
                modalCtrl = (
                    <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                        onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                        onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                        item={this.props.item}  amount={this.state.payAll != null && this.state.payAll ? this.props.item.AllAmount : this.props.item.LastMonthAmount} type='latePayments' />
                );
            }
            else {

                let allDelay = (isArabic ? 'إدفع كل المتأخرات' : 'Pay All Overdue');
                let lastMonthDelay = (isArabic ? 'دفع متأخرات آخر شهر' : 'Pay Last Month Overdue');


                modalCtrl = (
                    <Modal  isOpen={this.props.isOpen} position={"bottom"} style={[styles.modal, styles.modal1]} ref={"modal4"} 
                            onClosed={() => this.onClose()} 
                            onOpened={() => this.onOpen()} 
                            onClosingState={() => this.onClosingState()}>
                        <View style={[styles.container,]}>
                            <View style={[styles.innerRow,]}>
                                <TouchableHighlight onPress={() => {this.payNow(1)}} style={styles.roundBtn}>
                                    <Image source={require('image!all')} style={[{width: 25, height: 25, resizeMode: 'contain' },]} />
                                </TouchableHighlight>
                                <Text style={[{marginLeft: 10,backgroundColor: '#333333', color: 'white', fontSize:10, padding: 5, textAlign: 'center'}, text,]}>{allDelay}</Text>
                            </View>
                            <View style={[styles.innerRow,]}>
                                <TouchableHighlight onPress={() => this.payNow(2)} style={styles.roundBtn}>
                                    <Image source={require('image!one_month')} style={[{width: 25, height: 25, resizeMode: 'contain'},]} />
                                </TouchableHighlight>
                                <Text style={[{marginLeft: 10,backgroundColor: '#333333', color: 'white', fontSize:10, padding: 5, textAlign: 'center'}, text,]}>{lastMonthDelay}</Text>
                                
                            </View>
                        </View>
                    </Modal>
                );
            }          
        }
        else {
            return null;
        }

      	return (
            modalCtrl
      	);
    }
}


var styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    modal1: {
        width: width, 
        height: 250, 
        backgroundColor: "transparent",
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
    },
    roundBtn: {
        backgroundColor: '#06aebb',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerRow: {
        width: (width *.7) - 40, 
        height: 50, 
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    datesRow: {
        height: 30,
        width: (width *.7) - 40,
        justifyContent: 'flex-end',
    },
    paidAmount: {
        height: 30, 
        width:120,
        marginRight:20,
        marginLeft:20,
        paddingRight:15,
        paddingLeft:15, 
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color:'#535353',
        textAlign: 'right',

    },
    selectContainer: {
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        color:'#FFF8DC',
        textAlign: 'center',
    },
    modalButton: {
        marginTop: 30,
        color:'#FFF8DC'
    },
    icon:{
        width:30,
        height:30,
    },
    toolbar:{ 
        width: (width *.7) - 40, 
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center'
    },
    image: {
        flex: 1
    },
});

module.exports = AllLatePaymentsModal; /* making it available for use by other files */