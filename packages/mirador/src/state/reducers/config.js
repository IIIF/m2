import deepmerge from 'deepmerge';
import settings from '../../config/settings';
import ActionTypes from '../actions/action-types';

const initialState = { ...settings };

/** Overwrite arrays when deep merging */
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

/**
 * configReducer - does a deep merge of the config
 */
export const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_CONFIG:
    case ActionTypes.IMPORT_CONFIG:
      return deepmerge(state, action.config, { arrayMerge: overwriteMerge });
    case ActionTypes.SET_CONFIG:
      return action.config;
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.config || {};
    default:
      return state;
  }
};
