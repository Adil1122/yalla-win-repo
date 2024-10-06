// @ts-ignore
import mongoose, {Schema} from "mongoose";

const favouriteSchema = new Schema (
    {
        number: {type: String, required: true},
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        draw_id: {type: mongoose.Types.ObjectId, ref: 'Draw', required: false}
    },
    {
        timestamps: true
    }
)

const FavouriteModel = mongoose.models.Favourite || mongoose.model("Favourite", favouriteSchema);
export default FavouriteModel;