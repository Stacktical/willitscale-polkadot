import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, State } from 'vuex-class';
import { PredictionState } from '@/store/modules/prediction/types';

//@ts-ignore
import chart from '@/views/home/chart.js';

@Component({
  components: {
    chart
  }
})
export default class Home extends Vue {
  @State('Prediction') Prediction!: PredictionState;
  @Action('Prediction/predictCapacity') predictCapacity!: any;
  @Action('Prediction/predictLatency') predictLatency!: any;
  @Getter('Prediction/getNodes') getNodes!: any;
  @Getter('Prediction/getBenchmark') getBenchmark!: any;
  @Getter('Prediction/getCapacityPrediction') getCapacityPrediction!: any;
  @Getter('Prediction/getLatencyPrediction') getLatencyPrediction!: any;

  chartWidth: number = 640;

  chartHeight: number = 480;

  getRandomInt() {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
  }

  chartData(): object {
    return {
      labels: this.getNodes,
      datasets: [
        {
          type: 'scatter',
          label: 'Performance Benchmark',
          data: this.getBenchmark,
          fill: false,
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 10
        },
        {
          type: 'line',
          label: 'Capacity Prediction',
          yAxisID: 'A',
          data: this.getCapacityPrediction,
          fill: false,
          borderColor: '#e6007a',
          pointRadius: 0,
          borderWidth: 1,
          showLine: true
        },
        {
          type: 'line',
          label: 'Latency Prediction',
          yAxisID: 'B',
          data: this.getLatencyPrediction,
          fill: false,
          borderColor: '#fc0',
          pointRadius: 0,
          borderWidth: 1,
          showLine: true
        }
      ]
    };
  }

  chartOptions(): object {
    return {
      fontColor: 'white',
      responsive: true,
      title: {
        display: true
      },
      legend: {
        labels: {
          fontColor: 'white'
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Nodes',
              fontColor: 'white'
            },
            ticks: {
              fontColor: 'white',
              padding: 10
            }
          }
        ],
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              display: true,
              labelString: 'Throughput',
              fontColor: 'white'
            },
            ticks: {
              fontColor: 'white',
              padding: 10,
              callback: function(value, index, values) {
                return value + ' tps';
              }
            }
          },
          {
            id: 'B',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Latency',
              fontColor: 'white'
            },
            ticks: {
              fontColor: 'white',
              padding: 10,
              callback: function(value, index, values) {
                return value + ' ms';
              }
            }
          }
        ]
      }
    };
  }

  async willitscale() {
    await this.predictCapacity();
    await this.predictLatency();
  }

  mounted() {
    this.willitscale();
  }
}
