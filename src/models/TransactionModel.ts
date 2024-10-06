// @ts-ignore
import mongoose, {Schema} from "mongoose";

const transactionSchema = new Schema (
    {
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        payment_type: {type: String, required: false},
        via: {type: String, required: false},
        card_details: {type: String, required: false},
        amount: {type: Number, required: false},
        date: {type: Date, required: false},
        closing_balance: {type: Number, required: false},
        note: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const TransactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default TransactionModel;