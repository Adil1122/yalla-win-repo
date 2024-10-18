// @ts-ignore
import mongoose, {Schema} from "mongoose";

const winnerSchema = new Schema (
    {
        ticket_id: {type: mongoose.Types.ObjectId, ref: 'Ticket', required: false},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        game_name: {type: String, required: false},
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        prize_id: {type: mongoose.Types.ObjectId, ref: 'Prize', required: false},
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        draw_id: {type: mongoose.Types.ObjectId, ref: 'Draw', required: true},
        invoice_id: {type: mongoose.Types.ObjectId, ref: 'Invoice', required: false},
        user_name: {type: String, required: false},
        winning_date: {type: Date, required: false},
        prize_amount: {type: Number, required: false},
        amount_withdrawn: {type: Number, required: false},
        platform_type: { type: String, default: 'web', required: false }
    },
    {
        timestamps: true
    }
)

const WinnerModel = mongoose.models.Winner || mongoose.model("Winner", winnerSchema);
export default WinnerModel;