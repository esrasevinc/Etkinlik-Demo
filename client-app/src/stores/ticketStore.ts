import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../routes/Routes";
import { Ticket } from "../models/ticket";

export default class TicketStore {
  ticketsRegistry = new Map<string, Ticket>();
  selectedTicket: Ticket | undefined = undefined;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get tickets() {
    return Array.from(this.ticketsRegistry.values());
  }

  private setTicket = (ticket: Ticket) => {
    this.ticketsRegistry.set(ticket.id!, ticket);
  };

  private getTicket = (id: string) => {
    return this.ticketsRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadTickets = async () => {
    this.setLoadingInitial(true);
    this.ticketsRegistry.clear();
    try {
      const tickets = await agent.Tickets.listAll();
      tickets.forEach((ticket) => {
        this.setTicket(ticket);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };


  createCategory = async (ticket: Ticket) => {
    try {
      this.loading = true;
      const cretaedTicket = await agent.Tickets.buyTicket(ticket);
      this.setTicket(cretaedTicket);
      router.navigate("/biletler");
      store.notificationStore.openNotification("success", "Bilet başarıyla oluşturuldu.", "");
      this.loading = false;
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Bilet oluşturulamadı.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedTicket = () => {
    this.selectedTicket = undefined;
  };
}
