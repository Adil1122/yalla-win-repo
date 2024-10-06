// @ts-ignore
import mongoose, {Schema} from "mongoose";

const walletSchema = new Schema (
    {
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        amount: {type: Number, required: true},
    },
    {
        timestamps: true
    }
)

const WalletModel = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema, 'wallets');
export default WalletModel;