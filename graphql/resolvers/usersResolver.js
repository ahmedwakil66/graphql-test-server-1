import connectToDB from "../../dbConfig/dbGql.js";
import { ObjectId } from "mongodb";
import { runJwtVerification, runSameUserCheck } from "../../verificationFunctions/verifyJWT.js";

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        user: async (_, args, context) => {
            runJwtVerification(context)
            let queryConditions;
            if (args.userId) {
                runSameUserCheck(args.userId, context);
                queryConditions = { _id: new ObjectId(args.userId) };
            } else if (args.email) {
                runSameUserCheck(args.email, context)
                queryConditions = { email: args.email };
            } else {
                throw new Error("Must provide one of the following: userId or email");
            }
            const { userCollection } = await connectToDB();
            return await userCollection.findOne(queryConditions);
        },

        users: async (_, __, context) => {
            runJwtVerification(context);
            if (context.user.role !== 'ADMIN') throw new Error("Unauthorized access detected!");
            const { userCollection } = await connectToDB();
            const result = await userCollection.find().toArray();
            return result;
        },

        // search users by username or displayname, case insensitively
        searchUsers: async (_, args, context) => {
            const keywordPattern = new RegExp(args.keyword, 'i');
            const query = { $or: [{ displayName: { $regex: keywordPattern } }, { username: { $regex: keywordPattern } }] };
            const { userCollection } = await connectToDB();
            const result = await userCollection.find(
                query,
                { projection: { _id: 1, username: 1, displayName: 1, image: 1 } }
            ).toArray()
            return result;
        },

        isUsernameTaken: async (_, args) => {
            if (!args.username) throw new Error("Username not provided! You must provide a username to check against.");
            if (!typeof (args.username) === 'string') throw new Error("Invalid username format, it must be a string.");
            const { userCollection } = await connectToDB();
            const result = await userCollection.findOne({ username: args.username.toLowerCase() });
            return Boolean(result)
        },

        getEmailFromUsername: async (_, args) => {
            if (!args.username) throw new Error("Username not provided! You must provide a username to check against.");
            if (!typeof (args.username) === 'string') throw new Error("Invalid username format, it must be a string.");
            const { userCollection } = await connectToDB();
            return await userCollection.findOne({ username: args.username.toLowerCase() })
        },
    },


    // mutations starts
    Mutation: {
        storeUser: async (_, args) => {
            const newUser = args.input;
            newUser.role = "USER";
            newUser.last_notification_checked = null;
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
        },

        updateUser: async (_, args, context) => {
            runJwtVerification(context);
            if (args.userId) {
                runSameUserCheck(args.userId, context);
            } else {
                throw new Error("Must provide userId for same user check.");
            }
            const { userCollection } = await connectToDB();
            try {
                const result = await userCollection.updateOne(
                    { _id: new ObjectId(args.userId) },
                    { $set: args.updatedDoc }
                )
                let message = "User info updated!";
                if (result.modifiedCount === 0 && result.matchedCount > 0) {
                    message = "Everything is up-to-date!"
                }
                return {
                    code: "200",
                    success: true,
                    message,
                    modifiedCount: result.modifiedCount
                }
            }
            catch (error) {
                throw new Error(`Failed to update user info. Error: ${error.message}`);
            }
        }
    }
};

export default resolvers;