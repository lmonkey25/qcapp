'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Alert,
    ListView,
    TextInput,
    Picker,
    TouchableHighlight,
} from 'react-native';

import DropDown, {
    Select,
    Option,
    OptionList,
} from 'react-native-selectme'

import { height, width, text, Countries, Validator } from '../utilities/constants';

let QCLoading =  require('../../qcLoading');
let QCButton = require('../sharedControls/qcButton');

let isArabic = true;

class UserNameRegister extends Component {

    constructor(props) {
       super(props);
       this.state = {
            username: '',
            password: '',
            confirmpassword: '',
            conuntrycode: '(null)',
            mobile: '',
            email: '',
            full_name: '',
            isLoading: false,
        }
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    componentWillUnmount() {
    }
    getOptionList() {
        return this.refs['OPTIONLIST'];
    }
    canada(countryId) {
        this.setState({conuntrycode:countryId});
    }
    validateRequired() {
        var msg = Validator.validateRequired(this.state.username,  "Username", isArabic);
        msg += (msg != '' ? ' ' : '') + Validator.validateRequired(this.state.password,  "Password", isArabic);
        msg += (msg != '' ? ' ' : '') + Validator.validateRequired(this.state.confirmpassword,  "Confirm Password", isArabic);
        msg += (msg != '' ? ' ' : '') + Validator.validateRequired(this.state.mobile,  "Mobile", isArabic);
        msg += (msg != '' ? ' ' : '') + Validator.validateRequired(this.state.email,  "Email", isArabic);
        msg += (msg != '' ? ' ' : '') + Validator.validateRequired(this.state.full_name,  "Full name", isArabic);
        
        return msg;
    }
    validatePhone() {
        return Validator.validatePhone(this.state.mobile);
    }
    validateEmail() { 
        return Validator.validateEmail(this.state.email);
    }

    registerUser() {
        var username = (typeof(this.state.username) != 'undefined') ? this.state.username : '';
        var password = (typeof(this.state.password) != 'undefined') ? this.state.password : '';
        var confirm_password = (typeof(this.state.confirmpassword) != 'undefined') ? this.state.confirmpassword : '';
        var conuntrycode = (typeof(this.state.conuntrycode) != 'undefined') ? this.state.conuntrycode : '';
        var mobile = (typeof(this.state.mobile) != 'undefined') ? this.state.mobile : '';
        var email = (typeof(this.state.email) != 'undefined') ? this.state.email : '';
        var full_name = (typeof(this.state.full_name) != 'undefined') ? this.state.full_name : '';

        let errorMsg = this.validateRequired();
        if (errorMsg && errorMsg != '') { 
            Alert.alert("Error", "" + errorMsg + "");
            return;
        }
        else if(!this.validatePhone()) {
            Alert.alert("Error", "Enter a valid Phone Number of 8 digits");
            return;
        }
        else if(!this.validateEmail()) {
            Alert.alert("Error", "Enter a valid email address");
            return;
        }
        else if(password != confirm_password) {
            Alert.alert("Error", "Confirm password did not matched");
            return;
        }

        this.setState({ isLoading: true, });
        //alert(full_name + ' ' + password + ' ' + username + ' ' + email + ' ' + mobile + ' ' + conuntrycode)
        fetch('http://servicestest.qcharity.org/api/User/CreateUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Fname: full_name,
                Lname: '',
                Password : password,
                Username: username,
                Email: email,
                Mobile: mobile,
                ExternalOrganizationId: '',
                CountryId: conuntrycode,
                Sex: 1,
                AccountType: 1,
            }),
        })
        .then((response) => response.json()) 
        .then((responseData) => {
            this.setState({ isLoading: false, });
            //alert(responseData.Result);
            if(JSON.stringify(responseData.Result) != 'false') {
                Alert.alert(
                    "Success",
                    "Message " + JSON.stringify(responseData.Message)
                );
                let title = (isArabic) ? 'طرق الدخول' : 'Login Methods';
                
                this.props.navigator.push({
                    id: 'LoginHome',
                    title: title,
                    passProps: { isArabic: isArabic, activeTab: 3 },
                })
            }
            else {
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
    
    render() {
        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        let title = isArabic ? 'انشاء حساب جديد' : 'Create New Account';
        let username = isArabic ? 'اسم المستخدم' : 'Username';
        let password = isArabic ? 'كلمة السر' : 'Password';
        let passwordConfirm = isArabic ? 'تأكيد كلمة السر' : 'Retype Password';
        let mobile = isArabic ? 'رقم الجوال' : 'Moble Number';
        let email = isArabic ? 'البريد الإلكتروني' : 'Email Address';
        let fullName = isArabic ? 'الاسم بالكامل' : 'Full Name';
        let loginText = isArabic ? 'تسجيل' : 'Register';

        return ( 
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[{textAlign: 'center', fontSize: 15, }, text]}>{title}</Text>
                </View>
                <View style={styles.formWrapper}>
                    <View style={styles.formRow}>
                        <TextInput 
                            style={styles.email_login_input}
                            placeholder={username}
                            onChangeText={(username) => this.setState({username:username})}
                            value={this.state.username} />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            password={true}
                            style={styles.email_login_input}
                            placeholder={password}
                            onChangeText={(password) => this.setState({password:password})}
                            value={this.state.password} />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            password={true}
                            style={styles.email_login_input}
                            placeholder={passwordConfirm}
                            onChangeText={(confirmpassword) => this.setState({confirmpassword:confirmpassword})}
                            value={this.state.confirmpassword} />
                    </View>
                    <View style={styles.formRow}>
                        <Select
                                style={{borderBottomColor:'#535353',borderWidth:0,borderBottomWidth:1,marginTop:-10, marginRight:5}}
                                width={100}
                                height={45}
                                ref="SELECT1"
                                optionListRef={() => this.getOptionList()}
                                onSelect={(country) => this.canada(country)}>
                            <Option value="1" key="+93"><Image source={require('image!flg_1')}/> +93</Option>
                            <Option value="2" key="+970"><Image source={require('image!flg_2')}/> +970</Option>
                            <Option value="3" key="+91"><Image source={require('image!flg_3')}/> +91</Option>
                            <Option value="4" key="+962"><Image source={require('image!flg_4')}/> +962</Option>
                            <Option value="5" key="+967"><Image source={require('image!flg_5')}/> +967</Option>
                            <Option value="6" key="+98"><Image source={require('image!flg_6')}/> +98</Option>
                            <Option value="7" key="+63"><Image source={require('image!flg_7')}/> +63</Option>
                            <Option value="8" key="+880"><Image source={require('image!flg_8')}/> +880</Option>
                            <Option value="10" key="+964"><Image source={require('image!flg_10')}/> +964</Option>
                            <Option value="11" key="+92"><Image source={require('image!flg_11')}/> +92</Option>
                            <Option value="16" key="+963"><Image source={require('image!flg_16')}/> +963</Option>
                            <Option value="17" key="+94"><Image source={require('image!flg_17')}/> +94</Option>
                            <Option value="28" key="+62"><Image source={require('image!flg_28')}/> +62</Option>
                            <Option value="31" key="+996"><Image source={require('image!flg_31')}/> +996</Option>
                            <Option value="35" key="+252"><Image source={require('image!flg_35')}/> +252</Option>
                            <Option value="40" key="+234"><Image source={require('image!flg_40')}/> +234</Option>
                            <Option value="46" key="+229"><Image source={require('image!flg_46')}/> +229</Option>
                            <Option value="47" key="+226"><Image source={require('image!flg_47')}/> +226</Option>
                            <Option value="48" key="+221"><Image source={require('image!flg_48')}/> +221</Option>
                            <Option value="50" key="+233"><Image source={require('image!flg_50')}/> +233</Option>
                            <Option value="52" key="+228"><Image source={require('image!flg_52')}/> +228</Option>
                            <Option value="58" key="+227"><Image source={require('image!flg_58')}/> +227</Option>
                            <Option value="66" key="+33"><Image source={require('image!flg_66')}/> +33</Option>
                            <Option value="542" key="+974"><Image source={require('image!flg_542')}/> +974</Option>
                        </Select>
                        <TextInput
                            style={[styles.email_login_input,]}
                            placeholder={mobile} 
                            onChangeText={(mobile) => this.setState({mobile:mobile})}
                            value={this.state.mobile} />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.email_login_input}
                            placeholder={email}
                            onChangeText={(email) => this.setState({email:email})}
                            value={this.state.email} />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.email_login_input}
                            placeholder={fullName}
                            onChangeText={(full_name) => this.setState({full_name:full_name})}
                            value={this.state.full_name} />
                    </View>                    
                    <View style={styles.formRow}>
                        <QCButton text={loginText} width={120} isArabic={isArabic} 
                                onPressed={(this.state.isLoading ? null : () => this.registerUser())}
                                color='red' />
                    </View>                      
                </View>
                <OptionList overlayStyles={{backgroundColor:'transparent',opacity:1}}  ref="OPTIONLIST"/>   
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
    formRow: {
        width: width - 30,
        height:45,
        flexDirection: 'row',
        marginTop: 5,
    },
    email_login_input: {
        height: 40,
        flex: 1,
        color: '#666',
        textAlign: 'right',
        //backgroundColor: '#FFF',
    },
});
module.exports = UserNameRegister;