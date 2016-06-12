'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    AsyncStorage,
    Text,
    View,
    Image,
    Alert,
    Navigator,
    TouchableOpacity,
    TouchableHighlight,
    BackAndroid,
} from 'react-native';

import { height, width, text, AccountController, } from './source/utilities/constants';
import Menu, { 
    MenuContext,
} from 'react-native-menu';
var KeyboardSpacer = require('react-native-keyboard-spacer');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
    }
  return false;
});

var STORAGE_KEY = '@QcApploginData:key';
let QCTabbar = require('./qcTabbar');
let QCMenu = require('./source/sharedControls/qcMenu');
//import UserManager from './source/utilities/userManager';
var QCLoading =  require('./qcLoading');
let QCHome = require('./qcHome');
//let InfoModal = require('./source/qcModals/infoModal');

let CampaignCauses = require('./source/campaigns/campaignCauses');
let CauseDetails = require('./source/campaigns/causeDetails');
let Categories = require('./source/categories/categoryList');
let CategoryItems = require('./source/categories/categoryItems');

let MainSearch = require('./source/search/mainSearch');
let SearchResult = require('./source/search/searchResult');

let LoginHome = require('./source/account/loginHome');
let RegisterHome = require('./source/account/registerHome');
let AccountRecovery = require('./source/account/accountRecovery');

let Contact = require('./source/contact/index');
let MyBasket = require('./source/basket/myBasket');
let MyProfile = require('./source/profile/myProfile');
let Kafalaty = require('./source/profile/kafalaty');
let FastingHome = require('./source/breakingFast');
let MySponsrshipDetails = require('./source/profile/mySponsrshipDetails');
let MyProjects = require('./source/profile/myProjects');
let ProjectDetails = require('./source/projects/projectDetails');
let Notifications = require('./source/profile/notifications');
let OldDonations = require('./source/profile/oldDonations');

let CharityCards = require('./source/cards/cardList');
let CouponList = require('./source/cards/couponList');

let PostsMain = require('./source/charityPoints/postsMain');
let CreateGroup = require('./source/charityPoints/CreateGroup');
let GroupDetails = require('./source/charityPoints/GroupDetails');
let AddMember = require('./source/charityPoints/AddMember');
let MyGroups = require('./source/charityPoints/MyGroups');
let GroupNotifications = require('./source/charityPoints/GroupNotifications');
let GroupInvitationResponse = require('./source/charityPoints/GroupInvitationResponse');
let PostShare = require('./source/charityPoints/PostShare');
let PostShareItem = require('./source/charityPoints/PostShareItem');
let PostDetails = require('./source/charityPoints/PostDetails');

let TroublesMain = require('./source/troublesRelief/troublesMain');
let CollectorRequest = require('./source/collectors/collectorRequest');
let ReviewScreen = require('./source/collectors/reviewScreen');
let KafalatHome = require('./source/kafalat/kafalatHome');

//let PaymentMethods = require('./source/qcModals/paymentMethods');
let PaymentMobile = require('./source/payments/paymentMobile');
let PaymentMobileVerify = require('./source/payments/paymentMobileVerify');
let PaymentVisa = require('./source/payments/paymentVisa');

let Language = require('./language/language');
let isAr = Language.isArabic();
let LanguageActions = require('./globalActions/languageActions');

let basketSelectedItems = [];
class QCAndroidFull extends Component {
    constructor(props) {
        super(props);
        this.navigatorObj = null;
        this.state = {
            currentLanguageIsArabic: isAr,
            currentTabIndex: 0,
            recoveryMethodId: 0,
            //basketSelectedItems: [],
            isLoading: false,
            refresh: false,
            currentUser: null,

            isMainSearch: true,
            currentDonationTypeId: 1, //مساهمات
            currentCampaignId: 0,
        };
    }
    componentDidMount() {
        // We can use the public context API to open/close/toggle the menu.
        //setInterval(() => {
        //  this.refs.MenuContext.toggleMenu('menu1');
        //}, 2000);
    }
    componentWillMount() {//alert(Object.keys(UserManager)[0])
        //alert(UserManager.getCurrentUser())
        this.setUserLogedIn();
        //let currentUser = UserManager.getCurrentUser();

        //alert(currentUser);
           
    }
    userLoggedout() {
        this.setState({currentUser: null, }); 
    }
    userLoggedIn(notifyBack) {
        this.setUserLogedIn(notifyBack);
    }
    setUserLogedIn(notifyBack) {
        let self = this;
        AsyncStorage.getItem(STORAGE_KEY, (error, result) => {
            if(error && error != null) {
                console.log(error);
            }
            if(result && result != null) {
                self.setState({currentUser: JSON.parse(result), });
                if(notifyBack) {
                    notifyBack();
                }
            }
            else if (self.state.currentUser != null) {
                 self.setState({currentUser: null, });
            }
        }).done();
    }
    setSearchParams(campaignId, typeId, isMainSearch) {
        this.setState({
            isMainSearch: isMainSearch && isMainSearch != null ? isMainSearch : false,
            currentCampaignId: campaignId, 
            currentDonationTypeId: typeId, 
        }); 
    }

    goNotifications(navigator) {
        navigator.push({
            id: 'Notifications',
            title: this.state.currentLanguageIsArabic? 'الإشعارات' : 'Notifications',
            component: Notifications,
            passProps: { isArabic: this.state.currentLanguageIsArabic, },
        });
    }
    goMainSearch(navigator) {
        navigator.push({
            id: 'MainSearch',
            title: this.state.currentLanguageIsArabic? 'البحث' : 'Search',
            component: MainSearch,
            passProps: { 
                isArabic: this.state.currentLanguageIsArabic,
                isMainSearch: this.state.isMainSearch,
                campaignId: this.state.currentCampaignId,
                typeId: this.state.currentDonationTypeId, 
            },
        });
    }
    goRegisterHome(navigator) {
        navigator.push({
            id: 'RegisterHome',
            title: this.state.currentLanguageIsArabic? 'طرق انشاء حساب جديد' : 'Registration Methods',
            component: RegisterHome,
            passProps: { isArabic: this.state.currentLanguageIsArabic, },
        });
    }
    goNextRecovery(navigator) {
        let id, title;
        switch(this.state.recoveryMethodId) {
            case 1:
                id = 'RecoverPassword';
                title = this.state.currentLanguageIsArabic? 'إستعادة كلمة السر' : 'Password Recovery';
                break;
            case 2:
                id = 'RecoverLogin';
                title = this.state.currentLanguageIsArabic? 'إستعادة اسم المستخدم و كلمة السر' : 'Login Info Recovery';
                break;
            default:
                id = 'RecoverUserName';
                title = this.state.currentLanguageIsArabic? 'إستعادة اسم المستخدم' : 'Username Recovery';
                break;
        }
        navigator.push({
            id: id,
            title: title,
            component: AccountRecovery,
            passProps: { isArabic: this.state.currentLanguageIsArabic, },
        });
    }
    sendRecovery(navigator) {
        let username = this.props.recoveryInfo_username, 
            password = this.props.recoveryInfo_password, 
            email = this.props.recoveryInfo_email, 
            mobile = this.props.recoveryInfo_mobile;

        let recoveryMethodId = this.state.recoveryMethodId, 
            recoveryInfo_MethodId = this.props.recoveryInfo_MethodId;

        if(recoveryMethodId == 0) {
            //recover username
            if(recoveryInfo_MethodId == 0) {
                // recover by email
                if(!email || email == '') {
                    Alert.alert('Error', "Please enter email address");
                    return;
                }
                else if(!this.validateEmail(email)) {
                    Alert.alert('Error', "Please Enter a valid email address");
                }
                else if(!password || password == '') {
                    Alert.alert('Error', "Please enter password");
                    return;
                }
                var postdata={"email":email,'password':password};
                //this.setState({ isLoading:true});
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
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        ); 
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
            else if(recoveryInfo_MethodId == 1) {
                //recover by mobile
                if(!mobile || mobile == '') {
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone(mobile)) {
                    Alert.alert('Error', "Please Enter a valid 10 digit mobile number");
                }
                else if(!password || password == '') {
                    Alert.alert('Error', "Please enter password");
                    return;
                }

                //this.setState({isLoading:true});
                var postdata={"mobile":mobile,'password':password};

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
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
        }
        else if(recoveryMethodId == 1) {
            // recover password
            if(recoveryInfo_MethodId == 0) {
                // recover by email
                if(!email || email == '') {
                    Alert.alert('Error', "Please enter email address");
                    return;
                }
                else if(!this.validateEmail(email)) {
                    Alert.alert('Error', "Please Enter a valid email address");
                }
                else if(!username || username == ''){
                    Alert.alert('Error', "Please enter username");
                    return;
                }

                //this.setState({isLoading:true});
                var postdata={"email":email,'username':username};
                fetch('http://servicestest.qcharity.org/api/User/ForgetPassword?Type=1&Data='+postdata, {  
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json',
                    },                    
                }).then((response) => response.json()) 
                .then((responseData) => { 
                    if(JSON.stringify(responseData.Result)!='false'){
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                         Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
            else if(recoveryInfo_MethodId == 1) {
                //recover by mobile
                if(!mobile || mobile == ''){
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone(mobile)) {
                    Alert.alert('Error',"Please Enter a valid 10 digit mobile number");
                }
                else if(!username || username == '') {
                    Alert.alert('Error',"Please enter username");
                    return;
                }

                //this.setState({isLoading:true});
                var postdata={"mobile":mobile,'username':username};
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
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
        }
        else if(recoveryMethodId == 2) {
            // recover username & password
            if(email) { 
                // recover by email
                if(!email || email == '') {
                    Alert.alert('Error',"Please enter email address");
                    return;
                }
                else if(!this.validateEmail(email)) {
                    Alert.alert('Error',"Please Enter a valid email address");
                }
                //this.setState({isLoading:true});
                var postdata={"email":email};
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
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
            else if(mobile) {
                //recover by mobile
                if(!mobile || mobile == '') {
                    Alert.alert('Error', "Please enter mobile");
                    return;
                }
                else if(!this.validatePhone(mobile)) {
                    Alert.alert('Error', "Please Enter a valid 10 digit mobile number");
                }
                //this.setState({isLoading:true});
                var postdata={"mobile":mobile};
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
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Success",
                            "Message " + JSON.stringify(responseData)
                        );
                    }
                    else{
                        //this.setState({isLoading:false});
                        Alert.alert(
                            "Failure",
                            "Message " + JSON.stringify(responseData)
                        );  
                    }
                })
                .catch((error) => {  //this.setState({isLoading:false}); 
                    alert(error); 
                }).done();
            }
        }
    }
    deleteBasket(navigator) {
        //alert(basketSelectedItems);
        if(basketSelectedItems.length > 0) {
            let self = this;
            this.setState({isLoading: true,});

            let REQUEST_URL = 'http://servicestest.qcharity.org/api/Basket/Delete?MobileDBId=0&ListIds=' 
                              + basketSelectedItems + '';
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.Result) {

                    basketSelectedItems = [];
                    self.setState({
                        refresh: true,                        
                    });
                    //navigator.replace({id: 'MyBasket', title: 'السلة',});
                }

            })
            .done();
        }
    }
    selectedBasketItemsChanged(items) {
        basketSelectedItems = items;
        //this.setState({basketSelectedItems: items});
    }
    closeMenu() {
        this.refs.MenuContext.closeMenu();
    }

    validateEmail(email) { 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return re.test(email); 
    }
    validatePhone(phone) {
        var re=/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        return re.test(phone);
    }
    recoveryMethodChanged(methodId) {
        this.state.recoveryMethodId = methodId;
    }
    recoverInfoMethodChanged(methodId, username, password, email, mobile) {
        this.props.recoveryInfo_MethodId = methodId;
        this.props.recoveryInfo_username = username;
        this.props.recoveryInfo_password = password;
        this.props.recoveryInfo_email = email;
        this.props.recoveryInfo_mobile = mobile;
    }

    getNavigationBarRouteMapper(oldoldStatusBarHeight, navBarHeight) {
        let self = this;

        isAr = this.state.currentLanguageIsArabic;
        let menu = <Image source={require('image!ic_menu')} style={[styles.toolbar, styles.toolbarIcon]} />
        let logo = <Image source={require('image!ic_logo')} style={[styles.toolbarLogo]} />
        let langIcon = isAr ? require('image!ic_en') : require('image!ic_ar')
        let lang = <Image source={langIcon} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
        let search = <Image source={require('image!ic_search')} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
        
        let notification = <Image source={require('image!ic_notifications')} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
        let badge = (<View style={styles.badge}><Text style={[styles.badgeText, text]}>{5}</Text></View>);

        let leftArrow = <Image source={require('image!ic_notificationlabel')} />
        let rightArrow = <Image source={require('image!ic_info')} />

        let that = this;
        let iconsGroupClutureStyle = isAr ? {marginLeft:15,} : {marginRight:15,};
        
        

        let notificationIcon = (
            <TouchableOpacity key={1} 
                style={[styles.toolbarIconWrapper]}
                onPress={() => {this.goNotifications(self.navigatorObj);}}
                underlayColor={'transparent'}>
                {notification}
                {badge}
            </TouchableOpacity>
        );
        let searchIcon = (
            <TouchableOpacity key={2} 
                style={[styles.toolbarIconWrapper]}
                onPress={() => {this.goMainSearch(self.navigatorObj);}}
                underlayColor={'transparent'}>
                {search}
            </TouchableOpacity>
        );
        let languageIcon = (
            <TouchableOpacity key={3} 
                style={[styles.toolbarIconWrapper]}
                onPress={() => that.onLanguageChange()}
                underlayColor={'transparent'}>
                {lang}
            </TouchableOpacity>
        );
        let content = [];
        if(isAr) {
            content.push(notificationIcon);
            content.push(searchIcon);
            content.push(languageIcon);
        }
        else {
            content.push(languageIcon);
            content.push(searchIcon);
            content.push(notificationIcon);
        }
        let iconsGroup = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                {content}
            </View>
        );
        //alert(this.navigatorObj);
        //alert(navigator.push)
        let menuSideClutureStyle = isAr ? {marginRight:15, } : {marginLeft:15,};
        let menuSideClutureStyle2 = isAr ? {marginRight:-5, } : {marginLeft:15,};
        //let registerText = isAr ? 'حساب جديد' : 'Register';
        //let loginText = isAr ? 'تسجيل دخول' : 'Login';
        /*let menuSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, menuSideClutureStyle2]}>
                <QCMenu isArabic={isAr} navigator={navigator} 
                        currentUser={this.state.currentUser}
                        onOptionSelected={() => this.closeMenu()}
                        onLoggedOut={() => this.userLoggedout()} />
            </View>
        );*/

        let marginLeft = -72 - 40;

        let searchSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                {searchIcon}
            </View>
        );

        let cardSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                <TouchableOpacity 
                        style={[styles.toolbarIconWrapper]}
                        onPress={() => {return null;}}
                        underlayColor={'transparent'}>
                    <Image source={require('image!info')} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
                </TouchableOpacity>
            </View>
        );

        let registerSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                <TouchableOpacity 
                        style={[styles.toolbarIconWrapper]}
                        onPress={() => {this.goRegisterHome(navigator);}}
                        underlayColor={'transparent'}>
                    <Image source={require('image!register')} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
                </TouchableOpacity>
            </View>
        );

        let recoveryNexSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                <TouchableOpacity 
                        style={[styles.toolbarIconWrapper]}
                        onPress={() => {this.goNextRecovery(navigator);}}
                        underlayColor={'transparent'}>
                    <Text style={[{color: 'white'}, text]}>{this.state.currentLanguageIsArabic? 'التالي' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        );

        let recoverySendSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                <TouchableOpacity 
                        style={[styles.toolbarIconWrapper]}
                        onPress={() => {this.sendRecovery(navigator);}}
                        underlayColor={'transparent'}>
                    <Text style={[{color: 'white'}, text]}>{this.state.currentLanguageIsArabic? 'إرسال' : 'Send'}</Text>
                </TouchableOpacity>
            </View>
        );        

        let deleteBasketSide = (
            <View style={[{flexDirection: 'row', height:navBarHeight,}, iconsGroupClutureStyle]}>
                <TouchableOpacity 
                        style={[styles.toolbarIconWrapper]}
                        onPress={() => {this.deleteBasket(navigator);}}
                        underlayColor={'transparent'}>
                    <Image source={require('image!delete')} style={[styles.toolbar, styles.toolbarIcon, styles.toolbarLeftIcon,]} />
                </TouchableOpacity>
            </View>
        );

        var windowWidth = width;
        
        return ({
            LeftButton: function(route, navigator, index, navState, classObj) {
                self.navigatorObj = navigator;
                _navigator = navigator;

                let menuSide = (
                    <View style={[{flexDirection: 'row', height:navBarHeight,}, menuSideClutureStyle2]}>
                        <QCMenu isArabic={isAr} navigator={navigator} 
                                currentUser={self.state.currentUser}
                                onOptionSelected={() => self.closeMenu()}
                                onLoggedOut={() => self.userLoggedout()} />
                    </View>
                );
                let backArrowEn = (
                    <TouchableOpacity 
                          style={[menuSideClutureStyle, styles.toolbarIconWrapper, ]}
                          onPress={() => {navigator.pop()}}
                          underlayColor={'transparent'}>
                        <Image source={require('image!ic_nav')} />
                    </TouchableOpacity>
                );
                if (index === 0 || (route.id == 'QCHome')) {
                    if(isAr) {
                        return (
                            iconsGroup
                        );
                    }
                    return (
                        menuSide
                    );
                }
                else {
                    if(isAr) {
                        if(route.id == 'CharityCards') {
                            return (
                                cardSide
                            );
                        }
                        else if(route.id == 'LoginHome') {
                            return (
                                registerSide
                            );
                        }
                        else if(route.id == 'AccountRecovery') {
                            return (
                                recoveryNexSide
                            );
                        }
                        else if(route.id == 'RecoverUserName' ||
                                route.id == 'RecoverPassword' ||
                                route.id == 'RecoverLogin') {
                            return (
                                recoverySendSide
                            );
                        }
                        else if(route.id == 'MyBasket') {
                            return (deleteBasketSide);
                        }
                        return (
                            searchSide
                        );
                    }
                    return (
                        backArrowEn
                    );
                }

                var previousRoute = navState.routeStack[index - 1];
                return (
                    <TouchableOpacity 
                          style={{marginTop: -oldoldStatusBarHeight, height: navBarHeight,
                              alignItems: 'center',
                              justifyContent: 'center', 
                              marginLeft: windowWidth - 26,}}
                          onPress={() => {navigator.pop()}}
                          underlayColor={'transparent'}>
                        <Image source={require('image!ic_notificationlabel')} />
                    </TouchableOpacity>
                );
            },

            RightButton: function(route, navigator, index, navState) {
                let menuSide = (
                    <View style={[{flexDirection: 'row', height:navBarHeight,}, menuSideClutureStyle2]}>
                        <QCMenu isArabic={isAr} navigator={navigator} 
                                currentUser={self.state.currentUser}
                                onOptionSelected={() => self.closeMenu()}
                                onLoggedOut={() => self.userLoggedout()} />
                    </View>
                );
                let backArrowAr = (
                    <TouchableOpacity 
                          style={[menuSideClutureStyle, styles.toolbarIconWrapper, ]}
                          onPress={() => {navigator.pop()}}
                          underlayColor={'transparent'}>
                        <Image source={require('image!ic_nav_ar')} style={{width: 30, resizeMode: 'contain',}} />
                    </TouchableOpacity>
                );

                if (index === 0 || (route.id == 'QCHome')) {
                    if(isAr) {
                        return (
                            menuSide
                        );
                    }
                    return (
                        iconsGroup
                    );
                }
                else {//if(route.id == 'CampaignCauses') {
                    if(isAr) {
                        return (
                            backArrowAr
                        );
                    }
                    else if(route.id == 'CharityCards') {
                        return (
                            cardSide
                        );
                    }
                    else if(route.id == 'LoginHome') {
                        return (
                            registerSide
                        );
                    }
                    else if(route.id == 'AccountRecovery') {
                        return (
                            recoveryNexSide
                        );
                    }
                    else if(route.id == 'RecoverUserName' ||
                            route.id == 'RecoverPassword' ||
                            route.id == 'RecoverLogin') {
                        return (
                            recoverySendSide
                        );
                    }
                    else if(route.id == 'MyBasket') {
                        return (deleteBasketSide);
                    }
                    return (
                        searchIcon
                    );
                }

                return (
                    <TouchableOpacity 
                        style={{marginTop: -oldoldStatusBarHeight, height: navBarHeight,
                            alignItems: 'center',
                            justifyContent: 'center', 
                            marginRight: 13,}}
                        onPress={() =>  {return null;}}
                        underlayColor={'transparent'}>
                      <Image source={require('image!ic_info')} />
                    </TouchableOpacity>
                );
            },

            Title: function(route, navigator, index, navState) {
                if (index === 0 || (route.id == 'QCHome')) {
                    return (
                        <View style={[styles.toolbarIconWrapper, {flexDirection: 'row',}, !isAr && {marginLeft: marginLeft}]}>
                            {logo}
                        </View>
                    );
                }
                else {//if(route.id == 'CampaignCauses') {
                    return (
                        <View style={[styles.toolbarIconWrapper, {flex: 1, flexDirection: 'row', width: windowWidth/2,}, 
                                    isAr && {marginLeft: 40}]}>
                            <Text numberOfLines={1} style={[{color: '#ffffff',fontFamily: 'Janna New R', flex:1,}, 
                                            isAr && {textAlign: 'right', }, !isAr && {textAlign: 'left', }]}>
                                {route.title}</Text>
                        </View>
                    );
                }
                return (
                    <Text style={{marginTop: -oldoldStatusBarHeight + 5, 
                            height: navBarHeight - 5, alignItems: 'center',
                            justifyContent: 'center',fontFamily: 'Janna New R', 
                            color: '#ffffff',}}>
                        {route.title}
                    </Text>
                );
            },
        });
    }


    onLanguageChange() {//alert(this.props.navigator);
        this.setState({ currentLanguageIsArabic: !this.state.currentLanguageIsArabic });
        //LanguageActions.setLanguage(this.state.currentLanguageIsArabic);
    }
    openTabDefaultScreen(tabIndex) {
        if(this.navigatorObj != null && this.navigatorObj.push) {
            let id, title, toGoComponent;
            
                        isAr = this.state.currentLanguageIsArabic;
            let redirectInfo = null;
            let donor = this.state.currentUser;
            
            switch(tabIndex) {
                case 1:
                    if(donor && donor != null) {
                        id = 'MyBasket';
                        title = isAr ? 'السلة' : 'My Basket';
                        toGoComponent = MyBasket;
                    }
                    else {
                        let loginInfo = AccountController.getLoginNavigationInfo(isAr);
                        id = loginInfo.id;
                        title = loginInfo.title;
                        toGoComponent = LoginHome;
                        redirectInfo = {
                            id: 'MyBasket',
                            title: isAr ? 'السلة' : 'My Basket',
                            passProps: null,
                        }
                    }
                    break;
                case 2:
                    id = 'CharityCards';
                    title = isAr ? 'كروت الخير' : 'Charity Cards';
                    toGoComponent = CharityCards;
                    break;
                case 3:
                    if(donor && donor != null) {
                        id = 'MyProfile';
                        title = isAr ? 'الملف الشخصي' : 'My Profile';
                        toGoComponent = MyProfile;
                    }
                    else {
                        let loginInfo = AccountController.getLoginNavigationInfo(isAr);
                        id = loginInfo.id;
                        title = loginInfo.title;
                        toGoComponent = LoginHome;
                        redirectInfo = {
                            id: 'MyProfile',
                            title: isAr ? 'الملف الشخصي' : 'My Profile',
                            passProps: null,
                        }
                    }
                    break;
                default:
                    id = 'QCHome';
                    title = 'Welcome';
                    toGoComponent = QCHome;
                    break;
            }

            this.navigatorObj.push({
                id: id,
                title: title,
                component: toGoComponent,
                passProps: { isArabic: isAr, redirectInfo: redirectInfo, },
            });
        }
    }

    render() {
        var initScreenId = 'QCHome';
        var initScreenTitle = 'welcome';
        var initComponent = QCHome;
        var passProps = null;

        var navigatorStyles = Navigator.NavigationBar.Styles.General;
        var oldStatusBarHeight = navigatorStyles.StatusBarHeight;
        
        navigatorStyles.TotalNavHeight = 56;
        navigatorStyles.StatusBarHeight = 0;
              
        var navBarControls = this.getNavigationBarRouteMapper(oldStatusBarHeight, navigatorStyles.TotalNavHeight, this);
        let loading=null;
        if(this.state.isLoading) {
            loading = (<QCLoading />);
        }
        return (
            <MenuContext style={{flex: 1,}} ref="MenuContext">
                <View style={styles.container}  collapsable={false}>
                    <Navigator
                        initialRoute={{
                            id: initScreenId,
                            index: 0,
                            title: initScreenTitle,
                            component: initComponent,
                            passProps: passProps,
                            statusBarHidden: true,
                        }}
                          
                        renderScene={this.renderScene.bind(this)}
                          
                        sceneStyle={{paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight+1}}
                          
                        configureScene={
                            (route, routeStack) => {
                                if (route.sceneConfig) {
                                    return route.sceneConfig;
                                }
                                return Navigator.SceneConfigs.VerticalDownSwipeJump;
                            }
                        }

                        navigationBar={
                            <Navigator.NavigationBar
                                routeMapper={navBarControls}
                                style={{backgroundColor: '#444444',}}
                            />
                        }
                    />
                    {loading}
                    <QCTabbar selectedTab={this.state.currentTabIndex} isArabic={this.state.currentLanguageIsArabic}
                                onTabPressed={(newIndex) => this.openTabDefaultScreen(newIndex)} />
                    <KeyboardSpacer />
                </View>
            </MenuContext>
        );
    }


    renderScene(route, navigationOperations, onComponentRef) {
        var routeId = route.id;
        var navigator = navigationOperations;
        let self = this;
        switch(routeId) {
            /*case 'QCTest' :
                return (
                    <QCTest navigator={navigator} route={route} {...route.passProps} />
                );*/
            case 'QCHome':
                return (
                    <QCHome navigator={navigator} route={route} {...route.passProps}
                            currentUser={self.state.currentUser} isArabic={self.state.currentLanguageIsArabic}
                            onSearchParamsDefined={() => self.setSearchParams(self.state.currentCampaignId, self.state.currentDonationTypeId, true)} />
                );
            case 'CampaignCauses':
                return (
                    <CampaignCauses navigator={navigator} route={route} {...route.passProps}
                            currentUser={self.state.currentUser}
                            onSearchParamsDefined={(campaignId, typeId) => self.setSearchParams(campaignId, typeId)}  />
                );
            case 'CauseDetails' :
                return (
                    <CauseDetails navigator={navigator} route={route} {...route.passProps}
                            currentUser={self.state.currentUser}
                            onSearchParamsDefined={(campaignId, typeId) => self.setSearchParams(campaignId, typeId)} />
                );
            case 'Categories':
                return (
                    <Categories navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CategoryItems':
                return (
                    <CategoryItems navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'PaymentMobile':
                return (
                    <PaymentMobile navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'PaymentMobileVerify':
                return (
                    <PaymentMobileVerify navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'PaymentVisa':
                return (
                    <PaymentVisa navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
                case 'Contact':
                return (
                    <Contact navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'MainSearch':
                return (
                    <MainSearch navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'SearchResult':
                return (
                    <SearchResult navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'LoginHome':
                return (
                    <LoginHome navigator={navigator} route={route} {...route.passProps}
                            onLoggedin={(notifyBack) => this.userLoggedIn(notifyBack)}
                            currentUser={this.state.currentUser} />
                );
            case 'RegisterHome':
                return (
                    <RegisterHome navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'AccountRecovery':
                return (
                    <AccountRecovery navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} 
                            screen='accountrecovery'
                            onSelectMethod={(methodId) => this.recoveryMethodChanged(methodId)} />
                );
            case 'RecoverUserName':
                return (
                    <AccountRecovery navigator={navigator} route={route} {...route.passProps} 
                            currentUser={this.state.currentUser}
                            screen='username'
                            onSelectInfoRecoveryMethod={
                                (methodId, username, password) => this.recoverInfoMethodChanged(methodId, username, password)} />
                );
            case 'RecoverPassword':
                return (
                    <AccountRecovery navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} 
                            screen='password'
                            onSelectInfoRecoveryMethod={
                                (methodId, username, password) => this.recoverInfoMethodChanged(methodId, username, password)} />
                );
            case 'RecoverLogin':
                return (
                    <AccountRecovery navigator={navigator} route={route} {...route.passProps} 
                            currentUser={this.state.currentUser}
                            screen='usernamepassword'
                            onSelectInfoRecoveryMethod={
                                (methodId, username, password) => this.recoverInfoMethodChanged(methodId, username, password)} />
                );
            case 'MyBasket':
                return (
                    <MyBasket navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser}
                            onSelectedItemsChanged={(items) => this.selectedBasketItemsChanged(items)}
                            refresh={this.state.refresh} onRefreshed={() => this.setState({refresh: false,isLoading: false,})}/>
                );
            case 'MyProfile':
                return (  
                    <MyProfile navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'Kafalaty':
                //self.setSearchParams(null, 3)
                return (
                    <Kafalaty navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'FastingHome':
                return (  
                    <FastingHome navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'MySponsrshipDetails':
                //self.setSearchParams(null, 3)
                return (  
                    <MySponsrshipDetails navigator={navigator} route={route} {...route.passProps} 
                            currentUser={this.state.currentUser}/>
                );
            case 'MyProjects':
                //self.setSearchParams(null, 2)
                return (
                    <MyProjects navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'ProjectDetails':
                //self.setSearchParams(null, 2)
                return (
                    <ProjectDetails navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'Notifications':
                return (
                    <Notifications navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'OldDonations':
                return (
                    <OldDonations navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CharityCards':
                return (  
                    <CouponList navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CouponList':
                return (  
                    <CouponList navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'TroublesRelief':
                return (  
                    <TroublesMain navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'Collectors':
                return (  
                    <CollectorRequest navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'ReviewScreen':
                return (  
                    <ReviewScreen navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'KafalatHome':
                return (  
                    <KafalatHome navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CharityPointsHome':
                return (  
                    <PostsMain navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'PostDetails':
                return (  
                    <PostDetails navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'PostShare':
                return (  
                    <PostShare navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CreateGroup':
                return (  
                    <CreateGroup navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'MyGroups':
                return (  
                    <MyGroups navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'GroupDetails':
                return (  
                    <GroupDetails navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'GroupNotifications':
                return (  
                    <GroupNotifications navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'GroupInvitationResponse':
                return (  
                    <GroupInvitationResponse navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'CreateGroup':
                return (  
                    <CreateGroup navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
            case 'AddMember':
                return (  
                    <AddMember navigator={navigator} route={route} {...route.passProps}
                            currentUser={this.state.currentUser} />
                );
        }
      
        return this.noRoute(navigator);
    }
    
    noRoute(navigator) {
        return (
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', backgroundColor: 'yellow',}}>
                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                      onPress={() => navigator.pop()}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>{'There is not route for this screen'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

QCAndroidFull.defaultProps = {
    
    recoveryInfo_MethodId: 0,
    recoveryInfo_username: '',
    recoveryInfo_password: '',
    recoveryInfo_email: '',
    recoveryInfo_mobile: '',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e8e8',
    },
    navigator: {
        flex: 1,
        backgroundColor: '#444444',
        height: 56,
    },
    toolbarIconWrapper: {
        height: 56, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    toolbar: {
        height: 25,
        width: 25,
    },
    toolbarIcon: {
        resizeMode: 'contain',
    },
    toolbarLeftIcon: {
        marginLeft:7,
        marginRight:7,
    },
    toolbarLogo: {
        resizeMode: 'contain',
        marginLeft:5,
        marginRight:5,
        height: 35,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        //fontFamily: 'Janna LT',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fe345a',
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center', 
        justifyContent:'center',
        position: 'absolute',
        bottom: 5,
        right: 0,
    },
    badgeText: {
        color: 'white',
        textAlign: 'center',
    },
});

module.exports = QCAndroidFull;