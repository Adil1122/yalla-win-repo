// @ts-ignore
import mongoose, {Schema} from "mongoose";

const invoiceSchema = new Schema (
    {
        product_id: {type: mongoose.Types.ObjectId, ref: 'Product', required: false},
        game_id: {type: mongoose.Types.ObjectId, ref: 'Game', required: false},
        user_id: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        draw_id: {type: mongoose.Types.ObjectId, ref: 'Draw', required: false},
        draw_date: {type: Date, required: false},
        invoice_number: {type: String, required: true},
        vat: {type: String, required: false},
        total_amount: {type: Number, required: true},
        invoice_date: {type: Date, required: true},
        invoice_status: {type: String, required: true},
        quantity: {type: Number, required: false},
        cart_product_details: {type: String, required: false},
        draws: {type: String, required: false},
        invoice_type: {type: String, required: false},
        platform: {type: String, required: false},
        user_city: {type: String, required: false},
        user_country: {type: String, required: false},
    },
    {
        timestamps: true
    }
)

const InvoiceModel = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default InvoiceModel;