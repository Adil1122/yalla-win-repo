// @ts-ignore
import mongoose, {Schema} from "mongoose";

const drawSchema = new Schema (
    {
        //name: {type: String, required: true},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        prize_id: {type: mongoose.Types.ObjectId, ref: 'Prize', required: false},
        game_name: {type: String, required: false},
        prize_name: {type: String, required: false},
        draw_date: {type: Date, required: false},
        date_only: {type: String, required: false},
        time_only: {type: String, required: false},
        draw_type: {type: String, required: false},
        platform_type: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const DrawModel = mongoose.models.Draw || mongoose.model("Draw", drawSchema);
export default DrawModel;