
import React, {
    AsyncStorage,
    Alert,
} from 'react-native';

var STORAGE_KEY = '@QcApploginData:key';

let LoginHome = require('../source/account/loginHome');


var UserManager = {
	async getCurrentUser(callback) {
		let currentUser = null;
		/*currentUser = {
			DonorId: 19953,
			Phone: '66225999',
		};*/
		try {
			currentUser = await AsyncStorage.getItem(STORAGE_KEY);/*.then((value) => {
				currentUser = value;
			});*/
			//alert(JSON.parse(currentUser).DonorId)
			if(callback) {
				callback((currentUser ? JSON.parse(currentUser) : null));
			}
			//return currentUser;
		}
		catch (error) {
      		this._appendMessage('AsyncStorage error: ' + error.message);
    	}
		//AppDispatcher.dispatch(currentLanguage);
	},
	getCurrentUserId() {

	},
	getCurrentOrRedirectToLogin: function(isArabic, navigator, redirectInfo) {
		var currentUser = this.getCurrentUser(isArabic);
		if(currentUser && currentUser != null && currentUser.DonorId > 0) {
			return currentUser;
		}
		else {
			navigator.push({
                id: 'LoginHome',
                title: isArabic ? 'طرق الدخول' : 'Login Methods',
                component: LoginHome,
                passProps: {
                    redirectInfo: redirectInfo,
                    isArabic: isArabic, 
                },
            });
		}
		return null;
	},
	executeIfOuthenticated: function(callback, isArabic, navigator, redirectInfo) {
		var currentUser = this.getCurrentOrRedirectToLogin(isArabic, navigator, null) 
		if(currentUser) {
			if(callback) {
				callback();
			}
		}
	},	
    loginDonorByFoundDetails: function(donorId, redirectInfo, navigator) {
        /*Alert.alert(
            "Success",
            "User Logged in Data: " + JSON.stringify(responseData)
        );*/
        //let id = responseData.DonorId;
        //var self=this;
        fetch('http://servicestest.qcharity.org/api/User/GetDonorById?id='+donorId, {  
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json()) 
        .then((responseData) => { 
        	alert(JSON.stringify(responseData))
        	let user = {
        		DonorId: responseData.DonorID,
        		DonorCode: responseData.DonorCode,
        		SalutationId: responseData.SalutationID,
        		SalutationName: responseData.SalutationName,
        		FullName: responseData.FullName,
        		Email: responseData.Email,
        		UserName: responseData.UserName,
        		Password: responseData.Password,
        		Phone: responseData.Phone,
        		IsMale: (responseData.SexId == 'M'),
        		LanguageId: responseData.LanguageId,
        		DonorPhoto: responseData.DonorPhotoPath,
        		GoogleLoginId: responseData.GoogleLoginId,
        		FacebookLoginId: responseData.FacebookLoginId,
        	};
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user),function(){
	            navigator.push({ name:'dashboard' });
	        });
        })
        .catch((error) => { alert(error); }).done();

              
    },
    loginMobileUser:function(userData, redirectInfo, navigator) {
        Alert.alert("Login Success", JSON.stringify(userData));
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData),function(){
            navigator.push({ name:'dashboard' });
        });         
    }

};

module.exports = UserManager;