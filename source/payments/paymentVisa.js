'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Image,
    TouchableHighlight,
} from 'react-native';

import { height, width, text } from '../utilities/constants';
let QCCheckbox = require('../sharedControls/qcCheckbox');

let isArabic = true;

class PaymentVisa extends Component {

    constructor(props) {
        super(props);
        this.state = {
            saveCard: false,
            isLoading: true,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    componentWillUnmount() {
    }

    fetchData() {
        let self = this;
        let REQUEST_URL = 'http://servicestest.qcharity.org/api/MobileDevice/GetDonorTarget?DonorId=19953';
    }
    goMyProjects(title) {
        this.props.navigator.push({
            id: 'MyProjects',
            title: title,
            component: MyProjects,
            passProps: {isArabic: this.props.isArabic, },
        });
    }
    
    render() {
        let amount = this.props.amount;


        let name = 'الاسم على البطاقة';
        let cardNumber = 'رقم البطاقة';
        let ccvNumber = 'رقم ال CCV';
        let expireData = 'تاريخ الانتهاء';
        let saveData = 'هل تريد حفظ هذه البطاقة على حسابك';
        let saveDataInst = 'في حالة حفظ بيانات البطاقة سيتم حذف بيانات البطاقة السابقة و جميع الاستقطاعات ستكون من البطاقة الجديدة';
        let totalAmount = 'المبلغ الإجمالي';
        let currency = 'ر.ق';
        let payBtnText = 'دفع'
        let month = 'شهر';
        let year = 'سنة';

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;

        return (
            <View style={styles.container}>
                <ScrollView
                    scrollEventThrottle={16}
                    style={{ marginBottom:0,}}
                    contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>

                        <View style={styles.formRow}>
                            <View style={styles.inputWrapper}>
                                <TextInput autoFocus={true} maxLength={50} 
                                    style={[styles.inputTexts, text]}
                                    placeholderTextColor={'#e8e8e8'}
                                    onChangeText={(txt) => this.setState({cardName: txt})}
                                    value={this.state.cardName} />
                            </View>
                            <View style={styles.labelWrapper}>
                                <Text style={[styles.label, text]}>{name}</Text>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.inputWrapper}>
                                <TextInput maxLength={16} 
                                    style={[styles.inputTexts, text]}
                                    placeholderTextColor={'#e8e8e8'}
                                    onChangeText={(txt) => this.setState({cardNumber: txt})}
                                    value={this.state.cardNumber} />
                            </View>
                            <View style={styles.labelWrapper}>
                                <Text style={[styles.label, text]}>{cardNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.inputWrapper}>
                                <TextInput maxLength={4} 
                                    style={[styles.inputTexts, text]}
                                    placeholderTextColor={'#e8e8e8'}
                                    onChangeText={(txt) => this.setState({ccvNumber: txt})}
                                    value={this.state.ccvNumber} />
                            </View>
                            <View style={styles.labelWrapper}>
                                <Text style={[styles.label, text]}>{ccvNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={[styles.inputWrapperRow]}>
                                <View style={styles.dateWrapper}>
                                    <Text style={[styles.labelDate, text]}>{month}</Text>
                                    <TextInput maxLength={2} 
                                        style={[styles.inputTexts, styles.small, {width: 40,}, text]}
                                        placeholderTextColor={'#e8e8e8'}
                                        onChangeText={(txt) => this.setState({expireDateMonth: txt})}
                                        value={this.state.expireDateMonth} />
                                </View>
                                <View style={[styles.dateWrapper,]}>
                                    <Text style={[styles.labelDate, text]}>{year}</Text>
                                    <TextInput maxLength={4} 
                                        style={[styles.inputTexts, styles.small, {width: 40,}, text]}
                                        placeholderTextColor={'#e8e8e8'}
                                        onChangeText={(txt) => this.setState({expireDateYear: txt})}
                                        value={this.state.expireDateYear} />
                                </View>
                            </View>
                            <View style={styles.labelWrapper}>
                                <Text style={[styles.label, text]}>{expireData}</Text>
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.inputWrapper}>                                
                                <Text style={[styles.label, {width: (width - (width * .3)) - 40,}, text]}>{saveData}</Text>
                            </View>
                            <View style={[styles.labelWrapper, {alignItems: 'center', justifyContent: 'center',}]}>
                                <QCCheckbox onChange={(isChecked, checkbox) => this.setState({saveCard: isChecked})}
                                            selected={ this.state.saveCard } id='select1' />
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.inputWrapper}>
                                <Text style={[styles.label, {width: width - 40,}, text]}>{saveDataInst}</Text>
                            </View>
                        </View>
                        <View style={[styles.formRow, {justifyContent: 'center', alignItems: 'center', height: 100,  marginBottom: 0, marginTop: 50,}]}>
                            <View style={[{width: width - 40, height: 100, backgroundColor: '#cfcfcf', justifyContent: 'center', alignItems: 'center', }]}>
                                <Text style={[styles.label, {fontSize: 25, width: width - 40, textAlign: 'center',}, text]}>{totalAmount}</Text>
                                <View style={[styles.row, {justifyContent: 'center', alignItems: 'center',}]}>
                                    <Text style={[styles.label, {width: width - 40, fontSize: 18, color: '#fe345a', textAlign: 'center'}, text]}>{this.props.amount} {currency}</Text>
                                </View>
                            </View>
                        </View>

                        
                    </View>
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 20,
        marginBottom:50,
    },
    formRow: {
        width: width,
        height: 40,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10,
    },
    inputWrapper: {
        flex: 1,
        alignItems: 'flex-end',
    },
    inputWrapperRow: {
        width: (width - (width * .3)) - 40,
        flexDirection: 'row',  
        justifyContent: 'flex-start',  
    },
    dateWrapper: {
        width: (width - (width * .3) - 40) / 2.1,
        flexDirection: 'row', 
        justifyContent: 'flex-end',
    },
    labelDate: {
        width: 50,
        fontSize: 12,
        textAlign: 'center',
        backgroundColor: '#cfcfcf',
    },
    inputTexts: {
        width: 180,
        height: 40,
        backgroundColor: '#cfcfcf',
        borderRadius: 3,
    },
    small: {
        backgroundColor: '#f0f0f0',
    },
    labelWrapper: {
        width: width * .3,
        justifyContent: 'flex-start',
    },
    label: {
        width: width * .3,
        fontSize: 15,
        textAlign: 'right',
    },
    picWrapper: {
        //flex: 1,
        backgroundColor: '#444444',
        width: width,
        marginTop: -1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        resizeMode: 'contain',
        height: 100,
    },
    welcome: {
        color: 'white',
        marginTop:10,
        marginBottom: 10,
        fontFamily: 'Janna New R',
    },
    pointsWrapper: {
        flexDirection: 'row',
        backgroundColor: '#06aebb',
        height: 45,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointLabel: {
        flex: 1,
        width: width/2,
        color: 'white', 
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sideBorder: {
        backgroundColor: 'white',
        width: 2,
        height: 40,
    },
    iconsWrapper: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingBottom:10,
    },
    iconWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        resizeMode: 'contain',
        height: 100,
    },
    iconLabel: {
        flex: 1,
        fontSize: 12,
        color: '#535353', 
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Janna New R',
    },
    targetTitle: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    targetTitleLabel: {
        flex: 1,
        fontSize: 12,
        color: '#535353', 
        textAlign: 'center',
        fontFamily: 'Janna New R',
    },
    date: {
        color: '#cccccc', 
        fontFamily: 'Janna New R',
    },
    targetChart: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    pacman: {
        flexDirection: 'row', 
        position: 'relative',
        backgroundColor: '#cccccc',
        width: 120,
        height: 120,
        /*borderTopWidth: 60,
        borderTopColor: 'red',
        borderLeftColor: 'red',
        borderLeftWidth: 60,
        borderRightColor: 'transparent',
        borderRightWidth: 60,
        borderBottomColor: 'red',
        borderBottomWidth: 60, */
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        borderBottomLeftRadius: 60,
    },
    percentage: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        textAlign: 'center', 
        fontSize: 20,
        color: '#535353',
        fontFamily: 'Janna New R',    
    },
    targetLabel: {
        fontSize: 13,
        color: '#535353',
        flex:1,
        fontFamily: 'Janna New R',
    },
    doneLabel: {        
        color: '#fe345a',
    },
    text: {
        fontFamily: 'Janna New R',
    },
});
module.exports = PaymentVisa;