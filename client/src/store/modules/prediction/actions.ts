import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store/types';
import { PredictionState } from './types';
import { apolloClient } from '@/api/client';
import {
  MUTATION_PREDICT_CAPACITY,
  MUTATION_PREDICT_LATENCY
} from '@/api/api.gql';

const predictCapacity = async ({
  commit
}: ActionContext<PredictionState, RootState>): Promise<any> => {
  const response = await apolloClient.mutate({
    mutation: MUTATION_PREDICT_CAPACITY,
    variables: {}
  });

  let predictiveAnalysis = JSON.parse(response.data.predictCapacity);
  console.log('Response:', predictiveAnalysis);

  let formattedBenchmark: object[] = [];

  let i: number;

  for (i = 0; i < predictiveAnalysis.benchmark.length; i++) {
    let responsePoint = {
      x: parseFloat(predictiveAnalysis.benchmark[i].p),
      y: parseFloat(predictiveAnalysis.benchmark[i].Xp)
    };

    formattedBenchmark.push(responsePoint);
  }

  let formattedPrediction: object[] = [];

  let j: number;

  for (j = 0; j < predictiveAnalysis.scalabilityChart.length; j++) {
    let responsePoint = {
      x: parseFloat(predictiveAnalysis.scalabilityChart[j].p),
      y: parseFloat(predictiveAnalysis.scalabilityChart[j].Xp)
    };

    formattedPrediction.push(responsePoint);
  }

  console.log('formattedBenchmark', formattedBenchmark);
  console.log('formattedPrediction', formattedPrediction);

  await commit('setBenchmark', formattedBenchmark);
  await commit('setCapacityPrediction', formattedPrediction);
};

const predictLatency = async ({
  commit
}: ActionContext<PredictionState, RootState>): Promise<any> => {
  const response = await apolloClient.mutate({
    mutation: MUTATION_PREDICT_LATENCY,
    variables: {}
  });

  let predictiveAnalysis = JSON.parse(response.data.predictLatency);
  console.log('Response:', predictiveAnalysis);

  let formattedPrediction: object[] = [];

  let i: number;

  for (i = 0; i < predictiveAnalysis.length; i++) {
    let responsePoint = {
      x: parseFloat(predictiveAnalysis[i].p),
      y: parseFloat(predictiveAnalysis[i].Rt)
    };

    formattedPrediction.push(responsePoint);
  }

  console.log('formattedPrediction', formattedPrediction);
  await commit('setLatencyPrediction', formattedPrediction);
};

export const actions: ActionTree<PredictionState, RootState> = {
  predictCapacity,
  predictLatency
};
