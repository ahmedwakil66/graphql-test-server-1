const typeDefs = `#graphql
type User{
    _id: ID
    email: String
    username: String
    firstName: String
    lastName: String
    displayName: String
    bio: String
    phone: String
    website: String
    age: Int
    sex: String
    image: String
    created_at: Date
    role: Role
    last_notification_checked: Date
}

type Email {
  email: String
}

  enum Role {
    USER
  }

  extend type Query {
    user(userId: ID, email: String): User
    users: [User]
    searchUsers(userId: ID!, keyword: String!): [User]
    isUsernameTaken(username: String): Boolean
    getEmailFromUsername(username: String): Email
  }

  input user {
    email: String!
    username: String!
    displayName: String!
    created_at: Date!
    firstName: String
    lastName: String
    image: String
    age: Int
    sex: String
  }

  input updateUser {
    email: String
    username: String
    displayName: String
    created_at: Date
    website: String
    image: String
    phone: String
    bio: String
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

  type UpdateUserMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    modifiedCount: Int
  }

  extend type Mutation {
    storeUser(input:user): StoreUserMutationResponse
    updateUser(userId: ID!, updatedDoc: updateUser!): UpdateUserMutationResponse
  }
`;

export default typeDefs;