'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native';

import LocalizedStrings from 'react-native-localization';
import { height, width, text, AccountController, } from '../utilities/constants';

var GlobalResource = require('./GlobalResource');

let QCLoading =  require('../../qcLoading');
var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/members/{0}/invitations';

var i = 1;
let isArabic = true;

class GroupNotifications extends Component {
	
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
    
        let donorId = null;
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }
        
        if(donorId && donorId != null && donorId > 0) {
            fetch(REQUEST_URL.replace("{0}", donorId))
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                   dataSource: this.state.dataSource.cloneWithRows(responseData),
                   isLoading: false,
                });
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'GroupNotifications',
                title: isArabic ? 'الإشعارات' : 'Invitations',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: isArabic, redirectInfo: redirectInfo, },
            });
        }
    }

	goDetails(membership) {
        this.props.navigator.push({
        	id: 'Notification',
            title: stringsGlobal.notificationsTitle,
            passProps: {isArabic: isArabic, groupId: membership.GroupId, membershipId: membership.MembershipId}
        });
    }
    
    renderNotification(membership) {

    	var nameText = null;
    	var msgText = null;
    	if(!isArabic) {
    		nameText = <Text style={[stylesBase.title, styleLang.title, text]}>{membership.CreatorFullName}</Text>;
    		msgText = <Text style={[stylesBase.title, styleLang.title, text]} >
                    		{stringsLocal.invitaionMsg.replace("{0}", "").replace("{1}", membership.GroupName)}</Text>
    	}
    	else {
    		msgText = <Text style={[stylesBase.title, styleLang.title, text]} >
                    		{stringsLocal.invitaionMsg.replace("{0}", membership.CreatorFullName).replace("{1}", membership.GroupName)}</Text>
    	}
    	
        return (
            <View style={stylesBase.itemWrapper}>
                <TouchableHighlight style={{padding: 10,}}
                    		onPress={() => this.goDetails(membership)}
                    		underlayColor={'transparent'}>
                    <View style={stylesBase.detailsWrapper}>
                    	{nameText}
                    	{msgText}
                    </View>
                </TouchableHighlight>
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
            			automaticallyAdjustContentInsets={false}
                		renderRow={this.renderNotification.bind(this)}
                		initialListSize={1}
                		style={stylesBase.listView} />
                {loading}
            </View>
        );
    }
}
 
let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
	en: {
		invitaionMsg: '{0} invited you to join "{1}" group',
	},
	ar: {
		invitaionMsg: '{0} قام بدعوتك لللإنضمام لمجموعة "{1}"',
	},
});

var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f0f0',
    },
    button: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#06aebb',
    },
    wrapper: {
    	flex: 1,
    	flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    img: {
        flex: 1,
        resizeMode: 'cover',
    },
    btnText: {
    	flex: 4,
        color: '#fff',
        marginTop: 0,
    },
    loading: {
       flex: 9,
       alignItems: 'center',
       justifyContent: 'center',
    },
    listView: {
        flex: 9,
        padding: 10,
    },
    itemWrapper: {
    	backgroundColor: '#ffffff',
    	borderWidth: 1,
    	borderColor: '#989898',
    	marginBottom: 10,
    },
    detailsWrapper: {
    	flexDirection: 'row',
    	justifyContent: 'center', 
        alignItems: 'center',
    },
    pointsWrapper: {
    	justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fe345a',
        width:70, 
        height:70,
    },
    groupWrapper: {
    	flex: 1, 
    	flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    thumbnail: {
        resizeMode: 'cover',
    },
    groupImage: {
    	width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: '#8e8e8e',
        alignSelf: 'flex-end',
    },
    rightContainer: {
    	width: width - 230,
    },
    title: {
        color: '#000000',
        marginBottom: 8,
    },
    details: {
        color: '#4e4e4e',
    },
    points: {
    	color: '#ffffff',
    },
});

var styleLang;
if(!isArabic) {
	styleLang = StyleSheet.create({	
		img: {
        	marginRight: 5,
		},
		btnText: {
        	fontSize: 14,
		},
		thumbnail: {
        	marginRight: 10,
        	marginLeft: 0,
		},
		title: {
			alignSelf: 'flex-start',
    		textAlign : 'left',
        	fontSize: 14,
		
		},
    	details: {
			alignSelf: 'flex-start',
    		textAlign : 'left',
        	fontSize: 14,
    	},
	});
}
else {
	styleLang = StyleSheet.create({	
		img: {
        	marginLeft: 5,
		},
		btnText: {
        	fontSize: 14,
		},
		thumbnail: {
        	marginRight: 0,
        	marginLeft: 10,
		},
		title: {
    		textAlign : 'right',
        	fontSize: 12,
		
		},
    	details: {
    		textAlign : 'right',
        	fontSize: 14,
    	},
	});
}

module.exports = GroupNotifications; /* making it available for use by other files */