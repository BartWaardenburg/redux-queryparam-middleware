/* @flow */
import {parse} from 'query-string';

/**
 * This will get the current state information from the queryparams
 * @param  keys The keys to read from the url
 * @return      An object containing the needed information in the right format
 */
export const getQueryparamState = ({keys = [], transformer = {}, reducer, state}: {keys: Array<string>, transformer: {}, reducer: string, state: {}}) => {
  const params = parse(location.search);
  transformer = keys.reduce((transformer, key) => Object.keys(transformer).includes(key) ? transformer : ({
    ...transformer,
    [key]: (value) => value,
  }), transformer);

  const stateSlice = Object.keys(params)
    .filter((key) => keys.includes(key))
    .reduce((state, key) => ({
      ...state,
      [key]: transformer[key](params[key]),
    }), {});

  return {
    ...state,
    [reducer]: {
      ...state[reducer],
      ...stateSlice,
    },
  };
};
