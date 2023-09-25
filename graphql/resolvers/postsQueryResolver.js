import { ObjectId } from "mongodb";
import connectToDB from "../../dbConfig/dbGql.js";
import { runJwtVerification, runSameUserCheck } from "../../verificationFunctions/verifyJWT.js";

const postQueryResolvers = {
    Query: {
        post: async (_, args, context) => {
            runJwtVerification(context);
            if (!args.postId) {
                throw new Error("Must provide a postId");
            }
            const { postCollection } = await connectToDB();
            try {
                return await postCollection.findOne({ _id: new ObjectId(args.postId) });
            }
            catch (error) {
                throw new Error(`Failed to get the post. Error: ${error.message}`);
            }
        },

        feedPosts: async (_, args, context) => {
            // runJwtVerification(context);
            const { postCollection } = await connectToDB();
            return await postCollection.find(
                // { userId: { $ne: args.userId } },
                {},
                { sort: { created_at: -1 } }
            ).toArray()
        },

        savedPosts: async (_, args, context) => {
            // runJwtVerification(context)
            // runSameUserCheck(args.userId, context)
            const { savePostCollection } = await connectToDB();
            return savePostCollection.find(
                { userId: args.userId },
                { sort: { created_at: -1 } }
            ).toArray()
        },

        isPostAlreadySaved: async (_, args, context) => {
            runJwtVerification(context);
            runSameUserCheck(args.userId, context);
            const { savePostCollection } = await connectToDB();
            const result = await savePostCollection.findOne(
                { postId: args.postId, userId: args.userId }
            );
            return Boolean(result)
        },

        commentsByPostId: async(_, args, context) => {
            // runJwtVerification(context);
            const { commentCollection } = await connectToDB();
            return await commentCollection.find({ postId: args.postId }).toArray();
        }
    },


    Post: {
        likes: async (parent, _, context) => {
            const { likeCollection } = await connectToDB();
            return await likeCollection.find({ postId: parent._id.toString() }).toArray();
        },

        comments: async (parent, _, context) => {
            const { commentCollection } = await connectToDB();
            return await commentCollection.find({ postId: parent._id.toString() }).toArray();
        },

        user: async (parent, _, context) => {
            const { userCollection } = await connectToDB();
            return await userCollection.findOne(
                { _id: new ObjectId(parent.userId) },
                {
                    projection: { _id: 0, displayName: 1, image: 1, username: 1 }
                }
            )
        }
    },


    Comment: {
        user: async (parent, _, context) => {
            // runSameUserCheck(parent.userId, context)
            const { userCollection } = await connectToDB();
            return await userCollection.findOne(
                { _id: new ObjectId(parent.userId) },
                {
                    projection: { _id: 0, displayName: 1, image: 1, username: 1 }
                }
            )
        }
    },


    SavedPost: {
        saved: async (parent, _, context) => {
            const { postCollection } = await connectToDB();
            return await postCollection.findOne({ _id: new ObjectId(parent.postId) })
        }
    }
}

export default postQueryResolvers;