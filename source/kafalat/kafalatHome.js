'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker,
    TouchableHighlight,
} from 'react-native';

let Dropdown = require('react-native-dropdown-android');
let { height, width, text } = require('../utilities/constants');
let PaymentMethodsModal = require('../qcModals/paymentMethods');

let isArabic = true;

class KafalatHome extends Component {

    constructor(props) {
       super(props);
       this.state = {
            sponsorNum: 0,
            sponsorAmount: 0,
            prices: [],
            priceId: 0,
            payNowModalIsOpen: false,
            BasketItems: [],
       }
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.fetchPricesData();
    }
    componentWillUnmount() {
    }
    fetchPricesData() {
        debugger;
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/User/GetDonorDonationPriceList?CategoryId=1&TypeId=0&CountryId=0&SubTypeId=0&DonationTypeId=0&LanguageId=1&InternalCategory=0';
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            let prices = [];
            prices = responseData;

            self.setState({
                prices: prices,
                isLoading: false,
            });
        })
        .done();
    }
    getNumOptions(numText) {
        let priceNames = [numText, 1, 2, 3, 4, 5];

        return priceNames;
    }
    getPriceOptions(priceText) {
        debugger;
        let prices = this.state.prices;
        let priceNames = [priceText];
        if(prices && prices!= null && prices.length > 0) {
            prices.map((item, index) => {
                priceNames.push(item.Title)
            });
        }
        else {
            priceNames.push(100)
        }
        return priceNames;
    }
    rangeChanged(amount) {
        if(amount > 0) {
            this.setState({sponsorAmount: amount, });
        }
    }
    renderPricesOptions() {
        let data = this.state.prices;
        let priceText = isArabic? 'مبلغ الكفالة' : 'Sponsership Amount';
        let prices = [priceText];
        if(data && data != null && data.length > 0) {
            data.map((item, index) => {
                prices.push(item.Max)
            });
        }
        return (
            <Dropdown
                style={{ height: 20, width:width / 2, }}
                values={prices}
                selected={0} onChange={(val) => { this.rangeChanged((val.selected > 0) ? val.value : val.selected) }} />
        );
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

    payNow() {
        this.addToBasket(true);
    }

    addToBasket(payNow) {
        let donationAmount = this.state.sponsorNum * this.state.sponsorAmount;

        if(donationAmount > 0) {
            if(this.props.currentUser && this.props.currentUser != null) {
                let category = this.props.category;

                this.setState({isLoading: true,});
                debugger;
                fetch('http://servicestest.qcharity.org/api/Basket/Insert', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ItemId:category.ItemId,
                        PaidThroughId: 1,
                        CountryId : 0,
                        Amount: donationAmount,
                        AccountTypeId:1209,
                        IsNew: '' + category.IsNew + '',
                        CampaignId: 0,
                        DonorId: this.props.currentUser.DonorId,
                        Count: 1,
                        ItemTitle: '',
                        ItemDiscription: '',
                        AmountRemaining: 0,
                        MobileDBId: 0,
                    }),
                })
                .then((response) => response.json()) 
                .then((responseData) => {
                    this.setState({isLoading: false,});
                    if(JSON.stringify(responseData.Result) != 'false') {
                        //alert(responseData.BasketIds)
                        let newItem = {BasketId: responseData.BasketIds, Amount: donationAmount};
                        let basketItems = [];// this.state.BasketItems;
                        basketItems.push(newItem);
                        this.setState({BasketItems: basketItems, });

                        if(payNow) {
                            this.openPayNowModal(newItem.Amount);
                        }
                        else {alert('Item added to basket successfully');
                        }
                    }
                    else {
                        alert('An error occured. Message: ' + JSON.stringify(responseData.Message)); 
                    }
                })
                .catch((error) => {
                    this.setState({isLoading: false,});
                    alert(error); 
                }).done();
            }
            else {
                alert('Please login first');
            }
        }
        else {
            alert('من فضلك، اختر مبلغ الكفالة و عدد المكفولين.');
        }
    }

    render() {
        let prices = this.renderPricesOptions(); 

        let numText = isArabic? 'عدد المكفولين' : 'Sponsered Num';
        let nums = this.getNumOptions(numText); 
        return (
            <View style={styles.container}>
                <View style={styles.search}>
                    <View style={[{flex: 1, marginLeft: 0}, styles.selectContainer]}>
                        <Dropdown
                            style={{ height: 20, width: width / 3, }}
                            values={nums}
                            selected={0} onChange={(data) => { this.setState({ sponsorNum: data.selected, }); }} />
                    </View>
                    <View style={[{flex: 1.5, marginLeft: 3,}, styles.selectContainer]}>
                        {prices}
                    </View>
                </View>
                <View style={styles.total}>
                    <Text style={styles.totalText}>إحمالي الكفالة {this.state.sponsorNum * this.state.sponsorAmount}</Text>
                </View>
                <View style={styles.buttons}>
                    <TouchableHighlight 
                            style={[styles.button, styles.myGroups]}
                            onPress={() => this.payNow()}
                            underlayColor={'#ed3054'}>
                        <View style={styles.wrapper}>
                            <Text style={[styles.btnText, styleLang.btnFont]}>اكفل الآن</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                            style={[styles.button, styles.addGroup]}
                            onPress={() => this.addToBasket(false)}
                            underlayColor={'#06aebb'}>
                        <View style={styles.wrapper}>
                            <Text style={[styles.btnText, styleLang.btnFont]}>إضافة للسلة</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                    onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                    onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                    item={this.state.BasketItems} type='sponsership' />
            </View>
        );
    }
}

var itemWidth = (width - 20);
var styles = StyleSheet.create({    
    container: {
        flex: 1,
        marginBottom:55,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    selectContainer: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
        alignItems: 'center',
        justifyContent:'center',
    },    
    search: {
        flexDirection: 'row',
        width: itemWidth,
        height: 50,
        marginBottom:10,
    },
    total: {
        flexDirection: 'row',
        width: itemWidth,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    totalText: {
        width: itemWidth,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        width: itemWidth - (itemWidth / 3),
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginTop: 30,
        marginLeft: 10,
    },
    button: {
        height: 35,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
    },
    addGroup: {
        backgroundColor: '#06aebb',
    },
    myGroups: {
        backgroundColor: '#fe345a',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        //fontFamily: 'Janna LT',
        flex: 4,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 0,
    },
});
var styleLang;

if(!isArabic) {
    styleLang = StyleSheet.create({ 
        iconMargin: {
            marginRight: 5,
        },
        btnFont: {
            fontSize: 14,
        },
    });
}
else {
    styleLang = StyleSheet.create({ 
        iconMargin: {
            marginLeft: 5,
        },
        btnFont: {
            fontSize: 14,
        },
    });
}

module.exports = KafalatHome;