var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
var EmitterSubscription = require('EmitterSubscription');
var assign = require('object-assign');

var _currentTab = 'home';
var CHANGE_EVENT = 'changeTab';

function setTab(currentTab) {
	_currentTab = currentTab;
}

class TabEventEmitter extends EventEmitter { 
	addChangeTabListener(callback) {
		this.addListener(CHANGE_EVENT, callback)
	}

	removeChangeTabListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	CurrentTab() {
		return _currentTab;
	}

	emitChangeTab() {
		this.emit(CHANGE_EVENT);
	}
}
var TabEventEmitterObj = new TabEventEmitter();

function handleTabAction(action) {
	if (action.type === 'set_tab') {
		setTab(action.currentTab);
		TabEventEmitterObj.emitChangeTab();
	}
}

TabEventEmitterObj.dispatchToken = AppDispatcher.register(handleTabAction);
module.exports = TabEventEmitterObj;