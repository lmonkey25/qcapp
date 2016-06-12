'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableHighlight,
} from 'react-native';

var Modal = require('react-native-modalbox');
import { height, width, text, } from '../utilities/constants'
let QCButton = require('../sharedControls/qcButton');
let QCCheckbox = require('../sharedControls/qcCheckbox');
let QCCheckboxVIcon = require('../sharedControls/qcCheckboxVIcon');
let PaymentMethodsModal = require('./paymentMethods');

let isArabic = true;
//var inProcess = false;
var index = 0; 
let freez = false;
class LatePaymentsModal extends Component {

    constructor(props) {
        super(props);
        this.inProcess = false;
        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            paymentAmount: 0,
            active: null,
            payNowModalIsOpen: false,
            selectedItems: 0,
            BasketItems: [],
            PayItems: [],
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        index = 0; 
    }
    openModal1() {
        this.refs.modal4.open();
    }
    closeModal() {
        this.refs.modal4.close();
    }
    onClose() {
        if(!this.inProcess) {
            this.setState({selectedItems: 0, BasketItems: [],});
        }
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
        else {this.closeModal();}
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


    selectCheckedChanged(isChecked, amount) {
        let counterSeed = isChecked ? 1 : -1;
        freez = true;
        this.setState({selectedItems: this.state.selectedItems + counterSeed});

        freez = false;
        /*let paymentAmount = this.state.paymentAmount;
        paymentAmount += amount * counterSeed;

        this.setState({ 
            paymentAmount: paymentAmount,
        });*/
    }

    validate() {
        if(this.state.paymentAmount == '' || isNaN(this.state.paymentAmount) || this.state.paymentAmount <= 0) {
            return false;
        }
        else {
            return true;
        }
    }

    payNow() {
        //this.refs.modal4.close();
        this.addAllToBasket(true);

        /*if(this.props.onPayNowClicked) {
            this.props.onPayNowClicked(this.state.textValue);
        }*/
        
    }

    addAllToBasket(payNow) {
        if(this.state.selectedItems > 0) {
            
            this.inProcess = true;

            this.refs.modal4.close();
            this.requestStarted();

            let itm = this.props.item;
            let lst = [
                itm.ItemId, itm.PaidThroughId, itm.CountryId, itm.LatePayments.Amount, 
                itm.AccountTypeId, itm.IsNew, itm.CampaignId, 
                this.props.currentUser.DonorId,
                itm.AmountRemaining, itm.MobileDBId
            ]
            //alert('' + lst + '')
            for(index = 0;index < this.state.selectedItems; index++) {
                //alert(this.state.selectedItems)
                this.addToBasket(index, this, payNow);              
                
            }
        }
        else {alert('Please Select at least one month');}
    }

    addToBasket(index, self, payNow) {
        if(this.props.item != null) {
        //this.setState({ isLoading: true, });
        //alert(this.props.item.CampaignId)            

            fetch('http://servicestest.qcharity.org/api/Basket/Insert', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ItemId: self.props.item.ItemId,
                    PaidThroughId: self.props.item.PaidThroughId,
                    CountryId : self.props.item.CountryId,
                    Amount: self.props.item.LatePayments.Amount,
                    AccountTypeId: self.props.item.AccountTypeId,
                    IsNew: self.props.item.IsNew,
                    CampaignId: self.props.item.CampaignId,
                    DonorId: this.props.currentUser.DonorId,
                    Count: 1,
                    ItemTitle: '',
                    ItemDiscription: '',
                    AmountRemaining: self.props.item.AmountRemaining,
                    MobileDBId: self.props.item.MobileDBId,
                }),
            })
            .then((response) => response.json()) 
            .then((responseData) => {
                if(JSON.stringify(responseData.Result) != 'false') {
                    let newItem = {BasketId: responseData.BasketIds, Amount: self.props.item.LatePayments.Amount};
                    //alert('newItem' + newItem.Amount)
                    let basketItems =  self.state.BasketItems;
                    basketItems.push(newItem);

                    self.setState({BasketItems: basketItems, PayItems: basketItems});
                    //alert(self.state.selectedItems)
                    if(index == self.state.selectedItems - 1) {
                        self.inProcess = false;
                        self.requestEnd();//alert(responseData.Result)
                        alert('Item added to basket successfully');
                        
                        if(payNow) {
                            let val = 0;
                            basketItems.map((item, index) => {
                                val += item.Amount;
                            })
                            self.openPayNowModal(val);
                        }
                        
                            self.setState({selectedItems: 0, BasketItems: [],});
                        
                    }
                    else {
                    }
                }
                else {

                    self.requestEnd();
                    //this.setState({ isLoading: false, });
                    alert('An error occured. Message: ' + JSON.stringify(responseData.Message)); 
                }
                //index++;
            })
            .catch((error) => {
                self.requestEnd();
                //this.setState({ isLoading: false, });
                alert(error); 
            }).done();
        }
        else {
            //alert('Please Select at least one month');
        }
    }

    render() {

        let currencyText = isArabic ? 'ر.ق' : 'QAR';
        let donateNowText = isArabic ? 'تبرع الآن' : 'Donate Now';
        let addToBasketText = isArabic ? 'إضافة للسلة' : 'Add To Basket';
        let title;
        let subTitle;
        let totalAmount = 0;
        let delaiedMonths = [];

        let item =  this.props.item;
        let modalCtrl = null;

        if(item != null && item.LatePayments != null && item.LatePayments.Sub != null ) {

            if(this.state.payNowModalIsOpen) {
                modalCtrl = (
                    <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                        onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                        onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                        item={this.state.PayItems} type='latePayments' />
                );
            }
            else {

                let delaieDates =  item.LatePayments.Sub;
                totalAmount = item.LatePayments.Amount * delaieDates.length;
                title = (isArabic ? 'إجمالي المتأخرات ' : 'Total Overdue ') + totalAmount + ' ' + currencyText;
                subTitle = (isArabic ? 'قيمة القسط الشهري للكفالة ' : 'Monthly payment for sponsership ') + item.LatePayments.Amount + ' ' + currencyText;

                delaieDates.map((date, index) => {
                    delaiedMonths.push(
                        <View key={index} style={styles.datesRow}>
                            <View style={styles.dateContainer}>
                                <Text style={[styles.dateText, text]}>{date.LateDate}</Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <QCCheckboxVIcon freez={freez} 
                                    onPressed={(isChecked) => this.selectCheckedChanged(isChecked, item.LatePayments, item.Amount)} />
 
                                {/*<QCCheckbox checked={false} 
                                    onChange={(isChecked, checkbox) => this.selectCheckedChanged(isChecked, item.LatePayments.Amount)} />*/}
                            </View>
                        </View>
                    );
                });

                modalCtrl = (
                    <Modal  isOpen={this.props.isOpen} position={"center"} style={[styles.modal, styles.modal1]} ref={"modal4"} 
                            onClosed={() => this.onClose()} 
                            onOpened={() => this.onOpen()} 
                            onClosingState={() => this.onClosingState()}>
                        <View style={[styles.container,]}>
                            <View style={[styles.innerContainer,]}>
                                <Text style={[{marginBottom:10, color: '#fe345a', fontSize:13, }, text,]}>{title}</Text>
                                <Text style={[{marginBottom:10, fontSize:12, }, text,]}>{subTitle}</Text>
                       
                                <View style={[styles.toolbar, {marginBottom:20, justifyContent: 'center',borderBottomColor: 'gray', borderBottomWidth: 1,width:120,}]}>
                                    <Text style={[styles.paidAmount]}>{this.state.selectedItems * item.LatePayments.Amount} {currencyText}</Text>
                                </View>
                                <ScrollView style={{flex: 1,}}>
                                    {delaiedMonths}
                                </ScrollView>
                                <View style={styles.toolbar}>
                                    <QCButton text={donateNowText} width={100} isArabic={isArabic} 
                                                onPressed={() => this.payNow()} color='red' />

                                    <QCButton text={addToBasketText} width={100} isArabic={isArabic} 
                                                onPressed={() => this.addAllToBasket(false)} color="blue" />
                                </View>
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
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    modal1: {
        width: width *.7, 
        height: 300, 
        backgroundColor: "white",
        borderRadius: 3,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    innerContainer: {
        width: (width *.7) - 40, 
        height: 260, 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    datesRow: {
        height: 30,
        width: (width *.7) - 40,
        flexDirection: 'row',
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

module.exports = LatePaymentsModal; /* making it available for use by other files */