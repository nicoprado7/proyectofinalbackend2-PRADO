import TicketModel from "../daos/mongodb/models/ticket.model.js";

export default class TicketRepository {
    async save(data) {
        return await TicketModel.create(data);
    }
}