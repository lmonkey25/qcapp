import React, {
    AsyncStorage,
} from 'react-native';

var STORAGE_KEY = '@QcApploginData:key';

var AccountController = {
	isAuthenticatedOrRedirectToLogin: function(currentUser, isArabic, navigator, redirectInfo) {
		if(currentUser && currentUser != null) {
	  		return true;
	  	}
	  	else {
    		navigator.push({
	            id: 'LoginHome',
	            title: isArabic ? 'طرق الدخول' : 'Login Methods',
	            passProps: {
	                redirectInfo: redirectInfo,
	                isArabic: isArabic, 
	            },
	        });
	        return false;
	  	}
	},
	executeIfAuthenticated: function(currentUser, callback, isArabic, navigator, redirectInfo) {
		var isAuthenticated = this.isAuthenticatedOrRedirectToLogin(currentUser, isArabic, navigator, redirectInfo) 
		if(isAuthenticated) {
    		if(callback) {
    		    callback(currentUser);
    		}
  		}
	},
	loginDonor: function(donorId, redirectInfo, navigator, isArabic, callback) {

	    fetch('http://servicestest.qcharity.org/api/User/GetDonorById?id='+donorId, {  
	        method: 'GET',
	        headers: {
	            'Accept': 'application/json', 
	            'Content-Type': 'application/json',
	        },
	    })
	    .then((response) => response.json()) 
	    .then((responseData) => { 
	        //alert(JSON.stringify(responseData))
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
	        	debugger;
	        	if(callback) {
	    		    callback(() => {debugger;
	    		    	navigator.replace({
	    		    		id: 'QCHome',
	    		    		title: 'welcome',
	    		    	});
	    		    	if(redirectInfo && redirectInfo != null) {
			                navigator.push({ 
			                    id: redirectInfo.id,
			                    title: redirectInfo.title,
			                    passProps: { isArabic: isArabic, },
			                });
			            }
			            else {
			                navigator.push({ 
			                    id: 'MyProfile',
			                    title: isArabic ? 'الملف الشخصي' : 'My Profile',
			                    passProps: { isArabic: isArabic, },
			                });
			            }
	    		    });
	    		}
	    		else {
		            if(redirectInfo && redirectInfo != null) {
		                navigator.push({ 
		                    id: redirectInfo.id,
		                    title: redirectInfo.title,
		                    passProps: { isArabic: isArabic, },
		                });
		            }
		            else {
		                navigator.push({ 
		                    id: 'MyProfile',
		                    title: isArabic ? 'الملف الشخصي' : 'My Profile',
		                    passProps: { isArabic: isArabic, },
		                });
		            }
		        }
	        });
	    })
	    .catch((error) => { alert(error); }).done();  
	},
	logout: function(navigator, isArabic, callback) {
	    AsyncStorage.removeItem(STORAGE_KEY, function(){
	    	if(callback) {
    		    callback();
    		}
	        navigator.push({ 
	            id: 'QCHome',
	            title: 'Welcome',
	            passProps: {isArabic: isArabic}
	        });
	    });
	},
	getLoginNavigationInfo: function(isArabic) {
	  	return {
	        id: 'LoginHome',
	        title: isArabic ? 'طرق الدخول' : 'Login Methods',
	    }
	},	
	loginMobileUser: function(userData, redirectInfo, navigator, isArabic, callback) {
    //Alert.alert("Login Success", JSON.stringify(userData));
	    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData),function(){
	    	if(callback) {
	    		    callback(() => {
				        if(redirectInfo && redirectInfo != null) {
				            navigator.push({ 
				                id: redirectInfo.id,
				                title: redirectInfo.title,
				                passProps: { isArabic: isArabic, },
				            });
				        }
				        else {
				            navigator.push({ 
				                id: 'MyProfile',
				                title: isArabic ? 'الملف الشخصي' : 'My Profile',
				                passProps: { isArabic: isArabic, },
				            });
				        }
				    })
	    		}
	    		else {
		            if(redirectInfo && redirectInfo != null) {
		                navigator.push({ 
		                    id: redirectInfo.id,
		                    title: redirectInfo.title,
		                    passProps: { isArabic: isArabic, },
		                });
		            }
		            else {
		                navigator.push({ 
		                    id: 'MyProfile',
		                    title: isArabic ? 'الملف الشخصي' : 'My Profile',
		                    passProps: { isArabic: isArabic, },
		                });
		            }
		        }
	    });
	}
}

module.exports = AccountController;