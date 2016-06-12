var AppDispatcher = require('../dispatcher/AppDispatcher');

var CurrentTabSetter = {
	setTab: function(newTab) {

		var currentTab = {
			type: 'set_tab',
			currentTab: newTab,
		};

		AppDispatcher.dispatch(currentTab);
	}
};

module.exports = CurrentTabSetter;
