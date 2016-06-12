'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import { height, width, text, AccountController } from '../utilities/constants';
import Menu, {
    MenuOptions, 
    MenuOption, 
    MenuTrigger,
} from 'react-native-menu';

let QCButton = require('./qcButton');

let LoginHome = require('../account/loginHome');
let RegisterHome = require('../account/registerHome');

let QCHome = require('../../qcHome');
let Contact = require('../contact/index');
let MyBasket = require('../basket/myBasket');
let CharityCards = require('../cards/cardList');
let MyProfile = require('../profile/myProfile');
let MainSearch = require('../search/mainSearch');
let TroublesMain = require('../troublesRelief/troublesMain');
let CollectorRequest = require('../collectors/collectorRequest');

let isArabic = true;

class QCMenu extends Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
    }
    goAccountSign(login) {
        let id = login ? 'LoginHome' : 'RegisterHome';
        let title;
        if(isArabic) {
            title = login ? 'طرق الدخول' : 'طرق انشاء حساب جديد';
        }
        else {
            title = login ? 'Login Methods' : 'Registration Methods';
        }
        let toGoComponent = login ? LoginHome : RegisterHome;
        if(this.props.onOptionSelected) {
            this.props.onOptionSelected();
        }
        this.props.navigator.push({
            id: id,
            title: title,
            component: toGoComponent,
            passProps: { isArabic: isArabic, },
        });
    }
    goToOption(id, title, toGoComponent) {
        if(this.props.onOptionSelected) {
            this.props.onOptionSelected();
        }
        this.props.navigator.push({
            id: id,
            title: title,
            component: toGoComponent,
            passProps: { isArabic: isArabic, },
        });
    }
    goSignout() {
        if(this.props.onOptionSelected) {
            this.props.onOptionSelected();
        }
        AccountController.logout(this.props.navigator, isArabic, () => {
            if(this.props.onLoggedOut) {
                this.props.onLoggedOut();
            }
        });
    }
  
    render() {
        let homeText =  isArabic ? 'الرئيسية' : 'Home';
        let basketText =  isArabic ? 'السلة' : 'Basket';
        let cardsText =  isArabic ? 'كروت الخير' : 'Charity Cards';
        let profileText =  isArabic ? 'الملف الشخصي' : 'Profile';
        let searchText =  isArabic ? 'البحث' : 'Search';
        let troublesText =  isArabic ? 'تفريج كربة' : 'Tafreej Korba';
        let collectorsText =  isArabic ? 'المحصل المنزلي' : 'Collector';
        let settingsText =  isArabic ? 'الإعدادات' : 'Settings';
        let contactText =  isArabic ? 'اتصل بنا' : 'Contact Us';

        let registerText = isArabic ? 'حساب جديد' : 'Register';
        let loginText = isArabic ? 'تسجيل دخول' : 'Login';

        let underlayColor = 'transparent';
        let menu = <Image source={require('image!ic_menu')} style={[styles.toolbar, styles.toolbarIcon]} />;
        
        let donor = this.props.currentUser;
        let bottomHeader = null, logoutBtn;        
        if(donor && donor != null) {
            bottomHeader = (
                <View style={styles.menuTopButtons}>
                    <Text style={[styles.welcome, text]}>أهلا بك {donor.FullName}</Text>
                </View>
            );

            let logoutText = isArabic ? 'خروج' : 'Logout';
            logoutBtn = (
                <MenuOption style={[styles.option, { justifyContent: 'center', alignItems: 'center', width: (width > 390 ? 340 : width - 50), }]}>
                    <QCButton text={logoutText} width={((width > 390 ? 340 : width - 50) - 40)} isArabic={isArabic} 
                        onPressed={() => this.goSignout()}
                        icon={require('image!register')}
                        color='red' />
                </MenuOption>
            );
        }
        else {
            bottomHeader = (
                <View style={styles.menuTopButtons}>
                    <QCButton text={registerText} width={120} isArabic={isArabic} 
                                onPressed={() => this.goAccountSign(false)}
                                color='transparent' />
                    <QCButton text={loginText} width={120} isArabic={isArabic} 
                                onPressed={() => this.goAccountSign(true)}
                                color='transparent' />
                </View>
            );
            logoutBtn = (
                <MenuOption style={[styles.option, { width: 0, height: 0, }]}>
                </MenuOption>
            );
        }
      	return (
            <Menu>
                <MenuTrigger disabled={false} style={[styles.toolbarIconWrapper, {paddingRight: 20,}]}>
                    {menu}
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={styles.menu}>
                    <MenuOption value="normal" style={{marginBottom: 0,}}>
                        <View style={styles.menuTopWrapper}>
                            <View style={styles.menuPic}>
                                <Image source={require('image!profile')} style={{resizeMode: 'contain', width: 100, }} />
                            </View>
                            {bottomHeader}
                        </View>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goSignout()}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{homeText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_home')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('MyBasket', basketText, MyBasket)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{basketText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_cart')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('CharityCards', cardsText, CharityCards)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{cardsText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_cards')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('MyProfile', profileText, MyProfile)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{profileText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_profile')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('MainSearch', searchText, MainSearch)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{searchText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_search')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('TroublesRelief', troublesText, TroublesMain)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{troublesText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_tafreej')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('Collectors', collectorsText, CollectorRequest)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{collectorsText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_collector')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('QCHome', settingsText, QCHome)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{settingsText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_settings')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    <MenuOption style={styles.option}>
                        <TouchableOpacity 
                                onPress={() => this.goToOption('Contact', contactText, Contact)}
                                underlayColor={underlayColor}
                                style={styles.optionTouch}>
                            <View style={[styles.optionTextWrapper,]}>
                                <Text style={[styles.optionText, text]}>{contactText}</Text>
                            </View>
                            <View style={styles.optionIconWrapper}>
                                <Image source={require('image!mu_contact')} style={styles.optionIcon} />
                            </View>
                        </TouchableOpacity>
                    </MenuOption>
                    {logoutBtn}
                </MenuOptions>
            </Menu>
      	);
    }
}

var styles = StyleSheet.create({ 
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
    menu: {
        backgroundColor: 'white',
        height: height - 20,
        borderRadius: 0,
        width: width > 390 ? 340 : width - 50,
        //marginLeft: 20,
        padding: 0,
        alignItems: 'flex-end', 
    },
    menuTopWrapper: {
        backgroundColor: '#444444', 
        marginRight: -10, 
        marginTop:-10, 
        height: height/3, 
        width: width > 390 ? 340 : width - 50,
    },
    menuPic: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTopButtons: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    welcome: {
        color: 'white',
        marginTop:10,
        marginBottom: 10,
    },
    option: {
        height: 60,
        marginTop:-10,
        marginRight: -10, 
    },
    optionTouch: {
        flexDirection: 'row', 
        width: width > 390 ? 340 : width - 50, 
        height: 60, 
        marginTop:-10, 
        marginRight: -10, 
    },
    optionTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        height: 60, 
    },
    optionText: { 
        textAlign: 'right', 
    },
    optionIconWrapper: {
        width: 50,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    optionIcon: {
        resizeMode: 'contain',
        width: 30, 
    },
});

module.exports = QCMenu; /* making it available for use by other files */