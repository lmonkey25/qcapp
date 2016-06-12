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
var UIImagePickerManager = require('NativeModules').ImagePickerManager;
var fileUpload = require('NativeModules').FileUpload;

var GlobalResource = require('./GlobalResource');

let QCLoading =  require('../../qcLoading');
var i = 0;
let isArabic = true;
let donorId = null;

class GroupDetails extends Component {
	
	constructor(props) {
       super(props);
       this.state = {
       		inProcess: false,
            imagePath: require('../../contents/icons/GroupDefault.png'),
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
           }),
       };
    }

    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');

    	var group = this.props.group;
    	if(group && group != null) {
    		if(group.Members && group.Members != null && group.Members.length > 0) {
        		this.setState({
        			imagePath: {uri: group.ImageVPath },
        			dataSource: this.state.dataSource.cloneWithRows(group.Members),
        		});
        	}
        	else {
        		this.setState({imagePath: {uri: group.ImageVPath },});
        	}
        }
    }
    
    picImage() {
    	var options = {
  			title: stringsGlobal.pickPic, 
  			cancelButtonTitle: stringsGlobal.cancel,
  			takePhotoButtonTitle: null,
  			chooseFromLibraryButtonTitle: stringsGlobal.pickFormLib,
  			customButtons: null,
  			mediaType: 'photo', 
  			maxWidth: 146,
  			maxHeight: 146, 
  			quality: 0.2,
  			angle: 0,
  			allowsEditing: false,
  			noData: false,
		};
		
		UIImagePickerManager.launchImageLibrary(options, (response) => {
			if (response.didCancel) {
    			console.log('User cancelled image picker');
  			}
  			else if (response.error) {
    			console.log('ImagePickerManager Error: ', response.error);
  			}
  			else if (response.customButton) {
    			console.log('User tapped custom button: ', response.customButton);
  			}
  			else {
    			// You can display the image using either data:
    			const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
    			this.updateGroup(source.uri);
  			}
		});
    }
    
    updateGroup(uri) {
    	
        if(this.props.currentUser && this.props.currentUser != null) {
            donorId = this.props.currentUser.DonorId;
        }
        
        if(donorId && donorId != null && donorId > 0) {
            this.setState({inProcess: true});
    	
        	if(uri) {
        		var url = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/' 
              						+ donorId + '/update/'+ this.props.group.GroupName + '/' + this.props.group.GroupId;
        		//alert(url);
        		const obj = {
              		uploadUrl: encodeURI(url),
              		method: 'POST',
              		headers: {
                		'Accept': 'application/json',
              		},
              		files: [{
              			name: 'groupImage',
                		filename: donorId + '_' + this.props.group.GroupName + '.jpg',
                		filepath: uri,
              		}]
            	};

            	fileUpload.upload(obj, (err, result) => {
            		var data = JSON.parse(result.data);
            		
                	if(result.status == 201 || result.status == 200) {
                	//alert(data.ImageVPath);
                		this.setState({
                			inProcess: false,
                			imagePath: {uri: data.ImageVPath},
                		});           		
            		}
            		else {
            			//alert(result.data);
            			this.setState({inProcess: false});
            		}
            	});
            }
            else {
            	this.setState({inProcess: false});
            } 
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
    
	goAddMemers() {
        this.props.navigator.push({
        	id: 'AddMember',
            title: stringsLocal.addMembersTitle,
            passProps: {group: this.props.group, isArabic: isArabic},
        });
    }
    
    renderMember(member) {
    	var donorPhotoPath = member.User.DonorPhotoPath;
		var memberPic;
		if(donorPhotoPath && donorPhotoPath != '') {
			memberPic = {uri: donorPhotoPath};
		}
		else {
			memberPic = (member.User.IsMale ? require('../../contents/icons/MemberMale.png') :
						require('../../contents/icons/MemberFemale.png'));
		}

		var memberDetails = (<View style={stylesBase.rightContainer}>
                	<Text style={[stylesBase.title, styleLang.title, text]}>{member.User.FullName}</Text>
                    <View style={[stylesBase.memberPoints, styleLang.memberPoints]}>
                    	<Text style={[stylesBase.pointText, styleLang.pointText, text]}>{member.TotalGainedPoints} {stringsGlobal.points}</Text>
                    </View>
                </View>);
        var memberImg = (<Image source={memberPic}
                       style={[stylesBase.thumbnail, styleLang.thumbnail, {width: 70,}]} />);
		var firstComponent, secondComponent;
		if(!isArabic) {
			firstComponent=memberImg;
			secondComponent=memberDetails;
		}
		else  {
			firstComponent=memberDetails;
			secondComponent=memberImg;
		}
        return (
            <View style={[stylesBase.itemWrapper, ((i++ % 2) === 0) && stylesBase.evenItemWrapper,]}>
                {firstComponent}
            	{secondComponent}
            </View>
        );
    }
    
    render() {
    
    	var group = this.props.group;
    	if(!group || group == null || Object.keys(group).length === 0) {
    		return null;
    	}
    	var addMemberBtn = null;
    	var groupImage = null;
    	
    	var groupIconStyle = 
    		(this.state.imagePath != require('../../contents/icons/GroupDefault.png') ? 
    			[stylesBase.thumbnail, styleLang.thumbnail, stylesBase.groupImage] : 
    			[stylesBase.thumbnail, styleLang.thumbnail]);
        var group=this.props.group;
    	var groupIcon = (group.ImageVPath != null && group.ImageVPath != '' ? 
    			{uri: group.ImageVPath } : require('../../contents/icons/GroupDefault.png'));
		var groupIconStyle = (group.ImageVPath != null && group.ImageVPath != '' ? 
				[stylesBase.thumbnail, styleLang.thumbnail, stylesBase.groupImage] : 
				[stylesBase.thumbnail, styleLang.thumbnail]);
        
        let loading = null;
        if(this.state.inProcess) {   
            loading = (
                <QCLoading />
            );
        }
    	if(this.props.group.CreatorUserId == donorId) {
    		var btnText = (<Text style={[stylesBase.btnText, styleLang.btnText, text]}>{stringsLocal.addMember}</Text>);
    		var btnIcon = (<Image style={[stylesBase.img, styleLang.img]} source={require('../../contents/icons/AddMember.png')} />);
    		var firstComponent, secondComponent;
    		if(!isArabic) {
    			firstComponent = btnIcon;
    			secondComponent = btnText;
    		} 
    		else {
    			firstComponent = btnText;
    			secondComponent = btnIcon;
    		}
    		addMemberBtn = (<TouchableHighlight 
                    	style={[stylesBase.button, this.state.inProcess && {backgroundColor: 'gray'}]}
                    	onPress={this.state.inProcess ? null : () => this.goAddMemers()}
                    	underlayColor={this.state.inProcess ? 'gray' : '#06aebb'}>
					<View style={stylesBase.wrapper}>
                        {firstComponent}
                    	{secondComponent}
            		</View>
                </TouchableHighlight>);
    	
    		groupImage = (
            	<TouchableHighlight 
                    	onPress={this.state.inProcess ? null : () => this.picImage()}
                    	underlayColor={'transparent'}>
                    <Image
                        source={this.state.imagePath}
                		style={groupIconStyle} />
                </TouchableHighlight>
            );
    	}
    	else {
    		groupImage = (
    			<Image
                    source={this.state.imagePath}
                	style={groupIconStyle} />
    		);
    	}
    	var headerDetails = (<View style={stylesBase.rightContainer}>
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
    	var groupHeader = (<View style={stylesBase.groupHeader}>
                        <View style={[stylesBase.headerDetails, styleLang.headerDetails]}>
                            {headerFirstComponent}
                            {headerSecondComponent}
                        </View>
                    	<View style={[stylesBase.headerPoints, styleLang.headerPoints]}>
                        	<Text style={[stylesBase.points, text]}>{group.TotalPoints}</Text>
                        	<Text style={[stylesBase.points, text]}>{stringsGlobal.points}</Text>
                    	</View>
                        {loading}
                </View>);
    	
        return (
  	    <View style={stylesBase.container}>
  	    	<View style={stylesBase.headerWrapper}>
  	    		{groupHeader}
                {addMemberBtn}
            </View>
            <ListView
            			dataSource={this.state.dataSource}
            			automaticallyAdjustContentInsets={false}
                		renderRow={this.renderMember.bind(this)}
                		initialListSize={1}
                		style={stylesBase.listView}
                		contentContainerStyle={{alignItems: 'stretch',}} />
	    </View>
        );
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
	en: {
		addMember: 'ADD MEMBERS',
		addMembersTitle: 'Add Members',
	},
	ar: {
		addMember: 'إضافة أعضاء',
		addMembersTitle: 'إضافة أعضاء',
	},
});

var stylesBase = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f0f0',
        justifyContent: 'flex-start',
    	padding: 8,
    	paddingTop: 5,
    },
    headerWrapper: {
    	borderWidth: 1,
    	borderColor: '#989898',
    },
    groupHeader: {
    	flex:1, 
    	flexDirection: 'row',
    	justifyContent: 'center', 
        alignItems: 'center', 
    },
    headerDetails: {
    	flex: 1, 
    	flexDirection: 'row',
        alignItems: 'center', 
        margin: 8,
    },
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
    itemWrapper: {
    	backgroundColor: '#ffffff',
    	borderTopWidth: 1,
    	borderColor: '#989898',
    	flex: 1, flexDirection: 'row',
    	padding: 10, 
    },
    evenItemWrapper: {
    	backgroundColor: '#f2f2f2',
    },
    memberPoints : {
    	justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#06aebb',
        height:30,
        paddingHorizontal:5,
    },
    pointText: { 
    	color: '#fff', 
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
    listView: {
        flex: 9,
        paddingTop: 1,
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       position: 'absolute',
       top: 20,
       
    },
    loadingRight: {
    	right: 20,
    },
    loadingLeft: {
    	left: 20, //(width / 2) - 40,
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
		pointText: {
    		fontSize: 13,		
		},
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
		headerDetails: {
			justifyContent: 'flex-start',
		},
		headerPoints: {
			left: 0,
		},
		memberPoints : {
    		alignSelf: 'flex-end',
		},
		pointText: {
    		fontSize: 13,		
		},
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

module.exports = GroupDetails;