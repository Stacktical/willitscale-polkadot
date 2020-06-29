const colors = require('colors');
const rio = require('rio');
const RHost = process.env.SERVICE_R_HOST || 'willitscale-r-server';
const RPort = process.env.SERVICE_R_PORT || 10001;
const demoBenchmark = require('../demo/benchmark');

colors.setTheme({
  prediction: ['white', 'bold', 'bgGreen'],
  bottleneck: ['white', 'bold', 'bgRed'],
  info: ['white', 'bold', 'bgBlue']
});

const demo = (): string => {
  return JSON.stringify(demoBenchmark);
};

const makePrediction = async (args: any) => {
  return new Promise((resolve, reject) => {
    try {
      if (args == null) args = demoBenchmark;

      console.log(
        '\n__________________________________________________________\n\n',
        colors.white.bold('Predicting measurement from p...'),
        '\n\n',
        colors.green(JSON.stringify(args.points, null, 2)),
        '\n'
      );

      const config = {
        filename: 'dist/predict.R',
        entrypoint: 'makePrediction',
        data: args,
        host: RHost,
        port: RPort,
        callback: function(err: any, res: any) {
          if (!err) {
            console.log(
              colors.white.bold('\n... Done! Your prediction is ready:\n\n')
            );

            let prediction = JSON.parse(res);

            console.log(
              colors.green(JSON.stringify(prediction, null, 2)),
              '\n'
            );

            resolve(JSON.stringify(prediction));
          } else {
            reject(err);
            console.log('Unable to predict measurement.', err);
          }
        }
      };

      rio.e(config);
    } catch (err) {
      reject(err);
      console.log('Unable to predict measurement.', err);
    }
  });
};

const predictCapacity = async (args: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      if (args == null) args = demoBenchmark;

      console.log(
        '\n__________________________________________________________\n\n',
        colors.white.bold('Predicting the capacity of the following system...'),
        '\n\n',
        colors.green(JSON.stringify(args.points, null, 2)),
        '\n'
      );

      const config = {
        filename: 'dist/capacity.R',
        entrypoint: 'predictCapacity',
        data: args,
        host: RHost,
        port: RPort,
        callback: function(err: any, res: any) {
          if (!err) {
            console.log(
              colors.white.bold('\n... Done! Your prediction is ready:\n\n')
            );

            let prediction = JSON.parse(res);

            let i = 0;
            let concurrency = prediction.value[1].value[0];
            let throughput = prediction.value[2];
            let high = prediction.value[3];
            let low = prediction.value[4];

            let formattedPrediction: object[] = [];

            for (i = 0; i < throughput.value.length; i++) {
              let responsePoint = {
                p: concurrency.value[i],
                ucl: high.value[i],
                Xp: throughput.value[i],
                lcl: low.value[i]
              };

              formattedPrediction.push(responsePoint);
            }

            let systemContention = (
              prediction.value[5].value[0] * 100
            ).toPrecision();

            console.log(
              'Contention Penalty (%) :',
              '\n\n',
              colors.bottleneck(systemContention),
              '\n'
            );

            let systemCoherency = (
              prediction.value[6].value[0] * 100
            ).toPrecision();

            console.log(
              'Coherency Penalty (%) :',
              '\n\n',
              colors.bottleneck(systemCoherency),
              '\n'
            );

            let peakCapacityP = prediction.value[7].value[0];

            console.log(
              'Peak Capacity (p) :',
              '\n\n',
              colors.prediction(peakCapacityP),
              '\n'
            );

            let peakCapacityXp = prediction.value[8].value[0];

            console.log(
              'Peak Capacity (Xp) :',
              '\n\n',
              colors.prediction(peakCapacityXp),
              '\n'
            );

            let predictionAccuracy = (
              prediction.value[9].value[0] * 100
            ).toPrecision();

            console.log(
              'Accuracy (%) :',
              '\n',
              colors.info(predictionAccuracy),
              '\n'
            );

            console.log(
              colors.white.bold(
                '\nPlease check client or HTTP response for charts and more.'
              ),
              '\n__________________________________________________________\n\n'
            );

            let formattedResponse = {
              benchmark: args.points,
              scalabilityChart: formattedPrediction,
              peakCapacityP: peakCapacityP,
              peakCapacityXp: peakCapacityXp,
              contentionBottleneck: systemContention,
              coherencyBottleneck: systemCoherency
            };

            resolve(JSON.stringify(formattedResponse));
          } else {
            reject(err);
            console.log('Unable to predict network capacity.', err);
          }
        }
      };

      rio.e(config);
    } catch (err) {
      reject(err);
      console.log('Unable to predict network capacity.', err);
    }
  });
};

const predictLatency = async (args: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      if (args == null) args = demoBenchmark;

      console.log(
        '\n__________________________________________________________\n\n',
        colors.white.bold('Predicting the latency of the following system...'),
        '\n\n',
        colors.green(JSON.stringify(args.points, null, 2)),
        '\n'
      );

      const config = {
        filename: 'dist/latency.R',
        entrypoint: 'predictLatency',
        data: args,
        host: RHost,
        port: RPort,
        callback: function(err: any, res: any) {
          if (!err) {
            console.log(
              colors.white.bold('\n... Done! Your prediction is ready:\n\n')
            );

            let prediction = JSON.parse(res);

            let i = 0;
            let concurrency = prediction.value[1].value[0];
            let responseTime = prediction.value[2];

            let formattedPrediction: object[] = [];

            for (i = 0; i < responseTime.value.length; i++) {
              let responsePoint = {
                p: concurrency.value[i],
                Rt: responseTime.value[i]
              };

              formattedPrediction.push(responsePoint);
            }

            console.log(
              colors.green(JSON.stringify(formattedPrediction, null, 2)),
              '\n'
            );

            console.log(
              colors.white.bold(
                '\nPlease check client or HTTP response for charts and more.'
              ),
              '\n__________________________________________________________\n\n'
            );

            resolve(JSON.stringify(formattedPrediction));
          } else {
            reject(err);
            console.log('Unable to predict network latency.', err);
          }
        }
      };

      rio.e(config);
    } catch (err) {
      reject(err);
      console.log('Unable to predict network latency.', err);
    }
  });
};

export default {
  Query: {
    demo
  },
  Mutation: {
    predictLatency,
    predictCapacity,
    makePrediction
  }
};
