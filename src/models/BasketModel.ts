// @ts-ignore
import mongoose, {Schema} from "mongoose";

const basketSchema = new Schema (
    {
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        quantity: {type: Number, required: true}
    },
    {
        timestamps: true
    }
)

const BasketModel = mongoose.models.Basket || mongoose.model("Basket", basketSchema);
export default BasketModel;