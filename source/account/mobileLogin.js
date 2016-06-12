'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Alert,
    Modal,
    ListView,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import { height, width, text, Validator, AccountController, } from '../utilities/constants';
let QCLoading =  require('../../qcLoading');
let QCButton = require('../sharedControls/qcButton');

let isArabic = true;
let redirectInfo = null;

class MobileLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activation_code: '',
            verify_activation_code: '',
            mobile: '', 
            isLoading: false,  
            animationType: 'none',
            modalVisible: false,
            transparent: false,
            mobileResponseData:null,  
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    validateEmail(email) {
        return Validator.validateEmail(this.state.email);
    }
    validatePhone() {
        return Validator.validatePhone(this.state.mobile);
    }
    getActivationCode() {
        if(!this.state.mobile) {
            Alert.alert("خطأ في البيانات", "من فضلك أدخل رقم جوالك");
            return;
        }
        else if(!this.validatePhone()) {
            Alert.alert("خطأ في البيانات", "من فضلك أدخل رقم جوال صحيح مكون من 8 أرقام");
            return;
        }
        this.setState({ isLoading: true, });
        fetch('http://servicestest.qcharity.org/api/User/SendMobileVerification?Mobile=' + this.state.mobile, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json()) 
        .then((responseData) => {                
            if(JSON.stringify(responseData.Result) != 'false') {
                this.setState({ isLoading: false, activation_code: responseData.ActivationCode });
                /*Alert.alert(
                    "Success",
                    "Message " + JSON.stringify(responseData.Message) + " Activation Code:" + JSON.stringify(responseData.ActivationCode)
                );*/
            }
            else {
                this.setState({ isLoading: false, });
                Alert.alert("Failure", "Message " + JSON.stringify(responseData.Message));  
            }
        })
        .catch((error) => { 
            this.setState({ isLoading: false, }); 
            alert(error); 
        }).done();          
    }
    renderActivation() {
        if(this.state.activation_code){
            let codeHolderText = isArabic ? 'أدخل كود التفعيل' : 'Type activation code';
            let loginText = isArabic ? 'دخول' : 'Login';
            return (
                <View style={styles.formRow}>
                    <QCButton text={loginText} width={140} isArabic={isArabic} 
                                onPressed={() => this.loginUser()}
                                color='blue' />
                    <TextInput style={[styles.mobile_input, text]} 
                                placeholderTextColor={'#e8e8e8'}
                                onChangeText={(activation_code_value) => this.setState({ verify_activation_code: activation_code_value })}
                                value={this.state.verify_activation_code} placeholder={codeHolderText} />
                </View>
            );
        }
    }

    renderRow(rowData){
        let self = this;
       return (
            <TouchableHighlight  onPress={() => self.loginMobileUser(rowData)}>
                <View style={styles.modal_row} >
                    <Image source={require('../../contents/images/user_icon.png')} />
                    <View style={{padding:10}}>
                        <Text style={{fontWeight:'bold'}}>{JSON.stringify(rowData.UserName)}</Text>
                        <Text>{JSON.stringify(rowData.FullName)}</Text>
                    </View>                
                </View>
            </TouchableHighlight>
        );
    }
    renderModal() {
       let select = isArabic ? 'اختار اسم مستخدم' : 'Select a user'
        if(this.state.modalVisible){
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource=ds.cloneWithRows(this.state.mobileResponseData);
            return (
                <Modal animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {this.disbaleModal}}>
                    <View style={[styles.modal_container,{backgroundColor:'rgba(0, 0, 0, 0.5)'}]}>
                        <View style={[styles.modal_innerContainer, {backgroundColor: '#fff'}]}>
                            <View style={{padding:10}}>
                                <Text style={{fontWeight:'bold'}}>{select}</Text>
                            </View>
                            <View style={{padding:10}}>
                                <ListView dataSource={dataSource} renderRow={(data) => this.renderRow(data) } />
                            </View>                                    
                        </View>
                    </View>
                </Modal>
            );
        }

    }


    onUserLoggedIn(notifyBack) {
        if(this.props.onLogin) {
            this.props.onLogin(notifyBack);
        }
    }

    loginMobileUser(userData){debugger;
        let self = this;
        this.disbaleModal();
        AccountController.loginMobileUser(userData, redirectInfo, this.props.navigator, isArabic, (notifyBack) => self.onUserLoggedIn(notifyBack))
    }
    loginUser() {
        if(!this.state.mobile){
            Alert.alert("خطأ في البيانات", "من فضلك أدخل رقم جوالك");
            return; 
        }
        if(!this.state.verify_activation_code){
            Alert.alert("خطأ في البيانات", "من فضلك أدخل كود التفعيل المرسل إليكe");
            return;
        }
        else if(this.state.verify_activation_code != this.state.activation_code) {
            Alert.alert("خطأ في البيانات", "كود التفعيل غير صحيح");
            return;  
        } 
        this.setState({ isLoading: true, });
        fetch('http://servicestest.qcharity.org/api/User/GetAllDonorsForThisMobile?Mobile=' + this.state.mobile, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json()) 
        .then((responseData) => {
            this.setState({ isLoading: false, });
            if(JSON.stringify(responseData.Result) != 'false'){

                if(responseData.length > 1){
                    this.displayDonorListPopup(responseData);
                }
                else{
                    this.loginDonorByFoundDetails(responseData);
                }
            }
            else{
                Alert.alert(
                    "Failure",
                    "Message " + JSON.stringify(responseData.Message)
                );  
            }
        })
        .catch((error) => { 
            this.setState({ isLoading: false, });
            alert(error); 
        }).done();
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    displayDonorListPopup(responseData){
        this.setState({mobileResponseData:responseData, modalVisible: true, transparent: true});
    }
    disbaleModal(){
        this.setState({modalVisible:false});        
    }
    loginDonorByFoundDetails(responseData){
        AccountController.loginDonor(responseData.DonorId, redirectInfo, this.props.navigator, isArabic);
    }
    
    render() {

        isArabic = this.props.isArabic;
        redirectInfo = this.props.redirectInfo;

        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        let title = isArabic ? 'تسجيل الدخول برقم الجوال' : 'Login by mobile phone';
        let typePhone = isArabic ? 'أدخل رقم جوالك' : 'Type your mobile number';
        let typeCode = isArabic ? 'أدخل كود التفعيل المرسل لك' : 'Type the activation code sent to you';
        let textTitle = (this.state.activation_code) ? typeCode : typePhone;
        let requestCode = isArabic ? 'طلب كود التفعيل' : 'Send Activation Code';
        let phoneNumber = isArabic ? 'رقم الجوال' : 'Mobile Number';

        return ( 
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[{textAlign: 'center', fontSize: 15, }, text]}>{title}</Text>
                </View>
                <View style={styles.formWrapper}>
                    <View style={styles.formInner}>
                        <Text style={[{textAlign: 'right', }, text]}>{textTitle}</Text>
                        <View style={styles.formRow}>
                            <QCButton text={requestCode} width={140} isArabic={isArabic} 
                                        onPressed={() => this.getActivationCode()}
                                        color='blue' />
                            <TextInput style={[styles.mobile_input, text]} 
                                        placeholderTextColor={'#e8e8e8'}
                                        onChangeText={(mobile) => this.setState({mobile:mobile})}
                                        value={this.state.mobile} placeholder={phoneNumber} />
                        </View>
                    </View>
                    {this.renderActivation()}
                    {this.renderModal()}
                </View>               
                {loading}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        /*marginTop: 40,
        backgroundColor:'rgb(232, 232, 232)',*/
        padding: 15,
    },   
    header: {
        width: width - 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    formWrapper: {
        width: width - 30,
    },
    formInner: {
        flex: 1,
    },
    formRow: {
        flexDirection: 'row',
        width: width - 30,
        height:45,
        marginTop: 5,
    },
    mobile_input:{
        flex: 1,
        padding:0,
        paddingLeft: 10,
        paddingRight: 10,
        height:35,
        color:'#666',
        backgroundColor:'#FFF',
    },
    modal_container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
        modal_innerContainer: {
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    modal_row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
});
module.exports = MobileLogin;