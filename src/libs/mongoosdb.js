import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
       var readyState = mongoose.connection.readyState;
       if(readyState !== 1) {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('connected to mongo DB')
       } else {
        console.log('Already connected to mongo DB')
       }
    } catch (error) {
        console.log(error)
    }
}

export default connectMongoDB;