'use strict';
   
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Alert,
    ListView,
    TouchableHighlight,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

import { height, width, text, AccountController } from '../utilities/constants';

let QCLoading =  require('../../qcLoading');
var windowSize = width;
let isArabic = true;
let redirectInfo = null;

class SocialLogin extends Component {

    constructor(props) {
       super(props);
     this.state = {
            isLoading: false,
            self:this,   
        }
    }
    
    componentDidMount() {
        isArabic = this.props.isArabic;
        redirectInfo = this.props.redirectInfo;
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '205740020219-ti203da4t6e1m4erar23o9ik9rbq9ig7.apps.googleusercontent.com',
            offlineAccess: true
        });
    }
    componentWillUnmount() {
    }
    getUserById(user_id){debugger;
        var self=this;
        fetch('http://servicestest.qcharity.org/api/User/GetDonorById?id='+user_id, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json()) 
        .then((responseData) => { debugger;
            AccountController.loginDonor(responseData.DonorId, redirectInfo, this.props.navigator, isArabic, (notifyBack) => self.onUserLoggedIn(notifyBack));
        })
        .catch((error) => {  self.setState({loader:false}); alert(error); }).done();
    }
    onUserLoggedIn(notifyBack) {
        if(this.props.onLogin) {
            this.props.onLogin(notifyBack);
        }
    }

    responseInfoCallback(error: ?Object, result: ?Object) {debugger;
        if (error) {
            alert('Error posting data: ' + error.toString());
        }
        else {
            Alert.alert("UserData",JSON.stringify(result));
            var ExternalOrganizationId=result.id;
            var name=result.name;
            this.setState({ isLoading: true});
            fetch('http://servicestest.qcharity.org/api/User/CreateUser', {  
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Fname: name,
                    Lname: '',
                    Password : '',
                    Username: '',
                    Email: '',
                    Mobile: '',
                    ExternalOrganizationId:ExternalOrganizationId,
                    CountryId:'(null)',
                    Sex: 1,
                    AccountType: 2,
                })
            })
            .then((response) => response.json()) 
            .then((responseData) => { 
                this.setState({ isLoading:false});
                if(JSON.stringify(responseData.Result)!='false'){
                    this.getUserById(responseData.UserId);
                }
                else{
                    Alert.alert(
                        "Failure",
                        "Message " + JSON.stringify(responseData.Message)
                    );  
                }
            }).catch((error) => { this.setState({isLoading:false});

             alert(error); }).done();
        }
    }

    facebookLogin(){debugger;
        var self=this;
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function(result) {
                if (result.isCancelled) {
                         Alert.alert("Failure",'Login cancelled');
                         return;
                }
                else {
                    var infoRequest = new GraphRequest(
                        '/me',
                        null,
                        self.responseInfoCallback,
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
     
                } 
            },
            function(error) {
                Alert.alert("Error",'Login fail with error: ' + error);
                return;
            }
        )  
    }

    googleSignIn() {

        var self=this;
        GoogleSignin.signIn()
        .then((user) => {
            var ExternalOrganizationId=user.id;
            var name=user.name;
            var email=user.email;
            self.setState({isLoading:true});
                fetch('http://servicestest.qcharity.org/api/User/CreateUser', {  
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      Fname: name,
                      Lname: '',
                      Password : '',
                      Username: '',
                      Email: email,
                      Mobile: '',
                      ExternalOrganizationId:ExternalOrganizationId,
                      CountryId:'(null)',
                      Sex: 1,
                      AccountType: 3,
                    })
                })
                .then((response) => response.json()) 
                .then((responseData) => {
                    self.setState({isLoading:false});

                    if(JSON.stringify(responseData.Result)!='false') {
                        this.getUserById(responseData.UserId);
                    }
                    else {
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }

            }).catch((error) => {  self.setState({isLoading:false}); alert(error); }).done();
          
        })
        .catch((err) => {
            Alert.alert('WRONG SIGNIN',JSON.stringify(err));
        })
        .done();
    }

    googleSignOut() {
        GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
            this.setState({user: null});
        })
        .done();
    }
    
    
    render() {

        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        let title = isArabic ? 'تسجيل الدخول بواسطة' : 'Login by';
        return ( 
            <View>
                <View style={styles.container}>
                    <View style={styles.header}>
                      <Text style={[{textAlign: 'center', fontSize: 15, }, text]}>{title}</Text>
                    </View>
                    <View>
                        <TouchableHighlight onPress={() => this.googleSignIn()} style={{width:280,height:60}}>
                            <Image style={styles.social_image_google} source={require('../../contents/images/google-btn-normal.png')} /> 
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.facebookLogin()} style={{width:280,height:60}}>
                            <Image style={styles.social_image_fb}  source={require('../../contents/images/facebook-btn-normal.png')} /> 
                        </TouchableHighlight>                       
                        {/*<TouchableHighlight style={{width:280,height:60}}>
                            <Image style={styles.social_image_tb} source={require('../../contents/images/twitter-btn-normal.png')} /> 
                        </TouchableHighlight>*/}
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
    social_image_google: {        
        marginLeft: 30,
        marginTop: 15,
        marginBottom: 15,
        width: 250,
        height: 40,
    },
    social_image_fb: {       
        marginLeft: 30,
        marginTop: 15,
        marginBottom: 15,
        width: 250,
        height: 40,
    },
    social_image_tb: {       
        marginLeft: 30,
        marginTop: 15,
        marginBottom: 15,
        width: 250,
        height: 40,
    },
});
module.exports = SocialLogin;