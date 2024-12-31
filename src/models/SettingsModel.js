// @ts-ignore
import mongoose, {Schema} from "mongoose";

const settingsSchema = new Schema (
   {
      show_winners_app: { type: String, required: true },
      show_winners_shop: { type: String, required: true },
      show_winners_web: { type: String, required: true },

      show_coupons_app: { type: String, required: true },
      show_coupons_shop: { type: String, required: true },
      show_coupons_web: { type: String, required: true }

   },
   {
      timestamps: true
   }
)

const SettingsModel = mongoose.models.Setting || mongoose.model("Setting", settingsSchema);
export default SettingsModel;