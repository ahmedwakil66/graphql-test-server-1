import connectToDB from "../../dbConfig/dbGql.js";
import { ObjectId } from "mongodb";
import { runJwtVerification, runSameUserCheck } from "../../verificationFunctions/verifyJWT.js";

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        user: async (_, args, context) => {
            runJwtVerification(context)
            let queryConditions;
            if(args.userId) {
                runSameUserCheck(args.userId, context);
                queryConditions = {_id: new ObjectId(args.userId)};
            } else if (args.email) {
                runSameUserCheck(args.email, context)
                queryConditions = {email: args.email};
            } else {
                throw new Error("Must provide one of the following: userId or email");
            }
            const { userCollection } = await connectToDB();
            return await userCollection.findOne(queryConditions);
        },

        users: async (_, __, context) => {
            runJwtVerification(context);
            if(context.user.role !== 'ADMIN') throw new Error("Unauthorized access detected!");
            const { userCollection } = await connectToDB();
            const result = await userCollection.find().toArray();
            return result;
        }
    },


    // mutations starts
    Mutation: {
        storeUser: async (_, args) => {
            const newUser = args.input;
            newUser.role = "USER";
            const { userCollection } = await connectToDB();
            try {
                const result = await userCollection.insertOne(newUser);
                if (!result.insertedId) throw new Error("Failed to create an account");
                newUser._id = result.insertedId;
                return {
                    code: "200",
                    success: true,
                    message: `Account created successfully`,
                    insertedId: result.insertedId,
                    user: newUser
                }
            }
            catch (error) {
                throw new Error(`Failed to create an account. Error: ${error.message}`);
            }
        }
    }
};

export default resolvers;