'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
  	Image,
  	ListView,
  	TouchableHighlight,
} from 'react-native';

import LocalizedStrings from 'react-native-localization';
import { height, width, text, } from '../utilities/constants';

var PostShareItem = require('./PostShareItem');
var GlobalResource = require('./GlobalResource');

let QCLoading =  require('../../qcLoading');

var userId = null;
let isArabic = true;

var REQUEST_URL = 'http://portal.qcharity.net/QCPointsApiTest/api/posts/';

var SocialMediaAr = [];
var SocialMediaEn = [];

SocialMediaEn = [
  {
    SocialMediaId: 1,
    SocialMediaName: 'Facebook',
    Icon: require('../../contents/icons/Facebook.png'),
    IconActive: require('../../contents/icons/FacebookActive.png'),
  },
  {
    SocialMediaId: 2,
    SocialMediaName: 'Twitter',
    Icon: require('../../contents/icons/Twitter.png'),
    IconActive: require('../../contents/icons/TwitterActive.png'),
  },
  {
    SocialMediaId: 4,
    SocialMediaName: 'Whatsapp',
    Icon: require('../../contents/icons/Whatsapp.png'),
    IconActive: require('../../contents/icons/WhatsappActive.png'),
  },
  {
    SocialMediaId: 8,
    SocialMediaName: 'Other',
    Icon: require('../../contents/icons/Share.png'),
    IconActive: require('../../contents/icons/shareOther.png'),
  },
];
	SocialMediaAr = [
  {
    SocialMediaId: 4,
    SocialMediaName: 'Whatsapp',
    Icon: require('../../contents/icons/Whatsapp.png'),
    IconActive: require('../../contents/icons/WhatsappActive.png'),
  },
  {
    SocialMediaId: 2,
    SocialMediaName: 'Twitter',
    Icon: require('../../contents/icons/Twitter.png'),
    IconActive: require('../../contents/icons/TwitterActive.png'),
  },
  {
    SocialMediaId: 1,
    SocialMediaName: 'Facebook',
    Icon: require('../../contents/icons/Facebook.png'),
    IconActive: require('../../contents/icons/FacebookActive.png'),
  },
  {
    SocialMediaId: 8,
    SocialMediaName: 'Other',
    Icon: require('../../contents/icons/shareOther.png'),
    IconActive: require('../../contents/icons/Share.png'),
  },
];
class PostShare extends Component {

	constructor(props) {
       super(props);
       this.state = {
            isLoading: true,
            inProcess: false,
            post: {},
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
            }).cloneWithRows((isArabic? SocialMediaAr : SocialMediaEn)),
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
               post: responseData,
               isLoading: false,
            });
        })
        .done();
    }
    
    renderLoadingView() {
        return (
            <View style={[stylesBase.loading, this.state.inProcess && stylesBase.inProcessLoading]}>
                <ActivityIndicatorIOS size='large'/>
                <Text>
                    {stringsGlobal.loading}
                </Text>
            </View>
        );
    }
    
    toggleLoading(inProcess) {
    	this.setState({
    		inProcess: inProcess,
    	});
    }
  
	rederItem(item) {
		if(item.SocialMediaId == 6 && (!this.state.post.ImageVPath || this.state.post.ImageVPath == '')) {
			return null;
		}
		return (<PostShareItem item={item} post={this.state.post} userId={userId}
					onShare={(inProcess) => this.toggleLoading(inProcess)} isArabic={isArabic} />);
	}
	
    render() {
        let loading = null;
        if(this.state.isLoading) {   
            loading = (
                <QCLoading />
            );
        }
        else {
          if (this.state.inProcess) {
              loading = (
                <QCLoading />
              );
          }
        }
    	
        return (
        <View style={stylesBase.container}>
  	    	<ListView contentContainerStyle={[stylesBase.list, styleLang.list]}
        		dataSource={this.state.dataSource}
        		renderRow={this.rederItem.bind(this)} />
        	{loading}
        </View>
        );

    }
}
 
let stringsGlobal = new LocalizedStrings(GlobalResource.globalStrings);
        
var stylesBase = StyleSheet.create({
	list: {
      	flexDirection: 'row',
      	flexWrap: 'wrap',
      	margin:20,
  	},
    item: {
        alignItems: 'center',
        margin: 10,
        width:70,
        height: 100,
    },
    description: {
        fontSize: 20,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
    	backgroundColor: '#eeeeee',
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
    },
    inProcessLoading: {
       position: 'absolute',
       top: (height / 2) - 20,
       left: (width / 2) - 40,
    },
});

var styleLang;
if(!isArabic) {
	styleLang = StyleSheet.create({	
		list: {
        	justifyContent: 'flex-start',
		},
	});
}
else {
	styleLang = StyleSheet.create({	
		list: {
        	justifyContent: 'flex-end',
		},
	});
}

module.exports = PostShare; /* making it available for use by other files */