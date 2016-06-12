var AppDispatcher = require('../dispatcher/AppDispatcher');

var CurrentLanguageSetter = {
	setLanguage: function(isAr) {

		var currentLanguage = {
			type: 'set_language',
			isArabic: isAr,
		};

		AppDispatcher.dispatch(currentLanguage);
	}
};

module.exports = CurrentLanguageSetter;