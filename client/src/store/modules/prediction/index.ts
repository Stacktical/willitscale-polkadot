import { Module } from 'vuex';

import { RootState } from '@/store/types';
import { PredictionState } from './types';

import { state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const namespaced: boolean = true;

export const Prediction: Module<PredictionState, RootState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced
};
