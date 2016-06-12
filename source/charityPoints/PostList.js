'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    ListView,
    View,
    TouchableHighlight,
    InteractionManager,
} from 'react-native';

import Share from 'react-native-share';
import LocalizedStrings from 'react-native-localization';
import { height, width, text, AccountController, } from '../utilities/constants';

var i = 0;

let QCLoading =  require('../../qcLoading');
var GlobalResource = require('./GlobalResource');

var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/posts';

let isArabic = true;

class PostList extends Component {

    constructor(props) {
       super(props);
       this.state = {
            isLoading: true,
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
           }),
       };
    }
    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');
        this.fetchData();
    }

    fetchData() {
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
               dataSource: this.state.dataSource.cloneWithRows(responseData),
               isLoading: false,
            });
        })
        .done();
    }

	goDetails(postId) {
        this.props.navigator.push({
        	id: 'PostDetails',
            title: stringsLocal.detailsTitle,
            passProps: {postId: postId, isArabic: isArabic},
        });
    }

	goShare(post) {debugger;
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }
        
        if(donorId && donorId != null && donorId > 0) {
           //alert(donorId)
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
    
    renderPost(post) {
    	if(!post || post == null || Object.keys(post).length === 0) {
    		return null;
    	}
		var description, subject;
		if(!isArabic) {
			description = post.Description_En;
			subject = post.Subject_En;
		}
		else {
			description = post.Description_Ar;
			subject = post.Subject_Ar;
		}
		
		var share = (
			<TouchableHighlight style={stylesBase.shareWrapper} 
                    		underlayColor={'transparent'}
                    		onPress={() => this.goShare(post)}>
                <Image source={require('../../contents/icons/Share.png')}
                            style={stylesBase.share} />
            </TouchableHighlight>
		);
		
		var details = (
			<View style={stylesBase.rightContainer}>
            	<Text style={[stylesBase.title, styleLang.title, text]}>{subject}</Text>
            	<Text style={[stylesBase.details, styleLang.details, text]} numberOfLines={2}>{description}</Text>
            </View>
		);
		var image = (
			<Image source={{uri: post.ThumbVPath}}
                	style={[stylesBase.thumbnail, styleLang.thumbnail]} />
		);
		
		var content;
		if(!isArabic) {
			content = (
				<View style={stylesBase.post}>
                            {image}
                            {details}
           		</View>
			);
		}
		else {
			content = (
				<View style={stylesBase.post}>
                	{details}
                	{image}
           		</View>
			);
		}
		
		var detailsWrapper = (
			<TouchableHighlight style={stylesBase.detailsWrapper}
                    		onPress={() => this.goDetails(post.PostId)}
                    		underlayColor={'transparent'}>
            	{content}
           </TouchableHighlight>
		);
		
		var firstContent, secondContent;
		if(!isArabic) {
			firstContent = detailsWrapper;
			secondContent = share;
		}
		else  {
			firstContent = share;
			secondContent = detailsWrapper;
		}
		
        return (            
            <View style={[stylesBase.itemContainer, i++%2 === 1 && stylesBase.oddContainer,]}>
                {firstContent}
                {secondContent}
            </View>                
        );
    }

    render() {
        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        return (
            <View style={stylesBase.container}>
                <ListView
                	dataSource={this.state.dataSource}
                    renderRow={this.renderPost.bind(this)}
                    initialListSize={1}
                    style={{flex: 1, }}
                    contentContainerStyle={[stylesBase.contentContainer]} />
                {loading}
            </View>
        );
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
	en: {
		detailsTitle: 'Case Details',
	},
	ar: {
		detailsTitle: 'التفاصيل',
	},
});

var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginTop: -1,
    },
    contentContainer: {
        width: width,
        marginTop: 1,
        marginLeft: 0,
        marginRight: 0,
        alignItems: 'center', 
        justifyContent:'flex-start',
    },
    listView: {
        flex: 9,
    },
    itemContainer: {
    	flex: 1, 
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',         
        backgroundColor: '#fbfbfb',
        padding: 8,margin:1,
    },
    oddContainer: {
        backgroundColor: '#eeeeee',
    },
    separator: {
    	height: 1,
    	backgroundColor: '#c4c4c4',
    },
    detailsWrapper: {
    	flex: 5, 
    	marginLeft: 0,
    },
    shareWrapper: {
    	flex: 1, 
        paddingRight: 0,
    },
    post: {
    	flex: 1, 
    	flexDirection: 'row',
    },
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 35,
        resizeMode: 'cover',
    },
    rightContainer: {
        flex: 1,
        flexWrap: 'wrap',
    },
    title: {
    	//fontFamily: 'Janna LT',
        color: '#000000',
        marginBottom: 8,
    },
    details: {
        color: '#4e4e4e',
    },
    share: {
		alignSelf: 'flex-end',
    },
    loading: {
       flex: 9,
       alignItems: 'center',
       justifyContent: 'center',
    },
});

var styleLang;
if(!isArabic) {
	styleLang = StyleSheet.create({	
		thumbnail: {
        	marginRight: 10,
        	marginLeft: 0,
		},
		title: {
    		textAlign : 'left',
        	fontSize: 14,
		},
    	details: {
    		textAlign : 'left',
        	fontSize: 12,
    	},
	});
}
else {
	styleLang = StyleSheet.create({	
		thumbnail: {
        	marginRight: 0,
        	marginLeft: 10,
		},
		title: {
    		textAlign : 'right',
        	fontSize: 14,
		
		},
    	details: {
    		textAlign : 'right',
        	fontSize: 12,
    	},
	});
}

module.exports = PostList;