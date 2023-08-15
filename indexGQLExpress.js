import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import env from './dotenv.config.js';

import typeDefs from './graphql/schema/schema.js';
import resolvers from './graphql/resolvers/resolvers.js';

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors(),
  express.json(),
);

app.get('/', (req, res) => res.send('you can use normal routing along with gql'))

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use('/graphql', expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: env.PORT || 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:${env.PORT || 4000}`);