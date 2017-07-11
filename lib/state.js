'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getQueryparamData = exports.getQueryparamState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = require('query-string');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This will get the current state information from the queryparams
 * @param  settings             An object containing the settings to retreive the state from the queryparams
 * @param  settings.keys        The keys to read from the url
 * @param  settings.transformer An object containing methods to transform certain querparam values
 * @param  settings.reducer     The reducer to update in the store
 * @param  settings.state       The initial state to modify
 * @return                      An object containing the needed information in the right format
 */
var getQueryparamState = exports.getQueryparamState = function getQueryparamState(_ref) {
	var _ref$keys = _ref.keys,
	    keys = _ref$keys === undefined ? [] : _ref$keys,
	    _ref$transformer = _ref.transformer,
	    transformer = _ref$transformer === undefined ? {} : _ref$transformer,
	    reducer = _ref.reducer,
	    state = _ref.state;

	var stateSlice = getQueryparamData({ keys: keys, transformer: transformer });

	return _extends({}, state, _defineProperty({}, reducer, _extends({}, state[reducer], stateSlice)));
};

/**
 * This will get an object containing the data contained in the queryparams
 * @param  settings             An object containing the settings to retreive the state from the queryparams
 * @param  settings.keys        The keys to read from the url
 * @param  settings.transformer An object containing methods to transform certain querparam values
 * @return                      An object containing the needed information in the right format
 */
var getQueryparamData = exports.getQueryparamData = function getQueryparamData(_ref2) {
	var _ref2$keys = _ref2.keys,
	    keys = _ref2$keys === undefined ? [] : _ref2$keys,
	    _ref2$transformer = _ref2.transformer,
	    transformer = _ref2$transformer === undefined ? {} : _ref2$transformer;

	var params = (0, _queryString.parse)(window.location.search);
	transformer = keys.reduce(function (transformer, key) {
		return Object.keys(transformer).indexOf(key) !== -1 ? transformer : _extends({}, transformer, _defineProperty({}, key, function (value) {
			return value;
		}));
	}, transformer);

	return Object.keys(params).filter(function (key) {
		return keys.indexOf(key) !== -1;
	}).reduce(function (state, key) {
		return _extends({}, state, _defineProperty({}, key, transformer[key](params[key])));
	}, {});
};