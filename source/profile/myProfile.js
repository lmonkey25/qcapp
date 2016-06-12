'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
} from 'react-native';

import { height, width, AccountController } from '../utilities/constants'

let Kafalaty = require('./kafalaty');
let MyProjects = require('./myProjects');
let OldDonations = require('./oldDonations');
let QCLoading =  require('../../qcLoading');
let isArabic = true;

class MyProfile extends Component {

    constructor(props) {
       super(props);
       this.state = {
            isLoading: true,
            donorTarget: {},
       };
    }
    componentDidMount() {debugger;
        isArabic = this.props.isArabic;
        this.fetchData();
    }
    componentWillUnmount() {
    }
    fetchData() {
        let self = this;
        
        if(this.props.currentUser && this.props.currentUser != null) {

            let REQUEST_URL = 'http://servicestest.qcharity.org/api/MobileDevice/GetDonorTarget?DonorId=' + 
                                this.props.currentUser.DonorId;
            fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {
                self.setState({
                    donorTarget: responseData,
                    isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'MyProfile',
                title: isArabic ? 'الملف الشخصي' : 'My Profile',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: this.props.isArabic, redirectInfo: redirectInfo, },
            });
        }
    }
    goKafalaty(title) {
        this.props.navigator.push({
            id: 'Kafalaty',
            title: title,
            component: Kafalaty,
            passProps: {isArabic: this.props.isArabic, donorId:  this.props.currentUser.DonorId, },
        });
    }
    goMyProjects(title) {
        this.props.navigator.push({
            id: 'MyProjects',
            title: title,
            component: MyProjects,
            passProps: {isArabic: this.props.isArabic, donorId:  this.props.currentUser.DonorId, },
        });
    }
    goOldDonations(title) {
        this.props.navigator.push({
            id: 'OldDonations',
            title: title,
            component: OldDonations,
            passProps: {isArabic: this.props.isArabic, donorId:  this.props.currentUser.DonorId, },
        });
    }
    
    render() {
        let loading = null
        if(this.state.isLoading) {            
            loading = ( <QCLoading /> );
        }
        //alert('profile ' + this.props.isArabic)
        let donor = this.props.currentUser;
        if(!donor || donor == null) {
            return (
                <View style={styles.container}>
                </View>
            );
        }
        let target = this.state.donorTarget;
        let percent = 0;

        if(!this.state.isLoading) {
            if(target.DonorTargetTotal > 0) {
                percent = (target.TotalGoalDonateAmountNow * 100) / target.DonorTargetTotal;
            }
        }

        let kfalaty = 'كفلاتي';
        let myDonations = 'تبرعاتي القديمة';
        let myProjects = 'مشاريعي';

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

        var images = [];
        /*for(var i = 0; i < 7; i++) {
            var rotate = (i*25) + 'deg';
            let img = (<Image key={i} source={require('../../contents/images/chart.png')} 
                    style={{width:60, height: 60, position: 'absolute', top: i > 0 ? -(i * 10) : 0, left: i * 15,
                            transform: [{rotate: rotate}],
                        }} />);

            images.push(img);
        }*/

        return (
            <View style={styles.container}>
                <View style={styles.picWrapper}>
                    <Image source={require('image!profile')} style={styles.pic} />
                    <Text style={styles.welcome}>أهلا بك {donor.FullName}</Text>
                </View>
                <View style={styles.pointsWrapper}>
                    <Text style={[styles.pointLabel, styles.text]}>نقاط الخير 0 ر.ق</Text>
                    <View style={[styles.sideBorder,]}></View>
                    <Text style={[styles.pointLabel, styles.text]}>آخر تبرع {target.LastDonateAmount} ر.ق</Text>
                </View>
                <ScrollView
                    scrollEventThrottle={16}
                    style={{ marginBottom:0,}}
                    contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>
                        <View style={styles.iconsWrapper}>
                            <TouchableHighlight onPress={() => this.goMyProjects(myProjects)} 
                                            style={[styles.iconWrapper, styles.iconTouch]} underlayColor={'transparent'}>
                                <View style={styles.iconWrapper}>
                                    <Image source={require('image!masharee3y')} style={styles.icon} />
                                    <Text style={[styles.iconLabel,]}>{myProjects}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => this.goOldDonations(myDonations)} 
                                            style={[styles.iconWrapper, styles.iconTouch]} underlayColor={'transparent'}>
                                <View style={styles.iconWrapper}>
                                    <Image source={require('image!old_donation')} style={styles.icon} />
                                    <Text style={styles.iconLabel}>{myDonations}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => this.goKafalaty(kfalaty)} 
                                            style={[styles.iconWrapper, styles.iconTouch]} underlayColor={'transparent'}>
                                <View style={styles.iconWrapper}>
                                    <Image source={require('image!kafalaty')} style={styles.icon} />
                                    <Text style={styles.iconLabel}>{kfalaty}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.targetTitle}>
                            <Text style={[styles.targetTitleLabel,]}>اسم الهدف</Text>
                            <Text style={[styles.targetTitleLabel, styles.date,]}>{target.DonorTargetEndDate}</Text>
                        </View>
                        <View style={styles.targetChart}>
                            <View style={{flex:1,paddingRight: 5,justifyContent: 'center', alignItems: 'center',}}>
                                <Text style={[styles.targetLabel, styles.doneLabel]}>تبرع</Text>
                                <Text style={[styles.targetLabel, styles.doneLabel]}>{target.TotalGoalDonateAmountNow} ر.ق</Text>
                            </View>
                            <View style={styles.pacman}>
                                {images}
                                <Text style={styles.percentage}>{percent} %</Text>
                            </View>
                            <View style={{flex:1,paddingLeft: 5,justifyContent: 'center', alignItems: 'center',}}>
                                <Text style={styles.targetLabel}>إجمالي الهدف</Text>
                                <Text style={styles.targetLabel}>{target.DonorTargetTotal} ر.ق</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {loading}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:55,
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
module.exports = MyProfile;