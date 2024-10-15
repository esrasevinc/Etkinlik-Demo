import { Activity } from "./activity";
import { Customer } from "./customer";
import { TicketSeat } from "./ticketSeat";

export interface Ticket {
    id?: string;
    activity: Activity,
    activityId?: string;
    customer: Customer;
    customerId?: string;
    ticketSeat: TicketSeat;
    ticketSeatId?: string;
}