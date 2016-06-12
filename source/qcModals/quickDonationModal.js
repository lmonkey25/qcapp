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

import { height, width, text, } from '../utilities/constants'
let QCButton = require('../sharedControls/qcButton');
let PaymentMethodsModal = require('./paymentMethods');

let isArabic = true;

//let fixedPrice = 0;
class QuickDonationModal extends Component {

    constructor(props) {
        super(props);
        this.fixedPrice = 0;
        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            textValue: '',
            active: null,
            payNowModalIsOpen: false,
            BasketItems: [],
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        //this.fixedPrice = (this.props.item) ? this.props.item.FixedPrice : 0;
    }
    openModal() {
        this.refs.modal2.open();
    }
    closeModal() {
        this.refs.modal2.close();
    }
    onClose() {
        this.setState({textValue: ''})
        if(this.props.onClosed) {
            this.props.onClosed();
        }
    }
    onOpen() {
        if(this.fixedPrice == 0 && this.props.item && this.props.item.FixedPrice > 0) {
            this.fixedPrice = this.props.item.FixedPrice;
            this.setState({textValue: this.fixedPrice}); 
            //alert('opened')
        }
        
        if(this.props.onOpened) {
            this.props.onOpened();
        }
    }
    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }

    openPayNowModal(amount) {
        if(amount > 0) {
            this.setState({
                payNowModalIsOpen: true,
            });
        }
    }
    payNowModalClosed() {
        this.setState({ 
            payNowModalIsOpen: false,
        });
    }

    onHighlight() {
        this.setState({active: true});
    }

    onUnhighlight() {
        this.setState({active: false});
    }
    ADDONE(){  
        var va = parseInt(this.state.textValue);
        
        let seed = 1;
        if(this.fixedPrice && this.fixedPrice != null && this.fixedPrice > 0) {
            if(this.props.item.AmountRemaining == 0 && this.props.item.PaidAmount > 0) {
                return;
            }
            seed = this.fixedPrice;
            if(va < this.fixedPrice) {
                va = this.fixedPrice;
            }
        }

        if(va < 0) {
            va = 0;
        }

        if(!va || va == '' || isNaN(va)) {
            return;
        }
        va += seed;
        if(this.props.item.AmountRemaining > 0 && va > this.props.item.AmountRemaining) {
            va = this.props.item.AmountRemaining;
        }
        this.setState({textValue:va.toString()})
        return;
    }

    MINONE(){
        var va = parseInt(this.state.textValue);

        let seed = 1;
        if(this.fixedPrice && this.fixedPrice != null && this.fixedPrice > 0) {
            if((this.props.item.AmountRemaining == 0 && this.props.item.PaidAmount > 0) || va == this.fixedPrice) {
                return;
            }
            seed = this.fixedPrice;
        }

        if(va < 0) {
            va = 0;
            this.setState({textValue:va.toString()});
            return;
        }

        if(!va || va == '' || isNaN(va)) {
            return;
        }

        va -= seed;
        if(this.fixedPrice && this.fixedPrice != null && this.fixedPrice > 0 && va < this.fixedPrice) {
            va = this.fixedPrice;
        }
        this.setState({textValue:va.toString()})
        return;
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
    validate() {
        if(this.state.textValue == '' || isNaN(this.state.textValue) || this.state.textValue <= 0) {
            return false;
        }
        else {
            return true;
        }
    }

    payNow() {
        //this.refs.modal2.close();
        this.addToBasket(true);

        if(this.props.onPayNowClicked) {
            this.props.onPayNowClicked(this.state.textValue);
        }

    }
    addToBasket(payNow) {
        if(this.validate() && this.props.item != null && this.props.currentUser != null) {
        //this.setState({ isLoading: true, });
        //alert(this.props.item.CampaignId)
            this.refs.modal2.close();
            this.requestStarted();
            fetch('http://servicestest.qcharity.org/api/Basket/Insert', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ItemId: this.props.item.ItemId,
                    PaidThroughId: this.props.item.PaidThroughId,
                    CountryId : this.props.item.CountryId,
                    Amount: this.state.textValue,
                    AccountTypeId: this.props.item.AccountTypeId,
                    IsNew: this.props.item.IsNew,
                    CampaignId: this.props.item.CampaignId,
                    DonorId: this.props.currentUser.DonorId,
                    Count: 1,
                    ItemTitle: '',
                    ItemDiscription: '',
                    AmountRemaining: this.props.item.AmountRemaining,
                    MobileDBId: this.props.item.MobileDBId,
                }),
            })
            .then((response) => response.json()) 
            .then((responseData) => {
                this.requestEnd();//alert(responseData.Result)
                if(JSON.stringify(responseData.Result) != 'false') {
                    let val = parseInt(this.state.textValue);
                    let newItem = {BasketId: responseData.BasketIds, Amount: val};
                    let basketItems =  this.state.BasketItems;
                    basketItems.push(newItem);
                    this.setState({BasketItems: basketItems, textValue: ''});
                    //alert(responseData.BasketIds)
                    //this.setState({ isLoading: false, });
                    //alert('Item added to basket successfully');

                    if(payNow) {
                        this.openPayNowModal(newItem.Amount);
                    }
                    else {alert(isArabic ? 'لقد تمت الإضافة إلى السلة بنجاح' : 'Item added to basket successfully');}
                }
                else {
                    //this.setState({ isLoading: false, });
                    alert('An error occured. Message: ' + JSON.stringify(responseData.Message)); 
                }
            })
            .catch((error) => {
                this.requestEnd();
                //this.setState({ isLoading: false, });
                alert(error); 
            }).done();
        }
        else {
            alert(isArabic ? 'من فضلك أدخل رقم صحيح' : 'Please type a valid number');
        }
    }

    render() {
        
        var icon = this.props.active ? require('image!plus_press') : require('image!plus_normal');
        var icon2 = this.props.active ? require('image!minus_press') : require('image!minus_normal');

        let currencyText = isArabic ? 'ر.ق' : 'QAR';
        let donateNowText = isArabic ? 'تبرع الآن' : 'Donate Now';
        let addToBasketText = isArabic ? 'إضافة للسلة' : 'Add To Basket';
        let title;
        let modalCtrl = null;
        
        //alert(this.fixedPrice);
        if(this.props.item != null && this.props.item.AmountRemaining > 0) {
            title = (isArabic ? 'المبلغ المتبقي ' : 'Amount Remainig ') + this.props.item.AmountRemaining + ' ' + currencyText;
        }
        else {
            title = isArabic ? 'التبرع السريع' : 'Donate Now';
        }
        if(this.state.payNowModalIsOpen) {
            modalCtrl = (
                <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                    onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                    onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                    item={this.state.BasketItems} type='latePayments' />
            );
        }
        else {

            let valueCtrl = null, itemsCounter = null;
            if(this.fixedPrice && this.fixedPrice != null && this.fixedPrice > 0) {
                valueCtrl = (
                    <View style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 1,width:120,marginRight:20,
                                    marginLeft:20,paddingRight:15,paddingLeft:15, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={[{textAlign: 'center', width:120, }, text]}>{this.state.textValue}</Text>
                    </View>
                );
                let counterDesc = null;
                if(this.props.item && this.fixedPrice > 0) {
                    if(this.props.item.PaidThroughId == 1) {
                        counterDesc = 'قيمة القسط الشهري للكفالة : ' + this.fixedPrice;
                    }
                    else {
                        counterDesc = 'إجمالي الدفع ل {0} وحدة';
                        counterDesc = counterDesc.replace('{0}', (parseInt(this.state.textValue) / this.fixedPrice));
                    }
                    itemsCounter = (
                        <View style={{width:(width *.7) - 40, paddingRight:5,paddingLeft:5, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={[{textAlign: 'center', width:(width *.7) - 50, }, text]}>{counterDesc}</Text>
                        </View>
                    );
                }
            }
            else {
                valueCtrl = (
                    <TextInput  style={{height: 40, borderWidth: 0, borderBottomColor: 'gray', borderBottomWidth: 1,width:120,marginRight:20,
                                    marginLeft:20,paddingRight:15,paddingLeft:15, textAlign: 'center'}}
                                    placeholder={currencyText}
                                    autoFocus={true} maxLength={6} 
                                    keyboardType='numeric'
                        onChangeText={(text) => this.setState({textValue:text})} value={this.state.textValue} />
                );
            }

            modalCtrl = (
                <Modal  isOpen={this.props.isOpen} position={"center"} style={[styles.modal, styles.modal1]} ref={"modal2"} 
                        onClosed={() => this.onClose()} 
                        onOpened={() => this.onOpen()} 
                        onClosingState={() => this.onClosingState()}>
                    <View style={[styles.container,]}>
                        <View style={[styles.innerContainer,]}>
                            <Text style={[{marginBottom:20,fontSize:18}, text, 
                                            this.props.item != null && this.props.item.AmountRemaining > 0 && { color: '#fe345a', fontSize:13, }]}>{title}</Text>
                   
                            <View style={styles.toolbar}>
                                <TouchableHighlight
                                    //onHideUnderlay={() => this.onUnhighlight()}
                                    onPress={() => this.ADDONE()}
                                    //onShowUnderlay={() => this.onHighlight()}
                                    style={[styles.button, {overflow: 'hidden' }]}
                                    underlayColor="transparent">
                                    <Image style={styles.icon} source={icon} /> 
                                </TouchableHighlight>

                                {valueCtrl}

                                <TouchableHighlight
                                    //onHideUnderlay={() => this.onUnhighlight()}
                                    onPress={() => this.MINONE()}
                                    //onShowUnderlay={() => this.onHighlight()}
                                    style={[styles.button, {overflow: 'hidden' }]}
                                    underlayColor="transparent">
                                    <Image style={styles.icon} source={icon2} /> 
                                </TouchableHighlight>

                            </View>
                            {itemsCounter}
                            <View style={styles.toolbar}>
                                <QCButton text={donateNowText} width={100} isArabic={isArabic} 
                                            onPressed={() => this.payNow()} color='red' />

                                <QCButton text={addToBasketText} width={100} isArabic={isArabic} 
                                            onPressed={() => this.addToBasket()} color="blue" />
                            </View>
                        </View>
                    </View>
                </Modal>                
            );
        }

      	return (modalCtrl);
    }
}


var styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        width: width *.7, 
        height: 170, 
        backgroundColor: "white",
        borderRadius: 3,
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    width: (width *.7) - 40, 
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
    resizeMode: 'contain',
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

module.exports = QuickDonationModal; /* making it available for use by other files */