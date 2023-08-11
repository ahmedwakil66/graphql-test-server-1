import todosSchema from './todosSchema.js';
import usersSchema from './usersSchema.js'

// The GraphQL schema
const rootSchema = `#graphql

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  scalar Date
`;

export default [rootSchema, usersSchema, todosSchema];