'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Image,
    View,
    Text,
    TextInput,
} from 'react-native';
   
import LocalizedStrings from 'react-native-localization';
import { height, width, text, } from '../utilities/constants';

var GlobalResource = require('./GlobalResource');

let QCLoading =  require('../../qcLoading');
let isArabic = true;

class GroupInvitationResponse extends Component {

	constructor(props) {
       super(props);
       this.state = {
            inProcess: true,
            group: null,
       };
    }
    
    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');

    	if(!this.props.group || this.props.group != null) {
        	this.fetchData();
        }
        else {
        	this.setState({
            	group: this.props.group,
            	inProcess: false,
            });
        }
    }
    
    fetchData() {
		var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/details/';
        fetch(REQUEST_URL + this.props.groupId)
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
            	group: responseData,
            	inProcess: false,
            });
        })
        .done();
    }
    /*serialize(data) {
    	
    	//var json= {'accepted': accept};
    	//json = typeof json === 'object' ? JSON.stringify(json) : json;
    	return Object.keys(data).map(function (keyName) {
        	return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    	}).join('&');
	};*/
    reponseInvitation(accept) {
    	this.setState({inProcess: true});
    	var thisObj = this;
    	
    	var url = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/members/'
    			+ thisObj.props.membershipId + '/invited/response/' + accept;

    	fetch(url, {
			method: 'POST',
			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json',
			},
		})
		.then(function (response) {
				
			response.json()
			.then((responseData) => {
    			
    			if(response.status == 201 || response.status == 200) { 	
    				if(accept) {		
    					thisObj.props.navigator.replace({
                            id: 'MyGroups', 
                            title: stringsGlobal.myGroupsTitle, 
                            passProps: {isArabic: isArabic,}
                        });

        				thisObj.props.navigator.push({
        					id: 'GroupDetails',
            				title: stringsGlobal.myGroupsTitle,
            				passProps: {isArabic: isArabic, group: responseData}
        				});
        			}
        			else {
        				thisObj.props.navigator.replace({
                            id: 'MyGroups', 
                            title: stringsGlobal.myGroupsTitle,
                            passProps: {isArabic: isArabic,}
                        });

        				thisObj.props.navigator.push({
        					id: 'CharityPointsHome',
            				title: stringsGlobal.mainTitle,
                            passProps: {isArabic: isArabic,}
        				});
        			}
        		return;
    			}
    			else {alert('Bad Request');
    				thisObj.setState({inProcess: false});
    			}
    		});
		})
		.catch (function (error) {
    		alert(stringsLocal.invitationError.replace("{0}", error.toString()));
    		thisObj.setState({inProcess: false});
		});
    }
    
    render() {
        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
    	
    	var group = this.state.group;
        if(group && group != null) {
    	var groupIcon = (group.ImageVPath != null && group.ImageVPath != '' ? 
    			{uri: group.ImageVPath } : require('../../contents/icons/GroupDefault.png'));
    			
		var groupIconStyle = (group.ImageVPath != null && group.ImageVPath != '' ? 
				[stylesBase.thumbnail, styleLang.thumbnail, stylesBase.groupImage] : 
				[stylesBase.thumbnail, styleLang.thumbnail]);
        
    	
    	var groupImage = (
    			<Image
                    source={groupIcon}
                	style={groupIconStyle} />
    		);
    		
        var headerDetails = (<View style={[stylesBase.rightContainer, styleLang.rightContainer]}>
                                <Text style={[stylesBase.title, styleLang.title, text]}>{group.GroupName}</Text>
                                <Text style={[stylesBase.details, styleLang.details, text]}>{group.TotalMembers} {stringsGlobal.member}</Text>
                            </View>);
    	
    	var headerFirstComponent, headerSecondComponent;
    	if(!isArabic) {
    		headerFirstComponent = groupImage;
    		headerSecondComponent = headerDetails;
    	}
    	else {
    		headerFirstComponent = headerDetails;
    		headerSecondComponent = groupImage;
    	}
    	var groupHeader = (
            <View style={[stylesBase.groupHeader, styleLang.groupHeader]}>
                <View style={[stylesBase.headerDetails, styleLang.headerDetails]}>
                    {headerFirstComponent}
                    {headerSecondComponent}
                </View>
            	<View style={[stylesBase.headerPoints, styleLang.headerPoints]}>
                	<Text style={[stylesBase.points, text]}>{group.TotalPoints}</Text>
                	<Text style={[stylesBase.points, text]}>{stringsGlobal.points}</Text>
            	</View>
            </View>);
          
        var nameText = null;
    	var msgText = null;
    	var btnAccept, btnReject, firstBtn, lastBtn;
    	
    	btnAccept = (<TouchableHighlight 
                    	style={[stylesBase.button, this.state.inProcess ? {backgroundColor: 'gray'} : stylesBase.accept]}
                    	onPress={(this.state.inProcess ? null : () => this.reponseInvitation(true))}
                    	underlayColor={this.state.inProcess ? 'gray' : '#06aebb'}>
	        			<View><Text style={[stylesBase.btnText, text]}>{stringsLocal.accept}</Text></View>
	        		</TouchableHighlight>);
    	
    	btnReject = (<TouchableHighlight activeOpacity={(this.state.inProcess ? 1 : 0.5)}
                    	style={[stylesBase.button, this.state.inProcess ? {backgroundColor: 'gray'} : stylesBase.reject]}
                    	onPress={(this.state.inProcess ? null : () => this.reponseInvitation(false))}
                    	underlayColor={this.state.inProcess ? 'gray' : '#ed3054'}>
	        			<View><Text style={[stylesBase.btnText, text]}>{stringsLocal.reject}</Text></View>
	        		</TouchableHighlight>);
    	
    	if(!isArabic) {
    		
    		firstBtn = btnAccept;
    		lastBtn = btnReject;
    		
    		nameText = <Text style={[stylesBase.title, styleLang.title, {alignSelf: 'center',}, text]}>{group.User.FullName}</Text>;
    		msgText = <Text style={[stylesBase.title, styleLang.title, {alignSelf: 'center',}, text]} >
                    		{stringsLocal.invitaionMsg.replace("{0}", "")}</Text>
    	}
    	else {
    		
    		firstBtn = btnReject;
    		lastBtn = btnAccept;
    		
    		msgText = <Text style={[stylesBase.title, styleLang.title, {alignSelf: 'center',}, text]} >
                    		{stringsLocal.invitaionMsg.replace("{0}", group.User.FullName)}</Text>
    	}
    	
        return (
  	    <View style={stylesBase.container}>
  	    	<View style={stylesBase.headerWrapper} automaticallyAdjustContentInsets={false}>
  	    		{groupHeader}
            </View>
            <View style={[stylesBase.notificationWrapper]}>
            	<View style={{alignSelf: 'center', marginBottom: 20,}}>
            		{nameText}
                    {msgText}
            	</View>
            	<View style={stylesBase.buttonsWrapper}>
            		{firstBtn}
  	    			{lastBtn}
	        	</View>        
            </View>            
            {loading}
	    </View>
        );
        }
        else {
        	return (
        		<View style={[stylesBase.container, {top: 10,}]}>
        			{loading}
        		</View>
        	);
        }
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
	en: {
		accept: 'ACCEPT',
		reject: 'REJECT',
		invitaionMsg: '{0} invited you to join this group',
		invitationError: 'Oops.. an error occured\r\n{0}',
	},
	ar: {
		accept: 'قبول',
		reject: 'رفض',
		invitaionMsg: '{0} قام بدعوتك للإنضمام لهذه المجموعة',
		invitationError: 'عذرا.. لقد حدث خطأ\r\n{0}'
	},
});
 
var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingTop: 5,
    },
    headerWrapper: {
    	borderWidth: 1,
    	borderColor: '#989898',
    	width: width - 20,
    },
    notificationWrapper: {
    	//flex: 1,
    	paddingTop: 10,
    	alignItems: 'stretch',
    },
    groupHeader: {
    	flex:1, 
    	flexDirection: 'row',
    	justifyContent: 'center', 
        alignItems: 'center', 
    },
    /*headerDetails: {
    	flex: 1, 
    	flexDirection: 'row',
        alignItems: 'center', 
        margin: 8,
    },*/
    headerPoints: {
    	position: 'absolute', 
    	top:0, 
    	bottom: 0, 
    	justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 40,
        backgroundColor: '#fe345a',
        width:70,
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
		flex: 1,
		flexDirection: 'column',
		bottom: 0,
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
    buttonsWrapper: {
    	flex: 1,
    	flexDirection: 'row',
    	alignItems: 'center',
    	width: width - 20,
    },
    button: {
    	flex: 1,
    	height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
    },
    btnText: {
    	color: '#ffffff',
    },
    accept: {
    	backgroundColor: '#06aebb',
    },
    reject: {
    	backgroundColor: '#fe345a',
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       position: 'absolute',
       top: (height / 2) - 20,
       left: (width / 2) - 40,
    },
});
var styleLang;
if(!isArabic) {
	styleLang = StyleSheet.create({		     
                
		headerDetails: {
			justifyContent: 'flex-end',
		},
		headerPoints: {
			right: 0,
		},
		memberPoints : {
    		alignSelf: 'flex-start',
		},
		container: {	
		},
		groupHeader: {	
		},
		points: {	
		},
		rightContainer: {
		},
		groupImage: {
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
		headerDetails: {
			justifyContent: 'flex-start',
		},
		headerPoints: {
			left: 0,
		},
		memberPoints : {
    		alignSelf: 'flex-end',
		},
		container: {	
		},
		groupHeader: {	
		},
		points: {	
		},
		rightContainer: {
		},
		groupImage: {
		},
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
        	fontSize: 14,
    	},
	});
}

module.exports = GroupInvitationResponse; /* making it available for use by other files */