import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchaseDatetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

ticketSchema.pre("validate", function (next) {
    if (!this.code) {
        // Genera un código único para el ticket
        this.code = `TCKT-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
    }
    next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;