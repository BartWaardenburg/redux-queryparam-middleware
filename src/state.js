/* @flow */
import {parse} from 'query-string';

/**
 * This will get the current state information from the queryparams
 * @param  settings             An object containing the settings to retreive the state from the queryparams
 * @param  settings.keys        The keys to read from the url
 * @param  settings.transformer An object containing methods to transform certain querparam values
 * @param  settings.reducer     The reducer to update in the store
 * @param  settings.state       The initial state to modify
 * @return                      An object containing the needed information in the right format
 */
export const getQueryparamState = ({keys = [], transformer = {}, reducer, state}: {keys: Array<string>, transformer: {}, reducer: string, state: {}}) => {
	const stateSlice = getQueryparamData({keys, transformer});

	return {
		...state,
		[reducer]: {
			...state[reducer],
			...stateSlice,
		},
	};
};

export const getQueryparamData = ({keys = [], transformer = {}}: {keys: Array<string>, transformer: {}}) => {
	const params = parse(window.location.search);
	transformer = keys.reduce((transformer, key) => Object.keys(transformer).includes(key) ? transformer : ({
		...transformer,
		[key]: (value) => value,
	}), transformer);

	return Object.keys(params)
		.filter((key) => keys.includes(key))
		.reduce((state, key) => ({
			...state,
			[key]: transformer[key](params[key]),
		}), {});
};
