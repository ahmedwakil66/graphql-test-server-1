const typeDefs = `#graphql
type User{
    _id: ID
    email: String
    name: String
    age: Int
    marital_status: String
    occupation: String
    country: String
    sex: String
}
  extend type Query {
    user(userId: ID!): User
    users: [User]
  }

  input user {
    email: String!
    name: String!
    age: Int
    marital_status: String
    occupation: String
    country: String
    sex: String
  }

  extend type Mutation {
    storeUser(input:user):User
  }
`;

export default typeDefs;