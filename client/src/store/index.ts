import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { Prediction } from './modules/prediction/index';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    Prediction
  }
};

export default new Vuex.Store<RootState>(store);
