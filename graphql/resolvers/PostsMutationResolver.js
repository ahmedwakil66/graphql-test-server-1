import { ObjectId } from "mongodb";
import connectToDB from "../../dbConfig/dbGql.js";
import { runJwtVerification } from "../../verificationFunctions/verifyJWT.js";

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
        }
    }
}

export default postMutationResolvers;