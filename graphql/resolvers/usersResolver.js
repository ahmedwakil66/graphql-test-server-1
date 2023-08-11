import connectToDB from "../../dbConfig/dbGql.js";
import { ObjectId } from "mongodb";

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        user: async (_, args) => {
            const { userCollection } = await connectToDB();
            return await userCollection.findOne({ _id: new ObjectId(args.userId) });
        },
        users: async () => {
            const { userCollection } = await connectToDB();
            const result = await userCollection.find().toArray();
            return result
        }
    },
    Mutation: {
        storeUser: async (_, req) => {
            console.log('request', req);
            const { userCollection } = await connectToDB();
            const result = await userCollection.insertOne(req.input);
            req.input._id = result.insertedId;
            // req.input._id = Date.now(); //temp
            return req.input
        }
    }
};

export default resolvers;