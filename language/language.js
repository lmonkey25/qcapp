var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
var EmitterSubscription = require('EmitterSubscription');
var assign = require('object-assign');

var _isArabic = true;
var CHANGE_EVENT = 'change';

function setLanguage(isAr) {

	_isArabic = isAr;
}

class Language extends EventEmitter { 
	addChangeListener(callback) {
		this.addListener(CHANGE_EVENT, callback)
		//alert("addListener")
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	isArabic() {
		return _isArabic;
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}
}
var LanguageObj = new Language();
/*var Language = assign({}, EventEmitter.prototype, {
	addChangeListener: function (callback) {
		//this.addListener(CHANGE_EVENT, callback)
		alert(this._subscriber)
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	isArabic: function() {
		return _isArabic;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	}
});*/

function handleAction(action) {
	if (action.type === 'set_language') {
		setLanguage(action.isArabic);
		LanguageObj.emitChange();
	}
}

LanguageObj.dispatchToken = AppDispatcher.register(handleAction);
module.exports = LanguageObj;