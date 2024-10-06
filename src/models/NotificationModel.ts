// @ts-ignore
import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema (
    {
        title: {type: String, required: false},
        content: {type: String, required: false},
        date: {type: String, required: false},
        time: {type: String, required: false},
        notification_date: {type: Date, required: false},
        type: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default NotificationModel;