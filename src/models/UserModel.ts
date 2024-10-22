// @ts-ignore
import mongoose, {Schema} from "mongoose";

const userSchema = new Schema (
    {
        name: {type: String, required: true},
        first_name: {type: String, required: false},
        last_name: {type: String, required: false},
        email: {type: String, required: true},
        dateOfBirth: {type: String, required: false},
        shippingAddress: {type: String, required: false},
        residentialAddress: {type: String, required: false},
        state: {type: String, required: false},
        password: {type: String, required: false},
        password_text: {type: String, required: false},
        country: {type: String, required: false},
        city: {type: String, required: false},
        area: {type: String, required: false},
        country_code: {type: String, required: false},
        mobile: {type: String, required: false},
        active: {type: Number, required: false},
        locked: {type: Number, required: false},
        mac: {type: String, required: false},
        qr_code: {type: String, required: false},
        image: {type: String, required: false},
        role: {type: String, required: false},
        platform: {type: String, required: false},
        shop_id: {type: mongoose.Types.ObjectId, ref: 'Shop', required: false},
        //machine_id: {type: mongoose.Types.ObjectId, ref: 'Machine', required: false},
        eid: {type: String, required: false},
        profit_percentage: {type: Number, required: false},
        registeration_date: {type: Date, required: false},
        user_type: {type: String, required: false}
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;