'use strict';
 
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    TouchableOpacity,
    Image,
    Alert,
    InteractionManager
} from 'react-native';

import Share from 'react-native-share';
//var Slider = require('react-native-slider');

import { height, width, text, } from '../utilities/constants';
import LoadingIndicator from './components/LoadingIndicator';
import {SERVER_URL, SHARE_URL, SHARE_TEXT, SHARE_IMAGE_URL, SMS_TEXT, DONATE_TEXT, 
        INFO_NOTIFICATION_TITLE_En, INFO_NOTIFICATION_CONTENT_En,
        INFO_NOTIFICATION_TITLE_Ar, INFO_NOTIFICATION_CONTENT_Ar} from './constants'
import {SMSOpen} from '../api/SMS';

let InfoModal = require('../qcModals/infoModal');
let QCLoading =  require('../../qcLoading');

let isArabic = true;

class TroublesMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            content: {},
            smsNumber: "",
            modalOpen: false,
            donateModalIsOpen: false,
        };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        this.getParamsFromServer();
    }
    componentWillUnmount() {
    }
    getParamsFromServer() {
        fetch(SERVER_URL)
        .then((response) => response.json())
        .then((responseData) => {
            //let bodyJson = JSON.parse(response._bodyText);
            console.log("server result", responseData);
            // console.log("server result TitleEn", bodyJson['TitleEn']);
            this.setState({
                content: responseData,
                smsNumber: responseData.SMS, 
                isLoading: false,
            })
        })
        .catch((error) => {
            console.log("server error", error);
            this.setState({ 
                isLoading: false,
            })
        });
    }
    showAlertDlg(title, message) {
        /*Alert.alert(
            title,
            message
        );*/
    }
    openModal() {
        this.setState({
            modalOpen: true,
            donateModalIsOpen: false,
        });
    }    
    modalClosed() {
        this.setState({ 
            modalOpen: false,
        });
    }

    _onPressSMS() {
        SMSOpen(this.state.smsNumber);
    }
    _onPressShare(title) {
        this.setState({isLoading: true, modalOpen: false,});
        let url = isArabic ? this.state.content.ShareLink : this.state.content.ShareLinkEn;
        InteractionManager.runAfterInteractions(() => {
            Share.open({
                    share_text: title,
                    share_URL: url,
                    //share_image_URL: SHARE_IMAGE_URL
                }, (e) => {
                    this.setState({isLoading: false});
                    //alert(e)
                    /*if(e == null) {
                        alert("Successfully Shared");
                    }
                    else if(e != "Canceled") {
                        alert("Share Notification " + e);
                    }*/
            })
        });
    }
    onPressDonate(title){
        this.props.navigator.push({
            id: 'CampaignCauses',
            title: title,
            //component: CauseDetails,
            passProps: {campaignId: this.state.content.CampaignId, isArabic: this.props.isArabic, },
        });
    }
    _onPressInfo(){
        this.openModal();
    }
    
    render() {

        let loading = null, relieveComponent = null;
        let content = this.state.content;
        let title = '', guest = '', details = '', date = '';
        let sendSMS = isArabic ? 'أرسل رسالة للتبرع' : 'Send Notification SMS';
        let donate = isArabic ? 'تبرع' : 'DONATE';
        let aboutTitle = isArabic ? INFO_NOTIFICATION_TITLE_Ar : INFO_NOTIFICATION_TITLE_En;
        let aboutDetails = isArabic ? INFO_NOTIFICATION_CONTENT_Ar : INFO_NOTIFICATION_CONTENT_En;

        if(this.state.isLoading) { 
            loading = (
                <QCLoading />
            );
        }
        if(content && content != null && Object.keys(content).length > 0) {
            title = isArabic ? content.Title : content.TitleEn;
            guest = isArabic ? content.Author : content.AuthorEn;
            details = isArabic ? content.Content : content.ContentEn;
            date = isArabic ? content.Date : content.DateEn;
        }
        if(!this.state.isLoading || (content && content != null && Object.keys(content).length > 0)) {
            relieveComponent = (
                <View style={styles.subContainer}>
                    <View style = {styles.topContainer}>
                        <Text style={[styles.episodeTitleText, text]}>{title}</Text>
                        <Text style={[styles.episodeContentText, text]}>{details}</Text>
                        <Text style={[styles.episodeDateText, text]}>{date}</Text>
                        <Text style={[styles.episodeAuthorText, text]}>{guest}</Text>
                    </View>
                    <View style={{width: width - 30, height: 60, borderWidth: 2, borderColor: 'white', alignSelf: 'center'}}>
                        <WebView ref={'webview'} automaticallyAdjustContentInsets={true} bounces={false} scrollEnabled={false}
                                    style={{backgroundColor:'transparent',width: width - 30, height: 60, 
                                    borderWidth: 2, alignSelf: 'center'}} 
                                    source={{uri: 'https://www.qcharity.org/ar/qa/tafreejkorba/audioplayer2'}}//https://qcharity.org/ar/qa/tafreejkorba/audioplayer2'}} 
                                    javaScriptEnabled={true} 
                                    contentInset={{top: 0, left: 0,}} 
                                    startInLoadingState={true}
                                    /*domStorageEnabled={true} decelerationRate="normal" 
                                    onNavigationStateChange={this.onNavigationStateChange} 
                                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} 
                                     
                                    scalesPageToFit={this.state.scalesPageToFit}*/ />
                        </View>
                    <View style={styles.middleContainer} >
                        <TouchableOpacity onPress={this._onPressSMS.bind(this)}
                                style={styles.smsButton} underlayColor={'transparent'}>
                            <View style={styles.smsContainer}>
                                <Image
                                  style={styles.smsImage}
                                  source={ require('image!sms') } />
                                <Text style={[styles.smsText, text]}>{sendSMS}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                              onPress={() => this._onPressShare(details)}
                              style={styles.shareButton} underlayColor={'transparent'}>
                            <Image
                                style={styles.shareImage}
                                source={ require('image!share') } />
                        </TouchableOpacity>
                        <TouchableOpacity
                              onPress={() => {this.onPressDonate(details)}}
                              style={styles.donateButton} underlayColor={'transparent'}>
                            <View style={styles.donateContainer}>
                                <Image
                                    style={styles.donateImage}
                                    source={ require('image!donate') } />
                                <Text style={[styles.donateText, text]}>{donate}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                                onPress={this._onPressInfo.bind(this)}
                                style={styles.shareButton} underlayColor={'transparent'}>
                            <Image
                                style={styles.shareImage}
                                source={ require('image!i_info') } />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return (
            <View
                style={styles.container}>
                <Image style = {styles.backImage}
                  source={ require('../../contents/images/tafreej_bg.png') } />
                {relieveComponent}
                <InfoModal isOpen={this.state.modalOpen}
                            title={aboutTitle} details={aboutDetails}
                            onClosed={() => this.modalClosed()} isArabic={this.state.isArabic} />
                {loading}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -1,
        marginBottom:50,
        /*alignItems: 'center',
        justifyContent: 'flex-start',*/
    },

    backImage:{
        flex: 0.9,
        width: null,
        height: null,
        resizeMode:'stretch',
    },

    subContainer:{
        flex:0.9,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position:'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },

    topContainer: {
        width: width,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },

    episodeTitleText:{
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 10,
        paddingLeft: 15,
        paddingRight:15,
        color:'white',
    },

    episodeContentText:{
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight:15,
        color:'white',
    },
    episodeDateText:{
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 13,
        marginTop: 5,
        color:'white',
    },
    episodeAuthorText:{
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5,
        paddingLeft: 15,
        paddingRight:15,
        color:'white',
    },

    middleContainer:{
        width: width,
        alignItems: 'center',
    },

    smsButton: {
        width: 200,
        backgroundColor:'white',
        borderRadius: 25,
        height: 50,
        marginTop:30,
        padding:5,
        marginHorizontal:30
    },

    smsContainer:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },

    smsImage:{
        resizeMode:'contain',
        width: 40,
    },

    smsText: {
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 13,
        marginLeft: 10,
        color:'#535353',
    },

    bottomContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
    },

    shareButton:{
        backgroundColor: '#06aebb',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius:30,
        marginLeft:20,
        marginRight:20
    },

    shareImage:{
        height: 30,
        resizeMode:'contain',
    },

    donateButton:{
        backgroundColor: '#fe345a',
        width: 100,
        height: 100,
        borderRadius:50
    },

    donateContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    donateImage:{
        resizeMode:'contain',
        width: 35,
        height: 35,
        marginTop: 8,
    },

    donateText:{
        textAlign: 'center',
        fontSize: 20,
        color:'white',
        marginTop: -6,
    },

    loadingContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
});

const sliderStyle = StyleSheet.create({
    track:{
        height:10,
        borderRadius: 0,
        backgroundColor: "white"
    },

    thumb: {
        width: 10,
        height: 20,
        borderRadius: 0,
        backgroundColor: 'white'
    }
});

module.exports = TroublesMain;