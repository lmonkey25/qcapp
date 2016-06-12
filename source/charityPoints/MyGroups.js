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

var GroupNotificationsButton = require('./GroupNotificationsButton');
var GlobalResource = require('./GlobalResource');

let QCLoading =  require('../../qcLoading');
var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/';

let isArabic = true;

class MyGroups extends Component {
	
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
    }
    componentWillMount() {
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
        	var thisObj = this;
            fetch(REQUEST_URL + donorId)
            .then((response) => {
            
            	response.json()
    			.then((responseData) => {
        			
        			if(response.status == 201 || response.status == 200) { 	
        				thisObj.setState({
                   			dataSource: thisObj.state.dataSource.cloneWithRows(responseData),
                   			isLoading: false,
                		});
        			}
        			else {alert('Bad Request');
        				thisObj.setState({isLoading: false});
        			}
        		});
            })
            .done();
        }
        else {
            let loginInfo = AccountController.getLoginNavigationInfo(isArabic);
            let redirectInfo = {
                id: 'MyGroups',
                title: isArabic ? 'مجموعاتي' : 'My Groups',
                passProps: null,
            }
            this.props.navigator.push({
                id: loginInfo.id,
                title: loginInfo.title,
                passProps: { isArabic: isArabic, redirectInfo: redirectInfo, },
            });
        }
    }

	goDetails(group) {
        this.props.navigator.push({
        	id: 'GroupDetails',
            title: stringsGlobal.myGroupsTitle,
            passProps: {group: group, isArabic: isArabic}
        });
    }

	goCreateGroup() {
        this.props.navigator.push({
        	id: 'CreateGroup',
            title: stringsGlobal.createTitle,
            passProps: {isArabic: isArabic}
        });
    }
    
    renderGroup(group) {
    	if(!group || group == null || Object.keys(group).length === 0) {
    		return (<View><Text style={[stylesBase.title, text]}>stringsLocal.noDataMsg</Text></View>);
    	}
		var groupIcon = (group.ImageVPath != null && group.ImageVPath != '' ? 
							{uri: group.ImageVPath } : require('./icons/GroupDefault.png'));
		var groupIconStyle = (group.ImageVPath != null && group.ImageVPath != '' ? 
						[stylesBase.thumbnail, styleLang.thumbnail, stylesBase.groupImage] : 
						[stylesBase.thumbnail, styleLang.thumbnail]);
						
		var points = (
			<View style={stylesBase.pointsWrapper}>
            	<Text style={[stylesBase.points, text]}>{group.TotalPoints}</Text>
                <Text style={[stylesBase.points, text]}>{stringsGlobal.points}</Text>
            </View>
		);
		var details = (
			<View style={stylesBase.rightContainer}>
                <Text style={[stylesBase.title, styleLang.title, text]}>{group.GroupName}</Text>
                <Text style={[stylesBase.details, styleLang.details, text]}>{group.TotalMembers} {stringsGlobal.member}</Text>
            </View>
		);
		var image = (<Image source={groupIcon} style={groupIconStyle} />);
		
		var detailsFirst, detailsSecond;
		if(!isArabic) {
			detailsFirst = image;
			detailsSecond = details;
		}
		else  {
			detailsFirst = details;
			detailsSecond = image;
		}
		var detailsWrapper = (
			<View style={stylesBase.groupWrapper}>
            	{detailsFirst}
                {detailsSecond}
            </View>
		);
		
		var firstContent, secondContent;
		if(!isArabic) {
			firstContent = detailsWrapper;
			secondContent = points;
		}
		else  {
			firstContent = points;
			secondContent = detailsWrapper;
		}
        return (
            <View style={stylesBase.itemWrapper}>
                <TouchableHighlight style={{padding: 10,}}
                    		onPress={() => this.goDetails(group)}
                    		underlayColor={'transparent'}>
                    <View style={stylesBase.detailsWrapper}>
                    	{firstContent}
                        {secondContent}
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

        var btnText = (<Text style={[stylesBase.btnText, styleLang.btnText, text]}>{stringsGlobal.createGroup}</Text>);
        var btnIcon = (<Image style={[stylesBase.img, styleLang.img]} source={require('../../contents/icons/createGroup.png')} />);
        
        var firstContent, secondContent;
		if(!isArabic) {
			firstContent = btnIcon;
			secondContent = btnText;
		}
		else  {
			firstContent = btnText;
			secondContent = btnIcon;
		}

        return (
  	    	<View style={stylesBase.container}>
                <View style={stylesBase.btnContainer}>
                    <TouchableHighlight 
                        	style={stylesBase.button}
                        	onPress={() => this.goCreateGroup()}
                        	underlayColor={'#06aebb'}>
    					<View style={stylesBase.wrapper}>
                            {firstContent}
                        	{secondContent}
                		</View>
                    </TouchableHighlight>
                    <GroupNotificationsButton navigator={this.props.navigator} 
                        isArabic={isArabic} donorId={this.props.currentUser.DonorId} />
                </View>
            	<ListView
        			dataSource={this.state.dataSource}
        			automaticallyAdjustContentInsets={false}
            		renderRow={this.renderGroup.bind(this)}
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
		noDataMsg: 'You didn\'t join any group yet.',
	},
	ar: {
		noDataMsg: 'انت غير منضم لأي مجموعة.',
	}
});

var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginBottom:55,
        backgroundColor: '#f1f0f0',
    },
    btnContainer: {        
        width: width,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    button: {
        height: 45,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
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
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
    },
    listView: {
        flex: 1,
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
        	fontSize: 18,
		
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
        	fontSize: 18,
		
		},
    	details: {
    		textAlign : 'right',
        	fontSize: 14,
    	},
	});
}

module.exports = MyGroups; /* making it available for use by other files */