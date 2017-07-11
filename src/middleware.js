/* @flow */
import {parse, stringify} from 'query-string';
import isObject from 'lodash.isobject';

/**
 * This is used to transform the request to the right right queryparams
 */
let queryparamMiddlewareTransformer: Object;

/**
 * This middleware for redux will store a slice of the redux state in queryparams
 * @param  settings             Object containing all configuration for the queryparam middleware
 * @param  settings.types       A collection of action types to listen to
 * @param  settings.include     Properties of the payload objects of the types to store in the url
 * @param  settings.omit        A collection of properties to remove from the url when an action runs
 * @param  settings.transformer An object containing methods to transform certain payload values
 * @return                      The final result when all reducers have been run
 */
export const createQueryparamMiddleware = ({
	types = [],
	include = [],
	omit = [],
	transformer = {},
}: {
	types: Array<string>,
	include?: Array<string>,
	omit?: Array<string>,
	transformer?: {},
}) =>
	() => (next: Function) => (action: Object) => {
		if (types.includes(action.type)) {
			const params: Object = parse(window.location.search);

			if (!include.length) include = Object.keys(action.payload);

			// Build up the transformer to modify any values
			if (!queryparamMiddlewareTransformer) {
				queryparamMiddlewareTransformer = include.reduce((transformer, key) => Object.keys(transformer).includes(key) ? transformer : ({
					...transformer,
					[key]: (value) => value,
				}), transformer);
			}

			// Add the params we want to store
			let nextParams = include.reduce((params, key) => ({
				...params,
				[key]: queryparamMiddlewareTransformer[key](action.payload[key]),
			}), params);

			// Flatten any objects
			Object.keys(nextParams).forEach((key) => {
				if (isObject(nextParams[key])) {
					nextParams = {
						...nextParams,
						...nextParams[key],
					};
					delete nextParams[key];
				}
			});

			// Remove keys which we don't want to keep
			omit.forEach((key) => delete nextParams[key]);

			window.history.replaceState(null, '', `${window.location.pathname}?${stringify(nextParams)}`);
		}

		return next(action);
	};

export default createQueryparamMiddleware;
