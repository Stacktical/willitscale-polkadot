export interface Point {
  x: number;
  y: number;
}

export interface PredictionState {
  benchmark: Array<Point>;
  capacityPrediction: Array<Point>;
  latencyPrediction: Array<Point>;
}
