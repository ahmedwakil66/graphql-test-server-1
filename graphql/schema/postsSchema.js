const typeDefs = `#graphql
    type Post {
        _id: ID,
        userId: ID,
        caption: String,
        created_at: Date,
        location: String,
        media: [Media],
        likes: [Like],
        comments: [Comment],
        user: User,
    }

    type Media {
        asset_id: String,
        url: String,
        width: Int,
        height: Int,
        type: String,
        format: String,
    }

    type Like {
        _id: ID,
        postId: ID,
        userId: ID,
        created_at: Date,
    }

    type Comment {
        _id: ID,
        postId: ID,
        userId: ID,
        created_at: Date,
        caption: String,
        user: User,
    }

    extend type Query {
        post(postId: ID!): Post
        feedPosts(userId: ID!): [Post]
        # postsByUser(usrId: ID!): [Post]
    }

    input post {
        userId: ID!,
        caption: String,
        media: [media],
        location: String,
        created_at: Date!,
    }

    input media {
        asset_id: String,
        url: String,
        width: Int,
        height: Int,
        type: String,
        format: String,
    }

    type AddPostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        insertedId: String
        post: Post #no new fetching, push insertedId in input and resend to the client
    }

    extend type Mutation {
        addPost(newPost: post!): AddPostMutationResponse
    }
`;

export default typeDefs;