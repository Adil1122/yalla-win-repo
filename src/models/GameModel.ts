// @ts-ignore
import mongoose, {Schema} from "mongoose";

const gameSchema = new Schema (
    {
        name: {type: String, required: false},
        description: {type: String, required: false},
        type: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const GameModel = mongoose.models.Game || mongoose.model("Game", gameSchema, 'games');
export default GameModel;