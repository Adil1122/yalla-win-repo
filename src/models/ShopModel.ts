// @ts-ignore
import mongoose, {Schema} from "mongoose";

const shopSchema = new Schema (
    {
        name: {type: String, required: true},
        merchant_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        machine_id: {type: mongoose.Types.ObjectId, ref: 'Machine', required: false},
        location: {type: String, required: false},
        registeration_date: {type: Date, required: false},
    },
    {
        timestamps: true
    }
)

const ShopModel = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default ShopModel;