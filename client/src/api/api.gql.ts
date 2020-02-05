import gql from 'graphql-tag';

export const QUERY_DEMO_BENCHMARK = gql`
  query demo {
    demo
  }
`;

export const MUTATION_PREDICT_CAPACITY = gql`
  mutation predictCapacity($points: [Point]) {
    predictCapacity(points: $points)
  }
`;

export const MUTATION_PREDICT_LATENCY = gql`
  mutation predictLatency($points: [Point]) {
    predictLatency(points: $points)
  }
`;
