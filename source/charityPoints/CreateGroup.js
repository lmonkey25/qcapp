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
var UIImagePickerManager = require('NativeModules').ImagePickerManager;
var fileUpload = require('NativeModules').FileUpload;
var windowWidth = width;

var userId = null;
let isArabic = true;

class CreateGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatarSource: require('../../contents/icons/addGroupImg.png'),
            groupName: '',
            inProcess: false,
       };
    }

    componentDidMount() {
        isArabic = this.props.isArabic;
        stringsGlobal.setLanguage(isArabic ? 'ar' : 'en');
        stringsLocal.setLanguage(isArabic ? 'ar' : 'en');
    }
    
    picImage() {
      	var options = {
      			title: stringsGlobal.pickPic, // specify null or empty string to remove the title
      			cancelButtonTitle: stringsGlobal.cancel,
      			takePhotoButtonTitle: null,
      			chooseFromLibraryButtonTitle: stringsGlobal.pickFormLib, // specify null or empty string to remove this button
      			customButtons: null,
      			mediaType: 'photo', // 'photo' or 'video'
      			maxWidth: 146, // photos only
      			maxHeight: 146, // photos only
      			//aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
      			//aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
      			quality: 0.2, // photos only
      			angle: 0, // photos only
      			allowsEditing: false, // Built in functionality to resize/reposition the image
      			noData: false, // photos only - disables the base64 `data` field from being generated 
      							//(greatly improves performance on large photos)
      			/*storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory 
      								//(rather than a temporary directory)
        			skipBackup: true, // image will NOT be backed up to icloud
        			path: 'images' // will save image at /Documents/images rather than the root
      			}*/
  		  };
		
    		/**
    		* The first arg will be the options object for customization, the second is
    		* your callback which sends bool: didCancel, object: response.
    		*
    		* response.didCancel will inform you if the user cancelled the process
    		* response.error will contain an error message, if there is one
    		* response.data is the base64 encoded image data (photos only)
    		* response.uri is the uri to the local file asset on the device (photo or video)
    		* response.isVertical will be true if the image is vertically oriented
    		* response.width & response.height give you the image dimensions
    		*/
    		//alert(options);
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
          			this.setState({
            				avatarSource: source
          			});
      			}
    		});
    }
    
    createGroup() {
        if(this.props.currentUser && this.props.currentUser != null) {
            userId = this.props.currentUser.DonorId;
        }
        
        if(userId && userId != null && userId > 0) {
            this.setState({inProcess: true});
    	
            if(this.state.groupName != '') {
        		    var groupName =this.state.groupName.trim();
        		    const obj = {
              		  uploadUrl: encodeURI('http://portal.qcharity.net/QCPointsApiTest/api/groups/create/'
              				            + this.state.groupName +'/' + userId),
                		method: 'POST',
                		headers: {
                  		  'Accept': 'application/json',
                		},
                    
                		files: [{
                  			name: 'groupImage',
                    		filename: userId + '_' + this.state.groupName + '.jpg', // this is what your server is looking for
                    		filepath: this.state.avatarSource.uri, // uri from response (local path of image on device)
                    		//filetype: 'image/jpeg'
                		}]
                };

                fileUpload.upload(obj, (err, result) => {
            		    var data = JSON.parse(result.data);
            		
                    if(result.status == 201 || result.status == 200) {
                		    var url = 'http://portal.qcharity.net/QCPointsApiTest/api/groups/details/' + data.GroupId;
                		    fetch(url)
                  			.then((response) => response.json())
                  			.then((responseData) => {
                    				this.props.navigator.replace({id: 'MyGroups', title: stringsGlobal.myGroupsTitle, isArabic: isArabic,});
                    				this.props.navigator.push({
                    				    id: 'GroupDetails',
                        				title: stringsGlobal.myGroupsTitle,
                        				passProps: {group: responseData, isArabic: isArabic}
                    				});
            		        })
            			      .done();            		
                		}
                		else {
                		    alert(result.data);
                		    this.setState({inProcess: false});
                		}
                });
            }
            else {
                this.setState({inProcess: false});
            }
        }
    }


    render() {
        
        let loading = null;
        if(this.state.inProcess) {   
            loading = (
                <QCLoading />
            );
        }
        return (
      	    <View style={styles.container}>
        	    	<TouchableHighlight 
                      	style={styles.addGroupImage}
                      	onPress={() => this.picImage()}
                      	underlayColor={'transparent'}>
      	        	  <Image source={this.state.avatarSource} style={styles.addGroupImage} />
      	        </TouchableHighlight>
      	        <View style={styles.textBoxWrapper}>
                  	<TextInput autoFocus={true} maxLength={15} 
                  					placeholder={stringsLocal.groupName}
                  					style={[styles.textBox, text]}
                  					placeholderTextColor={'#8a8a8a'}
                  					onChangeText={(textVal) => {this.setState({groupName: textVal,})}} />
                </View>
                <TouchableHighlight activeOpacity={(this.state.inProcess ? 1 : 0.5)}
                          	style={styles.btnAddGroup}
                          	onPress={(this.state.inProcess ? null : () => this.createGroup())}
                          	underlayColor={'transparent'}>
      	        	  <Text style={[styles.btnText, {
              				              backgroundColor: this.state.inProcess ? 'gray' : '#ed3054',}, text]}>{stringsLocal.create}</Text>
      	        </TouchableHighlight>
            </View>
        );
    }
}

let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
let stringsLocal = new LocalizedStrings({
	en: {
		groupName: 'Group Name',
		create: 'CREATE',
	},
	ar: {
		groupName: 'اسم المجموعة',
		create: 'إنشاء',
	},
}); 
let styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    addGroupImage: {
      	width: 146,
      	height: 146,
    },
    textBoxWrapper: {
      	height: 45,
      	alignItems: 'center',
        marginTop: 35,
    },
    textBox: {
      	height: 35, 
      	backgroundColor: 'white', 
        borderWidth: 1, 
        borderColor: '#ed3054',
    		paddingHorizontal: 5,
    		paddingVertical: 3,
    		textAlign: 'center',
    		width: windowWidth - 60,
    },
    btnAddGroup: {
        height: 35,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'row',
    },
    btnText: {
        height: 35,
        flex: 1,
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        paddingTop: 5,
    },
});

module.exports = CreateGroup; /* making it available for use by other files */