// @ts-ignore
import mongoose, {Schema} from "mongoose";

const productSchema = new Schema (
    {
        name: {type: String, required: true},
        image: {type: String, required: false},
        category_id: {type: mongoose.Types.ObjectId, ref: 'Category', required: false},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        prize_id: {type: mongoose.Types.ObjectId, ref: 'Prize', required: false},
        price: {type: Number, required: false},
        vat: {type: String, required: false},
        stock: {type: Number, required: false},
        description: {type: String, required: false},
        sold: {type: Number, required: false},
        status: {type: String, required: false},
        date: {type: Date, required: false},
        type: {type: String, required: false}
    },
    {
        timestamps: true
    }
)

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default ProductModel;