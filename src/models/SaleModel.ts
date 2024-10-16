// @ts-ignore
import mongoose, {Schema} from "mongoose";

const saleSchema = new Schema (
    {
        merchant_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        total_sales: {type: Number, required: false},
        total_orders: {type: Number, required: false},
        winning_orders: {type: Number, required: false},
        merchant_percentage: {type: Number, required: false},
        our_percentage: {type: Number, required: false},
        payment_status: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const SaleModel = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default SaleModel;