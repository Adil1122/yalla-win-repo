// @ts-ignore
import mongoose, {Schema} from "mongoose";

const updateSchema = new Schema (
    {
        type: {type: String, required: false},
        file_url: {type: String, required: false},
        thumbnail: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const UpdateModel = mongoose.models.Update || mongoose.model("Update", updateSchema, 'updates');
export default UpdateModel;