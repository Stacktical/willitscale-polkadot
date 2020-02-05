import { MutationTree } from 'vuex';
import { PredictionState } from '@/store/modules/prediction/types';

const setBenchmark = (state: PredictionState, payload: any) => {
  state.benchmark = payload;
};

const setCapacityPrediction = (state: PredictionState, payload: any) => {
  state.capacityPrediction = payload;
};

const setLatencyPrediction = (state: PredictionState, payload: any) => {
  state.latencyPrediction = payload;
};

export const mutations: MutationTree<PredictionState> = {
  setBenchmark,
  setCapacityPrediction,
  setLatencyPrediction
};
