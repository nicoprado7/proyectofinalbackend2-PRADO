import TicketRepository from "../repositories/ticket.repository.js";

export default class TicketService {
    #ticketRepository;

    constructor() {
        this.#ticketRepository = new TicketRepository();
    }

    async createTicket(data) {
        return await this.#ticketRepository.save(data);
    }
}