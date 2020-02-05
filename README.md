# But will it scale ?

`"Will it scale ?"` is an open source Predictive Analysis Platform that enables you to engineer **scalable** distributed applications, networks and other systems, **by applying mathematical models to bytesized performance measurements**.

## Objective

The initial objective of this project is to surface mathematical relation between the performance metrics of blockchain networks, with a focus on [Substrate](https://substrate.dev/) / [Polkadot](https://polkadot.network/), the driving forces of interoperability in the space (ergo increasingly complex, end-to-end testing scenarios).

When the value of two system metrics seem to vary in relation to each other, it becomes possible to use them as mathematical coordinates, and fit these coordinates into predictive mathematical models. 

In other words, using mathematical models that can predict the next values in a series, **gives us the ability to predict the next values in a series of blockchain performance metrics**, provided they are bound by maths.  

This scientific approach to capacity planning alleviates testing requirements (less tests, less time), a significant part of the guesswork involved in scalability-driven architectural, coding and configuration choices, and the overall quality of builds before they're deployed to production.

Our initial research at [Stacktical](https://stacktical.com/) show that such relation seem to exist between the number of validating nodes in a blockchain network, and the throughput of the system, expressed in transactions per seconds (TPS).

Instead of provisionning complex, costly testnets with hundreds of validating nodes, and running hundreds of throughput measurements, `"Will it scale ?"` enables you to chart, mathematically quantify and govern the scalability of your system **with only 10 performance measuremenents or so**.

This also means that the `"Will it scale ?"` platform can serve as a tool to scientifically debunk false bockchain TPS claims. Is this is your goal, we'd be happy to hear from you at [contact@stacktical.com](mailto:contact@stacktical.com).

![grant_w3f](resources/grant_w3f.png)

## When predictions fail

Nobel Prize recipient and quantum physicist Niels Bohr used to say that **"Prediction is very difficult, especially when it's about the future."**

In the realm of Data Science, it's important to embrace that predictions can fail. In our experience, there are two main reasons for that :

**1. Bad performance measurements**

Predictions can fail if they detect uncommon patterns in the performance measurements they process. It is important to always chart your measurements once, and remove noisy coordinates from your mesurements, before submitting them to the predictive engine.

Sometimes, what appears to be a clean set of measurements is in fact a perfectly wrong series of measurements.
Rethinking your entire performance testing protocol might help in such case.

**2. Wrong mathematical models**

Predictions can fail if we try to fit performance measurements to the wrong mathematical models, or if we use the wrong mathematical functions to this model in the code (e.g. `nls` versus `nlxb` nonlinear regression functions in R).

In the future, it would make sense to increase the number of mathematical models available in this repository.

## General architecture

The projects is comprised of three main components.

### `willitscale-r-server`

A HTTP R server to make online predictive analysis using mathematical models.

### `willitscale-api`

A Node.js GraphQL API server to query the `willitscale-r-server` and implements the business logic of predictions.

### `willitscale-client` (optional)

A Vue.js GraphQL API client, to submit performance test results to the `willitiscale-api` from your browser.

You will need to build and run these components to run your end-to-end predictions scenarios.

## Input data

To answer the `"Will it scale ?"` question, the Platform needs to be fed with performance measurements formatted as a JSON. All available predictions are currently using the demo dataset in Vienna's Technical University student M. Schäffer's whitepaper about the "Performance and Scalability of Private Ethereum Blockchains". 

More demo dataset from different applications, networks and systems will be added at a later stage (e.g. Substrate / Polkadot performance measurements).

![research_m-schaffer_tuw.jpg](resources/research_m-schaffer_tuw.jpg)

## willitscale-r-server

### Building your R Server

The `willitscale-r-server` is designed to run inside a Docker container.  
To build your container, use the following command in the root folder of your component.

`docker build -t willitscale-r-server .`

### Running your R Server

By default, the R server runs on the 6311 port, inside your Docker container.
To run your container by mapping the 6311 port in Docker to the 10001 port in your machine, use the following command:

`docker run -d -p 10001:6311 -t -P --name willitscale-r-server willitscale-r-server`

Your server should be now running on the **10001 port.**

## willitscale-api

### Install dependencies

We are using npm to manage dependencies for the `willitscale-api` API server.

**If you plan on using the server locally,** simply use `npm install` from the `willitscale-api` folder.  
**If you plan to host it instead**, the Dockerfile will take care of installing dependencies for you, while building the container.

### Building your GraphQL API Server

You can either build the server locally using npm, or build your server as a Docker container for further deployment (e.g. in Kubernetes).

#### Locally

Set the environment variable and build the server using the following command:  
`NODE_ENV="development" npm run build`

#### In Docker

Build the server using the following Docker command:  
`docker build -t willitscale-api . --build-arg NODE_ENV=development`

### Running your GraphQL API Server

#### Locally

Set the environment variable and run the server using the following command:  
`NODE_ENV="development" npm run start`

#### In Docker

Run the server using the following Docker command:
`docker run -p 10000:10000 -v $(pwd)/dist/:/var/www/willitscale-api/public/dist/ --name willitscale-api willitscale-api`

Your server should be now running on the **10000 port.**

### Verify installation

Now that both our HTTP R server and GraphQL API are running, it is time to try running a prediction.

GraphQL Playground is a graphical, interactive, in-browser GraphQL IDE, created by Prisma and based on GraphiQL (ndlr: the default playground for GraphQL). You can find more information about GraphQL Playgroun in the [Apollo documentation](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/).

To get started, go to `http://localhost:10000`, or the address matching your deployment.

Then use the following example to give the playground a try:

```
mutation {
  predictCapacity(points:
    [
      {
        p: 1,
        Rt: 17.1,
        Xp: 37.9
      },
      {
        p: 5,
        Rt: 7.2,
        Xp: 82.1
      },
      {
        p: 10,
        Rt: 8.8,
        Xp: 76.3
      },
      {
        p: 15,
        Rt: 10.3,
        Xp: 65.9
      },
      {
        p: 20,
        Rt: 11.3,
        Xp: 53
      }
    ]
  )
}
```

The result pane should now be displaying a stringified JSON object comprised of `nodes vs throughput` points coordinates and other information, predicted from the specified payload. 

Here is what the console looks like when you run a prediction: 

![willitiscale-api.png](resources/willitscale-api.png)

### API documentation

Your server documentation is available in the GraphQL Playground. Two predictive queries are available at this stage:

- A **`predictCapacity`** GraphQL mutation returning:

  - The network’s `nodes vs throughput` (scalability) chart points
  - The network’s `peak capacity` point
  - Quantified scalability bottlenecks (contention / coherency)

- A **`predictLatency`** GraphQL mutation returning:
  - The network’s `nodes vs latency` chart points

We originally planned on returning the network’s `latency at peak capacity` point, from the `predictLatency` mutation.

Instead, we built `willitscale-client` so that this point is directly visible on a chart, and we started implementing a metric-agnostic `makePrediction` mutation in `willitscale-api` that will ultimately serve the same purpose in a wider variety of scenarios (e.g. predicting the network's throughput (Xp) for a given concurrency (p)).

### Contention / Coherency bottlenecks

All systems experience contention and coherency penalties. The mathematical models we are using lets you quantify these penalties, to surface general areas of improvement of the system's scalability.

Contention is a state of conflict over access to a shared resource (e.g conflicting DApp transactions accessing the same data region). It forces transactions to be dealt with in a serialized way.   

Coherency is a state where the data in a cache is up to date with the system's memory. Ensuring it requires extra, costly synchronisation efforts from your system.

We would suggest adding scalability bottlenecks checks to a CI/CD pipeline, to validate the scalability of builds before they're deployed to production.

## willitscale-client (optional)

`willitscale-client` provides a simple way to visualize and plot the predictions returned by the `willitscale-api`, in your browser.

### Install dependencies

We are using npm to manage dependencies for the `willitscale-client` API client.  
Simply use `npm install` from the `willitscale-client` folder to install them.

### Serve the client locally

Make sure `willitscale-r-server` and `willitscale-api` are running, then set the environment variable and run `willitscale-client` using the following command:  

`NODE_ENV="development" npm run serve`

Your client should be now running at **[http://localhost:8080](http://localhost:8080)**.

![willitiscale-client.png](resources/willitscale-client.png)

## TODO

### Benchmarking

- Add more sample Substrate / Polkadot benchmark datasets

### Predictive analysis

- Describe the mathematical models currently used in the platform
- Finish implementing the `makePrediction` mutation

### Containerization

- Add Dockerfile to `willitscale-client`

### Deployment

- Add infrastructure as code scripts to deploy the platform on Kubernetes / GKE

### Typings

- Use `npm run codegen` to generate TypeScript code from the `willitscale-api` GraphQL schema
- Implement type checks in the `willitscale-client` and `willitscale-api`

## About Stacktical (DSLA Protocol)

![stacktical_logo_v2-dark.png](resources/stacktical_logo_v2-dark.png)

### Outsourcing application and network services exposes you and your users to service disruptions. Use DSLA Network or implement DSLA Protocol, to mitigate third party outsourcing using peer-to-peer, electronic SLA contracts and cryptocurrencies. [Learn more](https://stacktical.com)
