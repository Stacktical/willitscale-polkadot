import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';

import { PredictionState } from '@/store/modules/prediction/types';

const namespace: string = 'web3';

@Component({})
export default class App extends Vue {
  @State('Prediction') SLA!: PredictionState;

  mounted() {
    if (process.env.NODE_ENV == 'development') {
      console.log('[DEBUG] Development Mode.');
    }
  }
}
