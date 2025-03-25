// @ts-ignore
import mongoose, {Schema} from "mongoose";

const winnerTodaySchema = new Schema (
    {
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        winning_date: {type: Date, required: false},
        winning_number: {type: Number, required: false},
    },
    {
        timestamps: true
    }
)

const WinnerTodayModel = mongoose.models.WinnerToday || mongoose.model("WinnerToday", winnerTodaySchema);
export default WinnerTodayModel;