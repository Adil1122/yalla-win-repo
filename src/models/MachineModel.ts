// @ts-ignore
import mongoose, {Schema} from "mongoose";

const machineSchema = new Schema (
    {
        machine_id: {type: String, required: true},
        merchant_id: {type: mongoose.Types.ObjectId, ref: 'User', required: false},
        shop_id: {type: mongoose.Types.ObjectId, ref: 'Shop', required: false},
        location: {type: String, required: false},
        status: {type: String, required: false},
        locked: {type: Number, required: false},
    },
    {
        timestamps: true
    }
)

const MachineModel = mongoose.models.Machine || mongoose.model("Machine", machineSchema);
export default MachineModel;