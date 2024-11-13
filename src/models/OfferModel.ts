// @ts-ignore
import mongoose, {Schema} from "mongoose";

const offerSchema = new Schema (
    {
        name: {type: String, required: true},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        game_name: {type: String, required: false},
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        qty_multiple: {type: Number, required: false},
        platform_type: {type: String, required: false},
        offer_type: {type: String, required: false},
        start_date: {type: String, required: false},
        expiry_date: {type: String, required: false},
        status: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const OfferModel = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export default OfferModel;