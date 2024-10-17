// @ts-ignore
import mongoose, {Schema} from "mongoose";

const ruleSchema = new Schema (
    {
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        product_name: {type: String, required: false},
        product_price: {type: Number, required: false},
        introduction: {type: String, required: false},
        how_to_participate: {type: String, required: false},
        option_straight_text: {type: String, required: false},
        option_chance_text: {type: String, required: false},
        option_rumble_text: {type: String, required: false},
        option_straight_win_price: {type: Number, required: false},
        option_rumble_win_price: {type: Number, required: false},
        option_chance_3_correct_win_price: {type: Number, required: false},
        option_chance_2_correct_win_price: {type: Number, required: false},
        option_chance_1_correct_win_price: {type: Number, required: false},
    },
    {
        timestamps: true
    }
)

const RuleModel = mongoose.models.Rule || mongoose.model("Rule", ruleSchema);
export default RuleModel;