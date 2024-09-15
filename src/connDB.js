import mongoose from 'mongoose';
import { config } from './config/config.js'

const connectDB = async () => {
    try {
        await mongoose.connect(
            config.MONGO_URL,
            {
                dbName: config.DB_NAME
            }
        );
        console.log(`MongoDB conectado`);
    } catch (error) {
        console.error(`Error al conectar a DB: ${error.message}`);
    }
};

export default connectDB;
