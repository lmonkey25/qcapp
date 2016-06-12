'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Alert,
    TextInput,
    TouchableHighlight,
} from 'react-native';

import Radio from 'react-native-simple-radio-button';
import { height, width, text } from '../utilities/constants';
var windowSize = width;
let QCLoading =  require('../../qcLoading');
let QCButton = require('../sharedControls/qcButton');

let isArabic = true;
//let AccountRecovery = require('./accountRecovery');

class AccountRecovery extends Component {

    constructor(props) {
       super(props);
       this.state = {
            username: '',
            password: '',
            email: '',
            mobile: '',
            recovery_value: this.props.recovery_value,
            recover_by: 0,
            isLoading: false,    
        }
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    componentWillUnmount() {
    }
    selectedMethodChanged(methodId) {
        this.setState({ recovery_value: methodId, });
        if(this.props.onSelectMethod) {
            this.props.onSelectMethod(methodId);
        }
    }
    validateEmail() { 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return re.test(this.state.email); 
    }
    validatePhone() {
        var re=/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        return re.test(this.state.mobile);
    }
    recoverAccount() {
        if(this.state.recovery_value == 0){ //recover username
            if(this.state.recover_by == 0){ // recover by email
                if(!this.state.email) {
                    Alert.alert('Error', "Please enter email address");
                    return;
                }
                else if(!this.validateEmail()) {
                    Alert.alert('Error', "Please Enter a valid email address");
                }
                else if(!this.state.password) {
                    Alert.alert('Error', "Please enter password");
                    return;
                }
                var postdata={"email":this.state.email,'password':this.state.password};
                this.setState({ isLoading:true});
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=1&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },
                })
                .then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        ); 
                    }
                }).catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
            else if(this.state.recover_by == 1) { //recover by mobile
                if(!this.state.mobile) {
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone()) {
                    Alert.alert('Error', "Please Enter a valid 10 digit mobile number");
                }
                else if(!this.state.password) {
                    Alert.alert('Error', "Please enter password");
                    return;
                }
                this.setState({isLoading:true});
                var postdata={"mobile":this.state.mobile,'password':this.state.password};

                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=2&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },                    
                })
                .then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                }).catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
        }
        else if(this.state.recovery_value == 1) { // recover password
            if(this.state.recover_by == 0) { // recover by email
                if(!this.state.email) {
                    Alert.alert('Error', "Please enter email address");
                    return;
                }
                else if(!this.validateEmail()) {
                    Alert.alert('Error', "Please Enter a valid email address");
                }
                else if(!this.state.username){
                    Alert.alert('Error', "Please enter username");
                    return;
                }
                this.setState({isLoading:true});
                var postdata={"email":this.state.email,'username':this.state.username};
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=1&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },                    
                }).then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        this.setState({isLoading:false});
                         Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                }).catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
            else if(this.state.recover_by == 1) { //recover by mobile
                if(!this.state.mobile){
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone()) {
                    Alert.alert('Error',"Please Enter a valid 10 digit mobile number");
                }
                else if(!this.state.username) {
                    Alert.alert('Error',"Please enter username");
                    return;
                }
                this.setState({isLoading:true});
                var postdata={"mobile":this.state.mobile,'username':this.state.username};
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=2&Data='+postdata, {  
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json', 
                          'Content-Type': 'application/json',
                        },
                        
                }).then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                }) .catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
        }
        else if(this.state.recovery_value == 2) { // recover username & mobile
            if(this.state.email) { // recover by email
                if(!this.state.email) {
                    Alert.alert('Error',"Please enter email address");
                    return;
                }
                else if(!this.validateEmail()) {
                    Alert.alert('Error',"Please Enter a valid email address");
                }                
                this.setState({isLoading:true});
                var postdata={"mobile":this.state.mobile};
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=1&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },                    
                }).then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }else{
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                }).catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
            else if(this.state.mobile) { //recover by mobile
                if(!this.state.mobile) {
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone()) {
                    Alert.alert('Error', "Please Enter a valid 10 digit mobile number");
                }
                this.setState({isLoading:true});
                var postdata={"mobile":this.state.mobile};
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=2&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },
                    
                }).then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                }).catch((error) => {  this.setState({isLoading:false}); alert(error); }).done();
            }
        }
    }
    
    render() {
        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }

        let screen = null, header = null, subHeader = null;
        let title = ''; 
        let subTitleText = null;
        if(isArabic) {
            if(this.props.screen == 'accountrecovery') {
                title = 'يرجى اختيار أحد الإختيارات';
            }
            else if(this.props.screen == 'username') {
                title = 'اختار طريقة استعادة اسم المستخدم';
                subTitleText = 'أدخل كلمة المرور';
            }
            else if(this.props.screen == 'password') {
                title = 'اختار طريقة استعادة كلمة السر';
                subTitleText = 'أدخل اسم المستخدم';
            }
            else if(this.props.screen == 'usernamepassword') {
                title = 'اختار طريقة استعادة اسم المستخدم وكلمة السر';
            }
        }
        else
        {
            if(this.props.screen == 'accountrecovery') {
                title = 'Please Select an Option';
            }
            else if(this.props.screen == 'username') {
                title = 'Select Username Recovery Method';
                subTitleText = 'Type Your Password';
            }
            else if(this.props.screen == 'password') {
                title = 'Select Password Recovery Method';
                subTitleText = 'Type Your Username';
            }
            else if(this.props.screen == 'usernamepassword') {
                title = 'Select Username & Password Recovery Method';
            }
        }
        let usernameForget = isArabic ? 'نسيت اسم المستخدم' : 'Forgot Username';
        let passwordForget = isArabic ? 'نسيت كلمة السر' : 'Forgot Password';
        let bothForget = usernameForget + (isArabic ? ' وكلمة السر' : ' & Password');
        let byEmail = isArabic ? 'البريد الالكتروني' : 'by Email';
        let byMobile = isArabic ? 'ارقم الجوال' : 'by Mobile';
        let password = isArabic ? 'كلمة السر' : 'Password';
        let username = isArabic ? 'اسم المستخدم' : 'Username';
        let contact = (isArabic ? 'أو يمكنك التواصل مع خدمة العملاء على الرقم الآتي ' : 'Or you can contact customer service on this Number ') + '22334455';

        header = (
            <View style={styles.header}>
                <Text style={[{textAlign: 'right', fontSize: 15, }, text]}>{title}</Text>
            </View>
        );
        subHeader = (
            <View style={styles.header, {marginTop: 20,}}>
                <Text style={[{textAlign: 'right', fontSize: 13, }, text]}>{subTitleText}</Text>
            </View>
        );
        if(this.props.screen == 'accountrecovery') {
            screen = (
                <View style={{paddingTop:10}}>
                    <Radio style={{flex: 1, alignItems: 'flex-end'}}
                        animation={true}
                        radio_props={[
                                       {label: '' + usernameForget + '', value: 0 },
                                       {label: '' + passwordForget + '', value: 1 },
                                       {label: '' + bothForget, value: 2 },
                        ]}
                        initial={this.state.recovery_value}
                        buttonColor={'#000'}
                        onPress={(value) => {this.selectedMethodChanged(value);}} />
                </View>
            );
        }
        else if(this.props.screen == 'username') {
            screen = (
                <View style={{paddingTop:10}}>
                    <View style={styles.formRow}>
                        <View style={{paddingRight:0, flex: 1,}}>
                            <TextInput style={{height: 30,}} 
                                        placeholder={byEmail} 
                                        onChangeText={(email) => this.setState({email:email})}
                                        value={this.state.email} />
                            <TextInput style={{height: 30,}}  onChangeText={(mobile) => this.setState({mobile:mobile})}
                                        value={this.state.mobile}  placeholder={byMobile} />
                        </View>
                        <View style={{width: 50,}}>
                            <Radio 
                                animation={true}
                                radio_props={[
                                    {label: '', value: 0 },
                                    {label: '', value: 1 },
                                ]}
                                initial={this.state.recover_by}
                                buttonColor={'#000'}
                                onPress={(value) => {this.setState({recover_by:value})}} />
                        </View>
                    </View>
                    {subHeader}
                    <View style={[styles.mobile_input,{width: width - 30}]}>
                        <TextInput  onChangeText={(password) => this.setState({password:password})}
                                    value={this.state.password} placeholder={password} />
                    </View>
                </View>
            );
        }
        else if(this.props.screen == 'password') {
            screen = (
                <View style={{paddingTop:10}}>
                    <View style={styles.formRow}>
                        <View style={{paddingRight:0, flex: 1,}}>
                            <TextInput style={{height: 30,}}  
                                        onChangeText={(email) => this.setState({email:email})}
                                        value={this.state.email} placeholder={byEmail} />
                            <TextInput style={{height: 30,}} onChangeText={(mobile) => this.setState({mobile:mobile})}
                                        value={this.state.mobile} placeholder={byMobile} />
                        </View>
                        <View style={{width: 50,}}>
                            <Radio 
                                animation={true}
                                radio_props={[
                                                {label: '', value: 0 },
                                                {label: '', value: 1 },
                                              ]}
                                initial={this.state.recover_by}
                                buttonColor={'#000'}
                                onPress={(value) => {this.setState({recover_by:value})}} />
                        </View>
                    </View>
                    {subHeader}
                    <View style={[styles.mobile_input,{width: width - 30}]}>
                        <TextInput onChangeText={(username) => this.setState({username:username})}
                                    value={this.state.username} placeholder={username} />
                    </View>
                </View>
            );
        }
        else if(this.props.screen == 'usernamepassword') {
            screen = (
                <View style={{paddingTop:10}}>
                    <View style={styles.formRow}>
                        <View style={{paddingRight:0, flex: 1,}}>
                            <TextInput style={{height: 30,}}  
                                        onChangeText={(email) => this.setState({email:email})}
                                        value={this.state.email} placeholder={byEmail} />
                            <TextInput style={{height: 30,}} onChangeText={(mobile) => this.setState({mobile:mobile})}
                                        value={this.state.mobile} placeholder={byMobile} />
                        </View>
                        <View style={{width: 50,}}>
                            <Radio 
                                animation={true}
                                radio_props={[
                                                {label: '', value: 0 },
                                                {label: '', value: 1 },
                                              ]}
                                initial={this.state.recover_by}
                                buttonColor={'#000'}
                                onPress={(value) => {this.setState({recover_by:value})}} />
                        </View>
                    </View>
                    <View style={[styles.mobile_input,{width: width - 30, marginTop: 20}]}>
                        <Text style={[styles.mobile_input, text, {color: '#06aebb'}]}>
                                {contact}</Text>
                    </View>
                </View>
                /*<View style={{padding:20}}>
                    <Text style={[styles.mobile_input,{position:'absolute',top:20,left:15}]}>
                        Select Method to recover username & password</Text>
                    <TextInput style={{marginTop:10}} onChangeText={(email) => this.setState({email:email})}
                                value={this.state.email} placeholder="By Email" />
                    <TextInput onChangeText={(mobile) => this.setState({mobile:mobile})}
                                value={this.state.mobile} placeholder="By Mobile" />
                    <Text style={[styles.mobile_input,{position:'absolute',top:145,left:15}]}>
                        {contact}</Text>
                </View>*/
            );
        }
        return ( 
            <View style={styles.container}>
                {header}
                {screen}        
                {loading}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'rgb(232, 232, 232)',
        //shadowColor: 'rgb(255,255,255)',
        padding: 15,
    },   
    header: {
        width: width - 30,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 40,
    },
    formRow: {
        width: width - 30,
        flexDirection: 'row',
        marginTop: 5,
    },
    container_top_bar: {
        marginTop: 20,
        height: 40,
    },
    body: {
        backgroundColor: 'rgb(82, 89, 95)',
        shadowColor: 'rgb(255,255,255)',
    },
    whiteFont: {
        color: '#FFF',
    },
    left_button:{
        position: 'absolute',
        left: 30,
        top: 5,
        right: 0,
        height: 30,
        fontSize: 14,
    },
    right_button:{
        position: 'absolute',
        top: 5,
        right: 30,
        height: 30,
        fontSize: 14,
    },
});
module.exports = AccountRecovery;