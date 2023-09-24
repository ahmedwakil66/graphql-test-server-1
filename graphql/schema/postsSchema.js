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
        postLikerId: ID,
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

    type SavedPost {
        _id: ID,
        postId: ID,
        userId: ID,
        created_at: Date,
        saved: Post,
    }

    extend type Query {
        post(postId: ID!): Post
        feedPosts(userId: ID!): [Post]
        savedPosts(userId: ID!): [SavedPost]
        isPostAlreadySaved(postId: ID!, userId: ID!): Boolean
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

    input savePost {
        postId: ID,
        userId: ID,
        created_at: Date,
    }

    type AddPostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        insertedId: String
        post: Post #no new fetching, push insertedId in input and resend to the client
    }

    type LikePostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        insertedId: String
        deletedCount: Int
        like: Like #no new fetching, push insertedId in input and resend to the client
    }

    type SavePostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        insertedId: String
        deletedCount: Int
    }

    extend type Mutation {
        addPost(newPost: post!): AddPostMutationResponse
        likePost(postId: ID!, postLikerId: ID!, created_at: Date!): LikePostMutationResponse
        unlikePost(likeId: ID!, postLikerId: ID!): LikePostMutationResponse
        savePost(postToSave: savePost!): SavePostMutationResponse
        removeSavedPost(postId: ID!, userId: ID!): SavePostMutationResponse
    }
`;

export default typeDefs;