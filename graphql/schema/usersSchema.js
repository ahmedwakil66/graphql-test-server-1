const typeDefs = `#graphql
type User{
    _id: ID
    email: String
    firstName: String
    lastName: String
    displayName: String
    age: Int
    sex: String
    created_at: Date
    role: Role
}

  enum Role {
    USER
  }

  extend type Query {
    user(userId: ID, email: String): User
    users: [User]
  }

  input user {
    email: String!
    firstName: String!
    lastName: String!
    displayName: String!
    created_at: Date!
    age: Int
    sex: String
  }

  type StoreUserMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    insertedId: String
    user: User #no new fetching, push insertedId in input and resend to the client
  }

  extend type Mutation {
    storeUser(input:user): StoreUserMutationResponse
  }
`;

export default typeDefs;