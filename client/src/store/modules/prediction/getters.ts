import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { PredictionState } from './types';

const getBenchmark = (state: PredictionState): any => {
  return state.benchmark;
};

const getCapacityPrediction = (state: PredictionState): any => {
  return state.capacityPrediction;
};

const getLatencyPrediction = (state: PredictionState): any => {
  return state.latencyPrediction;
};

const getNodes = (state: PredictionState): any => {
  return state.capacityPrediction.map(function(e) {
    return e.x;
  });
};

export const getters: GetterTree<PredictionState, RootState> = {
  getNodes,
  getBenchmark,
  getCapacityPrediction,
  getLatencyPrediction
};
