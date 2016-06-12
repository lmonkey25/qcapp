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
    TouchableHighlight,
} from 'react-native';

import { height, width, text, Validator, AccountController } from '../utilities/constants';
let QCButton = require('../sharedControls/qcButton');

let QCLoading =  require('../../qcLoading');
//let AccountRecovery = require('./accountRecovery');

let isArabic = true;
let redirectInfo = null;

class UserNameLogin extends Component {

    constructor(props) {
       super(props);
       this.state = {
            username: '',
            password: '',
            isLoading: false,    
        }
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        redirectInfo = this.props.redirectInfo;
    }
    componentWillUnmount() {
    }
    acountRecoveryScreen() {
        this.props.navigator.push({
            id: 'AccountRecovery',
            title: this.props.isArabic? 'لا تستطيع الدخول؟' : 'Can\'t Login?',
            //component: AccountRecovery,
            passProps: { isArabic: this.props.isArabic, },
        });
    }
    onUserLoggedIn(notifyBack) {
        if(this.props.onLogin) {
            this.props.onLogin(notifyBack);
        }
    }

    loginUser() {
        if (!this.state.username) { 
            Alert.alert(
               "Error",
               "Please Fill Username" 
            );
            return;
        }
        if (!this.state.password) { 
            Alert.alert(
               "Error",
               "Please Fill Password" 
            );
            return;
        }
        this.setState({ isLoading: true, });
        let self = this;
        fetch('http://servicestest.qcharity.org/api/User/UserLogin?Username='
                + self.state.username
                + '&Password='
                + self.state.password, {
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json()) 
        .then((responseData) => {
            self.setState({ isLoading: false, });
            if(JSON.stringify(responseData.Result) != 'false') {
                /*Alert.alert(
                    "Success",
                    "Message " + JSON.stringify(responseData.Message) + " with userData:" + JSON.stringify(responseData)
                );*/
                //alert(JSON.stringify(responseData))
                AccountController.loginDonor(responseData.DonorId, redirectInfo, 
                    self.props.navigator, isArabic, (notifyBack) => self.onUserLoggedIn(notifyBack));
            }
            else{
                Alert.alert(
                    "Failure",
                    "Message " + JSON.stringify(responseData.Message)
                );  
            }
        })
        .catch((error) => { 
            self.setState({ isLoading: false, });
            alert('Catch Login Error ' +error); 
        }).done();
    }
    
    render() {
        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        let title = isArabic ? 'تسجيل الدخول بالبريد الالكتروني' : 'Login by Email Address';
        let username = isArabic ? 'اسم المستخدم' : 'Username';
        let password = isArabic ? 'كلمة السر' : 'Password';
        let loginText = isArabic ? 'دخول' : 'Login';
        let forgetInfo = isArabic ? 'لا تستطيع الدخول؟' : 'Can\'t Login?';

        return ( 
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[{textAlign: 'center', fontSize: 15, }, text]}>{title}</Text>
                </View>
                <View style={styles.formWrapper}>
                    <View style={styles.formRow}>
                        <TextInput onChangeText={(username) => this.setState({username:username})}
                            style={styles.email_login_input}
                            placeholder={username} />
                    </View>
                    <View style={styles.formRow}>
                        <TextInput onChangeText={(password) => this.setState({password:password})}
                            password={true}
                            style={styles.email_login_input}
                            placeholder={password} />
                    </View>
                    <View style={styles.formRow}>
                        <QCButton text={loginText} width={120} isArabic={isArabic} 
                                onPressed={() => this.loginUser()}
                                color='red' />
                        <Text style={[{right:0,position:'absolute', color: '#06aebb'}, text]} 
                                onPress={() => this.acountRecoveryScreen()}>{forgetInfo}</Text>
                    </View>
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
    formRow: {
        flex: 1,
        height:45,
        flexDirection: 'row',
        marginTop: 5,
    },
    email_login_input: {
        height: 40,
        width: width - 30,
        color: '#666',
        backgroundColor: '#FFF',
        textAlign: 'center',
    },
    login_btn_container: {
        width: 120,
        height: 45,
    },
    login_button:{
        backgroundColor: '#fe345a',
        width: 120,
        color: '#FFF',
        height: 35,
        marginTop: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    greyFont: {
        color: '#999',
    },
});
module.exports = UserNameLogin;