'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';

import Share from 'react-native-share';
import LocalizedStrings from 'react-native-localization';
import Video from 'react-native-video';
import { height, width, text, AccountController, } from '../utilities/constants';
//import YouTube from 'react-native-youtube';

var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/posts/';

let QCLoading =  require('../../qcLoading');
var GlobalResource = require('./GlobalResource');
let isArabic = true;

class PostDetails extends Component {

    constructor(props) {
       super(props);
       this.state = {
            isLoading: true,
            dataSource: {},
            postType: 1,
       };
    }

    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL + this.props.postId)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
               dataSource: responseData,
               isLoading: false,
               postType: responseData.PostTypeValue,
            });
        })
        .done();
    }
    
    /*goShare() {
        this.props.navigator.push({
        	id: 'PostShare',
            title: stringsGlobal.shareTitle,
            passProps: {postId: this.props.postId, isArabic: isArabic},
        });
    }*/

    goShare(post) {debugger;
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }
        
        if(donorId && donorId != null && donorId > 0) {
           
            let title = isArabic ? (post.Subject_Ar + '\r\n\r\n' + post.Description_Ar) : (post.Subject_En + '\r\n\r\n' + post.Description_En);
            let img;

            if(post.PostTypeValue == 1) {
                img = post.ThumbVPath;
            }
            else if(post.PostTypeValue == 2 || post.PostTypeValue == 3) {
                img = post.VideoURL;
            }
            else {img = null;}

            InteractionManager.runAfterInteractions(() => {
                Share.open({
                        share_URL: post.LinkURL,
                        share_text: title,
                        share_image_URL: img
                    }, (e) => {
                });
            });
            this.addPoints(1, post.PostId, donorId)
            /*this.props.navigator.push({
                id: 'PostShare',
                title: stringsGlobal.shareTitle,
                passProps: {postId: postId, isArabic: isArabic},
            });*/
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'CharityPointsHome',
                title: isArabic ? 'نقاط الخير' : 'Charity Points',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: isArabic, redirectInfo: redirectInfo, },
            });
        }
    }

    addPoints(socialMediaId, postId, userId){
    
        fetch('http://portal.qcharity.net/QCPointsApiTest/api/posts/share', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PostId: '' + postId + '',
                UserId: '' + userId + '',
                SocialMediaId: '' + socialMediaId + '',
            }),     
        })
        .then(function (response) {
            if(response.status == 201 || response.status == 200) {
                if(socialMediaId != 4) {
                    alert(stringsLocal.successMsg);
                }
            }
            thisObj.shareStopped();
        })
        .catch (function (error) {
            alert(stringsLocal.requestFailed + error);
            thisObj.shareStopped();
        });
    }
    
    render() {

        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }

        var post =  this.state.dataSource;
        if(Object.keys(post).length === 0) {
        	return null;
        }
        var windowWidth = width;
        var windowCenterHeight = height / 2;
        var shareLeft = (windowWidth / 2)- 40;
        var mediaHeight = (post.ImageHeight != 0 && 
        					windowCenterHeight >= post.ImageHeight ? post.ImageHeight : windowCenterHeight);
        var shareTop = mediaHeight - 35;
        
        var description, subject;
		if(!isArabic) {
			description = post.Description_En;
			subject = post.Subject_En;
		}
		else {
			description = post.Description_Ar;
			subject = post.Subject_Ar;
		}
		
        return (
            <View style={stylesBase.container}>                	
                <View style={stylesBase.mediaWrapper}>
                    {(() => {
                        switch (this.state.postType) {
                          case 1:   
                            return <Image source={{uri: post.ImageVPath}}
                                     style={{width: post.ImageWidth, height: mediaHeight, resizeMode: 'cover',
        										alignSelf: 'center',}} />;
        				  //https://github.com/brentvatne/react-native-video
        				  case 2: 
                            return <Video source={{uri: post.VideoURL}} 
                                            rate={1.0}  
                                            volume={1.0} 
                                            muted={false}
                                            paused={false} 
                                            resizeMode="content"
                                            repeat={true}  
                                            style={[stylesBase.backgroundVideo, 
                                                   {alignSelf: 'center',width: windowWidth, height: mediaHeight, /*maxWidth: windowWidth, 
                                                    maxHeight: windowCenterHeight,*/}]} />;
                          //https://github.com/paramaggarwal/react-native-youtube
                          /*case 3: 
                            return <YouTube
                                        ref="youtubePlayer"
                                        videoId="cqNmVJk7Zyg" // The YouTube video ID
                                        play={true}           // control playback of video with true/false
                                        hidden={false}        // control visiblity of the entire view
                                        playsInline={true}    // control whether the video should play inline
                                        style={{alignSelf: 'stretch', height: shareTop, 
                                                backgroundColor: 'black', marginVertical: 10}}
                                      />;*/
                          default: 
                          			shareTop = 80;
                          			shareLeft = windowWidth - 70;   
                                    return;
                        }
                    })()}
                </View>
                <View style={stylesBase.details}>
                	<ScrollView showsVerticalScrollIndicator={true} style={{flex:1,}}>
                		<Text style={[stylesBase.textWrapper, styleLang.textWrapper, text]}>
                    		<Text style={[stylesBase.title, styleLang.title]}>{subject}</Text>
                    		<Text style={[stylesBase.description, styleLang.description]}>
                        		{'\r\n' + description}
                    		</Text>
                    	</Text>
                    </ScrollView>
                </View>
                <TouchableHighlight 
                	style={[stylesBase.shareWrapper, {top: shareTop, left: shareLeft,}]} 
                	onPress={() => this.goShare(post)}
                	underlayColor={'transparent'}>
                    <Image source={require('../../contents/icons/Share@3x.png')} 
                    		style={stylesBase.share}/>
                </TouchableHighlight>
                {loading}
            </View>
        );
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
 
var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareWrapper: {
        position: 'absolute',
    },
    mediaWrapper: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    	width: width - 10,
    },
    backgroundVideo: {
    	backgroundColor: 'black',
    },
    details: {
        flex: 1,
        paddingTop:40,
    },
    textWrapper: {
        flex: 1,
    	paddingRight: 5,
    	paddingLeft: 5,
    	width: width - 10,
    },
    title: {
        marginBottom: 5,
    },
    description: {
        color: '#4e4e4e',
    },
    share: {
    	resizeMode: 'cover',
    	flex: 1,
    	width:70,
    	height:70,
    	alignSelf:'center',
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
    },
});

var styleLang;
if(!isArabic) {
	styleLang = StyleSheet.create({	
		textWrapper: {
        	textAlign : 'left',
		},
		title: {
    		textAlign : 'left',
        	fontSize: 17,
		
		},
    	details: {
    		textAlign : 'left',
        	fontSize: 13,
    	},
	});
}
else {
	styleLang = StyleSheet.create({	
		textWrapper: {
        	textAlign : 'right',
		},
		title: {
    		textAlign : 'right',
        	fontSize: 17,
		
		},
    	description: {
    		textAlign : 'right',
        	fontSize: 13,
    	},
	});
}

module.exports = PostDetails; /* making it available for use by other files */