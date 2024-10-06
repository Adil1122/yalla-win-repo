// @ts-ignore
import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema (
    {
        sender_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        receiver_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        title: {type: String, required: false},
        contents: {type: String, required: false},
        message_date: {type: Date, required: false},
    },
    {
        timestamps: true
    }
)

const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default MessageModel;