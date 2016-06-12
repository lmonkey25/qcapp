'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image, 
    View,
    ListView,
    TouchableHighlight,
} from 'react-native';

import { height, width, text, AccountController, formatingNumRegx, formatingNumFormat } from '../utilities/constants'
import CheckBox from 'react-native-icon-checkbox';


let QCLoading =  require('../../qcLoading');
let QCCheckbox = require('../sharedControls/qcCheckbox');
let QCCheckboxVIcon = require('../sharedControls/qcCheckboxVIcon');
let TopTabs = require('../sharedControls/topTabs');
let QCButton = require('../sharedControls/qcButton');

let PaymentMethodsModal = require('../qcModals/paymentMethods');

let isArabic = true;
let listCount = -1;
let selectedItems = [];
class MyBasket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selectAll: false,
            selectedCheckboxs: 0,
            isLoading: true,
            selectedItems: [],
            selectedItemAmount: 0,
            dataOneTime: [],
            dataOneTimeTotal: 0,
            dataMonthly: [],
            dataMonthlyTotal: 0,
            dataSourceOneTime: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            dataSourceMonthly: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            payNowModalIsOpen: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        selectedItems = [];
        this.fetchData();
    }
    componentWillUnmount() {
    }
    fetchData() {
        debugger;
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }

        if(donorId && donorId != null && donorId > 0) {
            let self = this;
            let REQUEST_URL = 'http://servicestest.qcharity.org/api/Basket/GetDonorBasket?DonorId=' 
                              + donorId;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                let dataSourceOneTime = [], oneTimeTotal = 0;
                let dataSourceMonthly = [], monthlyTotal = 0;
                responseData.map((item, index) => {
                    if(item.IsRecurrent) {
                        dataSourceMonthly.push(item);
                        monthlyTotal += item.Amount;
                    }
                    else {
                        dataSourceOneTime.push(item);
                        oneTimeTotal += item.Amount;
                    }
                });
                selectedItems = [];
                //alert(selectedItems.length)
                if(this.props.onRefreshed){
                    this.props.onRefreshed();
                }
                self.setState({
                    dataOneTime: dataSourceOneTime,
                    dataOneTimeTotal: oneTimeTotal,
                    dataSourceOneTime: self.state.dataSourceOneTime.cloneWithRows(dataSourceOneTime),
                    dataMonthly: dataSourceMonthly,
                    dataMonthlyTotal: monthlyTotal,
                    dataSourceMonthly: self.state.dataSourceMonthly.cloneWithRows(dataSourceMonthly),
                    isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'MyBasket',
                title: this.props.isArabic ? 'السلة' : 'My Basket',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: this.props.isArabic, redirectInfo: redirectInfo, },
            });
        }
    }
    switchTab(isFirstTab) {
        listCount = -1;
        selectedItems = [];
        if(!this.state.isLoading) {
            let dataSource = isFirstTab ? this.state.dataSourceOneTime : this.state.dataSourceMonthly;
        let dataSourceOneTime = JSON.parse(JSON.stringify(this.state.dataOneTime));
        let dataSourceMonthly = JSON.parse(JSON.stringify(this.state.dataMonthly));

        this.setState({ 
                activeIndex: isFirstTab ? 0 : 1,
                selectedItems: [],
                selectedCheckboxs: 0,
                selectedItemAmount: 0,
            //selectedCheckboxs: this.state.selectedCheckboxs + counterSeed,
            //selectedItems: selectedItems,
            //selectedItemAmount: this.state.selectedItemAmount + amount,
            //dataSourceOneTime: this.state.dataSourceOneTime.cloneWithRows(dataSourceOneTime),
            //dataSourceMonthly: this.state.dataSourceOneTime.cloneWithRows(dataSourceMonthly),
        });
        }
    }
    togleSelectAll(isChecked) {
        this.setState({ 
            selectAll: isChecked,
            selectedCheckboxs: isChecked? listCount : 0,
        });
    }
    selectCheckedChanged(isChecked, basketId, amount) {
        let counterSeed = isChecked ? 1 : -1;
        //let selectedItems = this.state.selectedItems;
        if(isChecked) {
            selectedItems.push({BasketId: basketId, Amount: amount});
        } 
        else { 
            //amount = amount * -1;
            var index = 0;

            for(; index < selectedItems.length; index++) {
                if(selectedItems[index].BasketId == basketId) {
                    break;
                }
                //selectedItems.indexOf({BasketId: basketId, Amount: amount});
            }
            //alert(index)
            if(index > -1){
                selectedItems.splice(index, 1);
            }
        }
        if(this.props.onSelectedItemsChanged) {
            let itms = [];
            selectedItems.map((itm, index) => {
                itms.push(itm.BasketId);
            });
            this.props.onSelectedItemsChanged(itms);
        }
        //alert(selectedItems.length)
        //this.setState({selectedItems: selectedItems});
        //let dataSource = this.state.activeIndex == 0 ? this.state.dataSourceOneTime : this.state.dataSourceMonthly;
        //let dataSourceOneTime = JSON.parse(JSON.stringify(this.state.dataOneTime));
        //let dataSourceMonthly = JSON.parse(JSON.stringify(this.state.dataMonthly));

        /*this.setState({ 
            selectedCheckboxs: this.state.selectedCheckboxs + counterSeed,
            selectedItems: selectedItems,
            selectedItemAmount: this.state.selectedItemAmount + amount,
            dataSourceOneTime: this.state.dataSourceOneTime.cloneWithRows(dataSourceOneTime),
            dataSourceMonthly: this.state.dataSourceOneTime.cloneWithRows(dataSourceMonthly),
        });*/
    }

    openPayNowModal() {
        this.setState({
            payNowModalIsOpen: true,
        });
    }
    payNowModalClosed() {
        this.setState({ 
            payNowModalIsOpen: false,
        });
    }
    payNow() {
        //alert(this.state.selectedItemAmount)
        if(selectedItems.length > 0) {//this.state.selectedItemAmount > 0 && this.state.selectedItems.length > 0) {
            this.openPayNowModal();
            /*let title = isArabic ? 'السلة' : 'Basket';
            this.props.navigator.push({
                id: 'PaymentMethods',
                title: title,
                component: PaymentMethods,
                passProps: {
                    type: 'basket', 
                    amount: this.state.selectedItemAmount, 
                    payFor: this.state.selectedItems,
                    isArabic: isArabic, 
                },
            });*/
        }
        else {
            alert('من فضلك اختر ما تريد دفعه أولا');
        }
    }

    renderItem(item, selectedItems, currencyText) {

        let isSelected = (selectedItems.length > 0 && (selectedItems.indexOf(item.BasketId) > -1));
        let backgroundColor = isSelected ? '#e8e8e8' : '#fff';
        let btnBGColor = isSelected ? '#e8d8d8' : '#fff';
        let title = isArabic ? item.ItemTitle : item.ItemTitleEn;
        let category = isArabic ? item.ItemDiscription : item.ItemDiscriptionEn;

        return (
            <View style={[styles.itemContainer, {backgroundColor: backgroundColor,}]}>
                <View style={styles.detailsContainer}>
                    <View style={styles.costWrapper}>
                        <View style={[styles.costBtn, {backgroundColor: btnBGColor,}]}>
                            <Text style={[styles.cartCost, text]}>{item.Amount} {currencyText}</Text>
                        </View>
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={[styles.itemTitle, text]}>{title}</Text>
                        <Text style={[styles.itemDescription, text]}>{category}</Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={{uri: item.Image}} style={styles.image} />
                </View>
                <View style={styles.selectAll}> 
                    {/*<QCCheckbox onChange={(isChecked, checkbox) => this.selectCheckedChanged(isChecked, item.BasketId, item.Amount)}
                                selected={ this.state.selectAll } checked={false} />
                    <ItemCheckbox icon="check" iconSize="small" checked={false} />*/}
                    <QCCheckboxVIcon onPressed={(isChecked) => this.selectCheckedChanged(isChecked, item.BasketId, item.Amount)} />

                </View>
            </View>
        );
    }
    
    render() {
        if(this.props.refresh) {
            this.fetchData();
        }
        let activeIndex = this.state.activeIndex;
        let firstTabText = isArabic? 'مدفوعات لمرة واحدة':'One Time Payments';
        let secondTabText = isArabic? 'مدفوعات شهرية':'Monthly Payments';
        let selectAllText = isArabic? 'اختار الكل':'Select All';
        let totalText = isArabic? 'الإجمالي':'Total';
        let currencyText = isArabic? 'ر.ق':'QAR';
        let payNowText = isArabic? 'إدفع الآن':'Pay Now';

        let currentTabContent = null;
        let loading = null, listCtrl = null;

        let stTabCounter = 0, ndTabCounter = 0;
        let topView = null, bottomView = null;


        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {
            let selectedItems = this.state.selectedItems;

            stTabCounter = this.state.dataOneTime.length;
            ndTabCounter = this.state.dataMonthly.length;

            let dataSource = activeIndex == 0 ? this.state.dataSourceOneTime : this.state.dataSourceMonthly;
            listCtrl = (
                <ListView
                    dataSource={dataSource}
                    renderRow={(item) => this.renderItem(item, selectedItems, currencyText)}
                    initialListSize={1}
                    style={{flex: 1,}}
                    contentContainerStyle={[styles.contentContainer]} />
            );



            let payBtn = null;
            let totalAmount = activeIndex == 0 ? 
                this.state.dataOneTimeTotal : this.state.dataMonthlyTotal;
            if(totalAmount > 0) {
                topView = (
                    <View style={styles.selectAllContainer}>
                        <Text style={[styles.title, text]}>{selectAllText}</Text>
                        <View style={styles.selectAll}>                        
                            <QCCheckbox /*onChange={(isChecked, checkbox) => this.togleSelectAll(isChecked)}
                                        selected={ this.state.selectedCheckboxs == listCount }*/ id='selectAll' />
                        </View>
                    </View> 
                );

                let redirectInfo = {
                    id: 'MyBasket',
                    title: isArabic? 'السلة' :'My Basket',
                };
                payBtn = (
                    <View>  
                        <QCButton text={payNowText} width={120} isArabic={isArabic} 
                                    onPressed={() => AccountController.executeIfAuthenticated(this.props.currentUser,
                                                        this.payNow(), isArabic, this.props.navigator, redirectInfo)} />
                    </View>
                );
            }
            else {
                topView = (
                    <View style={styles.selectAllContainer}>
                    </View> 
                );
            }

            bottomView = (
                <View style={[styles.selectAllContainer, styles.bottomPay]}>
                    {payBtn}
                    <View style={styles.textWrapper}>
                        <Text style={[styles.total, text]}>{totalAmount.toFixed(2).replace(formatingNumRegx, formatingNumFormat)} {currencyText}</Text>
                        <Text style={[styles.totalTitle, text]}>{totalText}</Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <TopTabs isArabic={isArabic} 
                         firstBtnText={firstTabText} 
                         firstBtnBadge={'' + stTabCounter + ''}
                         secondBtnText={secondTabText} 
                         secondBtnBadge={'' + ndTabCounter + ''}
                         activeIndex={activeIndex}
                         onFirstPressed={() => this.switchTab(true)}
                         onSecondPressed={() => this.switchTab(false)} />
                {topView} 
                {listCtrl}                
                {bottomView}
                <PaymentMethodsModal isOpen={this.state.payNowModalIsOpen} navigator={this.props.navigator}
                            onClosed={() => this.payNowModalClosed()} isArabic={isArabic}
                            onMethodSelected={() => this.setState({payNowModalIsOpen: false, })}
                            item={selectedItems}
                            currentUser={this.props.currentUser} /*amount={this.state.selectedItemAmount}*/ type='basket' />            
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
        //flex: 1,
        width: width,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom:53,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
    selectAllContainer: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: '#cfcfcf',
        borderBottomColor: '#cfcfcf',
        height: 50,
        width: width,
        flexDirection: 'row',
        alignItems:'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    itemContainer: {
        width: width,
        height: 80,
        //paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        backgroundColor: '#e8e8e8',
    },
    imageContainer: {
        width: 80,
        height: 80,
        alignItems: 'center', 
        justifyContent:'center',
    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    detailsContainer: {
        flex: 1,
        height: 80,
        flexDirection: 'row',
        borderBottomColor: '#cfcfcf',
        borderBottomWidth: 1,
    },
    costWrapper: {
        width: 80,
        height: 80,
        marginLeft: 15,
        alignItems: 'center', 
        justifyContent:'center',
    },
    costBtn: {        
        width: 80,
        height: 30,
        alignItems: 'center', 
        justifyContent:'center',  
        borderColor: '#cfcfcf',
        borderWidth: 1,  
    },
    cartCost: {      
        width: 80,
        textAlign: 'center',    
    },
    titleWrapper: {        
        flex: 1,
        //alignItems: 'center', 
        justifyContent:'center',
    },
    itemTitle: {
        textAlign: 'right',
        color: '#343434',      
        //flex: 1,
    },
    itemDescription: {
        textAlign: 'right',
        color: '#06aebb',      
        //flex: 1,
    },
    bottomPay: {
        //position: 'absolute',
        marginBottom: -7,
        height: 60,
    },
    title: {
        flex: 1,
        color: '#343434',
        textAlign: 'right',
        marginRight: 20,
        marginLeft: 20,
    },
    selectAll: {
        width: 30,
        alignItems:'center',
        justifyContent:'center',
    },
    textWrapper: {
        flex: 1,
        flexDirection: 'row',        
    },
    total: {
        flex: 1,
        color: '#343434',
        textAlign: 'right',
    },
    totalTitle: {
        width: 70,
        color: '#343434',
        textAlign: 'right',
    },
});
module.exports = MyBasket;