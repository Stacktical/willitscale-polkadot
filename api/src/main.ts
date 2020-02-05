import { ApolloServer } from 'apollo-server';

import resolvers from './server/resolvers';
import typeDefs from './server/schemas';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req }: { req: Request }) => {
    // Evolution goes here.
  }
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 10000;

server
  .listen({
    hostname: host,
    port: port
  })
  .then(({ url }: any) =>
    console.log(`Scalability Prediction API ready at ${url}. `)
  );

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => server.stop());
}
