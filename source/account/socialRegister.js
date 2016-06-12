'use strict';
    
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Alert,
    View,
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
import { height, width, text, AccountController } from '../utilities/constants'

let isArabic = true;
let redirectInfo = null;
let QCLoading =  require('../../qcLoading');

class SocialRegister extends Component {

    constructor(props) {
       super(props);
       this.state = {
            isLoading: false,    
        }
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        redirectInfo = this.props.redirectInfo;
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '205740020219-ti203da4t6e1m4erar23o9ik9rbq9ig7.apps.googleusercontent.com',
            iosClientId: '1042076430159-ugeruqed90uh7i4sofq5nm0abgskbkfr.apps.googleusercontent.com',
            offlineAccess: true
        });
    }
    componentWillUnmount() {
    }

    getUserById(user_id){
        var self=this;
        fetch('http://servicestest.qcharity.org/api/User/GetDonorById?id='+user_id, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json()) 
        .then((responseData) => { 
            AccountController.loginDonor(responseData.DonorId, redirectInfo, this.props.navigator, isArabic);
        })
        .catch((error) => {  self.setState({loader:false}); alert(error); }).done();
    }
    responseInfoCallback(error: ?Object, result: ?Object) {
        if (error) {
            alert('Error posting data: ' + error.toString());
        }
        else {
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
                    ExternalOrganizationId: ExternalOrganizationId,
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
            }).catch((error) => { this.setState({isLoading:false}); alert(error); }).done();
        }
    }
    facebookRegister(){
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
        );   
    }
    googleSignUp() {
        GoogleSignin.signIn()
        .then((user) => {
            var ExternalOrganizationId=user.id;
            var name=user.name;
            var email=user.email;
            this.setState({ isLoading:true});
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
                  ExternalOrganizationId: ExternalOrganizationId,
                  CountryId:'(null)',
                  Sex: 1,
                  AccountType: 3,
                })
            })
            .then((response) => response.json()) 
            .then((responseData) => {
                this.setState({isLoading:false});
                if(JSON.stringify(responseData.Result)!='false'){
                    this.getUserById(responseData.UserId);
                }
                else{
                    Alert.alert(
                        "Failure",
                        "Message " + JSON.stringify(responseData.Message)
                    );  
                }
            }).catch((error) => { this.setState({isLoading:false}); alert(error); }).done();
        })
        .catch((err) => {
            Alert.alert('WRONG SIGNIN',JSON.stringify(err));
        }).done();
    }
    
    render() {

        let loading = null;

        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        let title = isArabic ? 'انشاء حساب جديد بواسطة' : 'Create New Account by';
        return ( 
            <View>
                <View style={styles.container}>
                    <View style={styles.header}>
                      <Text style={[{textAlign: 'center', fontSize: 15, }, text]}>{title}</Text>
                    </View>
                    <View>
                        <TouchableHighlight onPress={() => this.googleSignUp()} style={{width:280,height:60}}>
                            <Image style={styles.social_image_google} source={require('../../contents/images/google-btn-normal.png')} /> 
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.facebookRegister()} style={{width:280,height:60}}>
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
module.exports = SocialRegister;