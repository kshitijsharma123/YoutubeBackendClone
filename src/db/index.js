import mongoose from 'mongoose';
import { DB_NAME } from './../constants.js';

import { app } from './../app.js'

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("ERROR", (error) => {
            console.log("ERROR", error)
        })
        console.log({ DatabaseConnected: true })
        console.log({ DatabaseHost: connectionInstance.connection.host });

        mongoose.connection.on("error", (error) => {
            console.log("Connection is made but having trouble talking to the database", { error });
        });

    } catch (error) {
        console.log("Some error connecting to the database", error);
        process.exit(1);
    }
};
