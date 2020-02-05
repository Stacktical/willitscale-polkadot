import { gql } from 'apollo-server';

export default gql`
  type Query {
    """
    Use this fuction to populate demo Concurrency (p) vs Throughput (Xp) vs Response Time (Rt) benchmark results.
    """
    demo: String
  }

  type Mutation {
    """
    Use this function to forecast the capacity of an application or a network, by fitting the Universal Scalability Law model to "Concurrency (p) vs Throughput (Xp)" benchmark results.
    """
    predictCapacity(points: [Point]): String
    """
    Use this function to forecast the latency of an application or a network, by solving the Universal Scalability Law for Response Time (Rt) as a function of Concurrency (p).
    """
    predictLatency(points: [Point]): String
    """
    Use this function to predict a measurement from a Concurrency (p) according the specified fit.
    """
    makePrediction(p: Float, fit: String): String
  }

  input Point {
    p: Float!
    Xp: Float
    Rt: Float
  }
`;
