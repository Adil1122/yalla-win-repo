// @ts-ignore
import mongoose, {Schema} from "mongoose";

const ticketSchema = new Schema (
    {
        ticket_number: {type: String, required: true},
        invoice_id: {type: mongoose.Types.ObjectId, ref: 'Invoice', required: true},
        //ticket_price: {type: Number, required: true},
        //total_amount: {type: Number, required: true},
        ticket_type: {type: String, required: false},
        ticket_splitted: {type: Array, required: true}
    },
    {
        timestamps: true
    }
)

const TicketModel = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
export default TicketModel;