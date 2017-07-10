'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createQueryparamMiddleware = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = require('query-string');

var _lodash = require('lodash.isobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This is used to transform the request to the right right queryparams
 */
var queryparamMiddlewareTransformer = void 0;

/**
 * This middleware for redux will store a slice of the redux state in queryparams
 * @param  settings             Object containing all configuration for the queryparam middleware
 * @param  settings.types       A collection of action types to listen to
 * @param  settings.include     Properties of the payload objects of the types to store in the url
 * @param  settings.omit        A collection of properties to remove from the url when an action runs
 * @param  settings.transformer An object containing methods to transform certain payload values
 * @return                      The final result when all reducers have been run
 */
var createQueryparamMiddleware = exports.createQueryparamMiddleware = function createQueryparamMiddleware(_ref) {
	var _ref$types = _ref.types,
	    types = _ref$types === undefined ? [] : _ref$types,
	    _ref$include = _ref.include,
	    include = _ref$include === undefined ? [] : _ref$include,
	    _ref$omit = _ref.omit,
	    omit = _ref$omit === undefined ? [] : _ref$omit,
	    _ref$transformer = _ref.transformer,
	    transformer = _ref$transformer === undefined ? {} : _ref$transformer;
	return function () {
		return function (next) {
			return function (action) {
				if (types.indexOf(action.type) !== -1) {
					var params = (0, _queryString.parse)(window.location.search);

					if (!include.length) include = Object.keys(action.payload);

					// Build up the transformer to modify any values
					if (!queryparamMiddlewareTransformer) {
						queryparamMiddlewareTransformer = include.reduce(function (transformer, key) {
							return Object.keys(transformer).indexOf(key) !== -1 ? transformer : _extends({}, transformer, _defineProperty({}, key, function (value) {
								return value;
							}));
						}, transformer);
					}

					// Add the params we want to store
					var nextParams = include.reduce(function (params, key) {
						return _extends({}, params, _defineProperty({}, key, queryparamMiddlewareTransformer[key](action.payload[key])));
					}, params);

					// Flatten any objects
					Object.keys(nextParams).forEach(function (key) {
						if ((0, _lodash2.default)(nextParams[key])) {
							nextParams = _extends({}, nextParams, nextParams[key]);
							delete nextParams[key];
						}
					});

					// Remove keys which we don't want to keep
					omit.forEach(function (key) {
						return delete nextParams[key];
					});

					window.history.replaceState(null, '', window.location.pathname + '?' + (0, _queryString.stringify)(nextParams));
				}

				return next(action);
			};
		};
	};
};

exports.default = createQueryparamMiddleware;