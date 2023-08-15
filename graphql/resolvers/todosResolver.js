import connectToDB from "../../dbConfig/dbGql.js";
import { ObjectId } from "mongodb";

const todosResolver = {
    Query: {
        todo: async (_, args) => {
            const { todoCollection } = await connectToDB();
            return await todoCollection.findOne({ _id: new ObjectId(args.todoId) })
        },
        todos: async (_, args) => {
            const { todoCollection } = await connectToDB();
            let queryConditions = { userId: args.userId };
            if (args.status) {
                queryConditions.status = args.status
            }
            return await todoCollection.find(queryConditions).toArray();
        },
    },

    Todo: {
        user: async (parent) => {
            const { userCollection } = await connectToDB();
            return await userCollection.findOne({ _id: new ObjectId(parent.userId) });
        }
    },




    //Mutations starts here
    Mutation: {
        addTodo: async (_, args) => {
            const newTodo = args.input;
            newTodo.timeEnded = null;
            const { todoCollection } = await connectToDB();
            try {
                const result = await todoCollection.insertOne(newTodo); 
                newTodo._id = result.insertedId;
                if (!result.insertedId) throw new Error("Failed to Save the new todo");
                return {
                    code: "200",
                    success: true,
                    message: `${newTodo.title} is added to your list`,
                    insertedId: result.insertedId,
                    todo: newTodo
                }
            }
            catch (error) {
                throw new Error(`Failed to Save the new todo. Error: ${error.message}`);
            }
        },

        toggleTodo: async (_, args) => {
            const { todoCollection } = await connectToDB();
            const oldTodo = await todoCollection.findOne({ _id: new ObjectId(args.todoId) });
            let updatedStatus = 'PENDING';
            if (oldTodo.status === 'PENDING') updatedStatus = 'COMPLETED';
            try {
                const result = await todoCollection.updateOne(
                    { _id: new ObjectId(args.todoId) },
                    { $set: { status: updatedStatus } }
                )
                if (!result.modifiedCount > 0) throw new Error("Failed to Update todo.");
                result.success = true;
                result.message = `${oldTodo.title} is now ${updatedStatus}`;
                return result;
            }
            catch (error) {
                throw new Error(`Failed to Update todo. Error: ${error.message}`);
            }
        },

        updateTodo: async (_, args) => {
            const { todoCollection } = await connectToDB();
            try {
                const result = await todoCollection.updateOne(
                    { _id: new ObjectId(args.todoId) },
                    {
                        $set: args.input
                    }
                );
                if (!result.modifiedCount) throw new Error("Failed to Update todo");
                result.success = true;
                result.message = `Todo updated`;
                return result;
            }
            catch (error) {
                throw new Error(`Failed to Update todo. Error: ${error.message}`);
            }
        },

        deleteTodo: async (_, args) => {
            const { todoCollection } = await connectToDB();
            try {
                const result = await todoCollection.deleteOne({ _id: new ObjectId(args.todoId) })
                if (!result.deletedCount > 0) throw new Error("Failed to Delete todo");
                result.success = true;
                result.deletedId = args.todoId;
                result.message = 'Delete success';
                return result;

            }
            catch (error) {
                throw new Error(`Failed to Delete todo. Error: ${error.message}`);
            }
        }
    }
}

export default todosResolver;