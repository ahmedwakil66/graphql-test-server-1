import { ObjectId } from "mongodb";
import connectToDB from "../../dbConfig/dbGql.js";
import { runJwtVerification, runSameUserCheck } from "../../verificationFunctions/verifyJWT.js";

const postMutationResolvers = {
    Mutation: {
        addPost: async (_, args, context) => {
            // runJwtVerification(context);
            const newPost = args.newPost;
            const { postCollection } = await connectToDB();
            try {
                const result = await postCollection.insertOne(newPost);
                if (!result.insertedId) throw new Error("Failed to add post");
                newPost._id = result.insertedId;
                return {
                    code: "200",
                    success: true,
                    message: `Post added successfully`,
                    insertedId: result.insertedId,
                    post: newPost
                }
            }
            catch (error) {
                throw new Error(`Failed to add post. Error: ${error.message}`);
            }
        },

        likePost: async (_, args, context) => {
            const { postId, postLikerId, created_at } = args;
            runJwtVerification(context);
            runSameUserCheck(postLikerId, context);
            const newLike = {
                postId,
                postLikerId,
                created_at,
            }
            const { likeCollection } = await connectToDB();
            try {
                const result = await likeCollection.insertOne(newLike);
                if (!result.insertedId) throw new Error("Failed to like post");
                newLike._id = result.insertedId;
                return {
                    code: "200",
                    success: true,
                    message: `Post liked`,
                    insertedId: result.insertedId,
                    like: newLike,
                }
            }
            catch (error) {
                throw new Error(`Failed to like post. Error: ${error.message}`);
            }
        },

        unlikePost: async (_, args, context) => {
            runJwtVerification(context);
            runSameUserCheck(args.postLikerId, context);
            const { likeCollection } = await connectToDB();
            try {
                const result = await likeCollection.deleteOne({ _id: new ObjectId(args.likeId) });
                if (result.deletedCount !== 1) throw new Error("Failed to unlike post");
                return {
                    code: 200,
                    success: true,
                    message: `Post unliked`,
                    deletedCount: result.deletedCount,
                }
            }
            catch (error) {
                throw new Error(`Failed to unlike post. Error: ${error.message}`);
            }
        },

        savePost: async (_, args, context) => {
            runJwtVerification(context);
            runSameUserCheck(args.postToSave.userId, context);
            const { savePostCollection } = await connectToDB();
            const result = await savePostCollection.insertOne(args.postToSave);
            if (!result.insertedId) throw new Error("Failed to save post");
            return {
                code: 200,
                success: true,
                message: `Post saved`,
                insertedId: result.insertedId,
            }
        },

        removeSavedPost: async (_, args, context) => {
            runJwtVerification(context);
            runSameUserCheck(args.userId, context);
            const { savePostCollection } = await connectToDB();
            const result = await savePostCollection.deleteOne(
                { postId: args.postId, userId: args.userId }
            );
            console.log('remove',result);
            if (result.deletedCount !== 1) throw new Error("Failed to remove this saved post");
            return {
                code: 200,
                success: true,
                message: `Post removed`,
                deletedCount: result.deletedCount,
            }
        },

        addComment: async (_, args, context) => {
            runJwtVerification(context);
            runSameUserCheck(args.userId, context)
            const newComment = args.newComment;
            const { commentCollection } = await connectToDB();
            const result = await commentCollection.insertOne(newComment);
            if (!result.insertedId) throw new Error("Failed to add comment");
            newComment._id = result.insertedId;
            return {
                code: 200,
                success: true,
                message: `Comment added`,
                insertedId: result.insertedId,
                comment: newComment,
            }
        }
    }
}

export default postMutationResolvers;