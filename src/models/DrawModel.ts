// @ts-ignore
import mongoose, {Schema} from "mongoose";

const drawSchema = new Schema (
    {
        name: {type: String, required: true},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        prize_id: {type: mongoose.Types.ObjectId, ref: 'Prize', required: false},
        game_name: {type: String, required: false},
        draw_date: {type: Date, required: true},
        draw_type: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

const DrawModel = mongoose.models.Draw || mongoose.model("Draw", drawSchema);
export default DrawModel;