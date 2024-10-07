import { ObjectId } from "mongodb";
// @ts-ignore
import mongoose, {Schema} from "mongoose";

const prizeSchema = new Schema (
    {
        name: {type: String, required: false},
        image: {type: String, required: false},
        price: {type: Number, required: false},
        specifications: {type: String, required: false},
        date: {type: Date, required: false}
    },
    {
        timestamps: true
    }
)

const PrizeModel = mongoose.models.Prize || mongoose.model("Prize", prizeSchema, 'prizes');
export default PrizeModel;