import React, {
    AsyncStorage,
    Alert,
} from 'react-native';

var STORAGE_KEY = '@QcApploginData:key';
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript

class User {
    constructor(callback) {
        this.isAuthenticated = true;
        this.currentUser;
        return AsyncStorage.getItem(STORAGE_KEY, callback(error, result));

    }
}
/*var User = async function () {
    this.isAuthenticated = true;
    this.currentUser = null;
  	let value = await AsyncStorage.getItem(STORAGE_KEY);
    //.then((value) => {//alert(value)
    		if(value && value != null) {
      			this.currentUser = JSON.parse(value);
      			this.isAuthenticated = true;
    		}
    		else {
      			this.currentUser = null;
      			this.isAuthenticated = false;//alert(this.isAuthenticated)
    		}
   // });
};

User.prototype.sayHello = function() {
    while(this.isAuthenticated) {
  		  if(this.currentUser && this.currentUser != null) {
        		alert("Hello, I'm " + this.currentUser.FullName);
        		break;
    		}
  	}
  	if(!this.isAuthenticated) {
  		  alert('Please Login')
  	}
};

User.prototype.getCurrentUser = function() {
    let loggedInUser = null;
    while(this.isAuthenticated) {
  		  if(this.currentUser && this.currentUser != null) {
  	  	    loggedInUser = this.currentUser;
            break;
    		}
  	}
  	//return null;
    return this.currentUse;
};*/

var UserManager = new User();

module.exports = UserManager;