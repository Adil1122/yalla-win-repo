// @ts-ignore
import mongoose, {Schema} from "mongoose";

const couponSchema = new Schema (
    {
        coupon_code: {type: String, required: false},
        price: {type: String, required: false},
        date: {type: Date, required: false},
        date_only: {type: String, required: false},
        time_only: {type: String, required: false},
        purchased: {type: Number, required: false},
        active: {type: Number, required: false},
        type: {type: String, required: false},
        for_type: {type: String, required: false},
        merchant_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        shop_id: {type: mongoose.Types.ObjectId, ref: 'Shop', required: false},
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        available_type: {type: String, required: false},
        expiration_date: {type: Date, required: false},
        auto_generated: {type: Number, required: false}
    },
    {
        timestamps: true
    }
)

const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default CouponModel;