import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../routes/Routes";
import { EventHall } from "../models/eventHall";

export default class EventHallStore {
  eventHallsRegistry = new Map<string, EventHall>();
  selectedEventHall: EventHall | undefined = undefined;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get categories() {
    return Array.from(this.eventHallsRegistry.values());
  }

  private setEventHall = (eventHall: EventHall) => {
    this.eventHallsRegistry.set(eventHall.id!, eventHall);
  };

  private getEventHall = (id: string) => {
    return this.eventHallsRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadEventHalls = async () => {
    this.setLoadingInitial(true);
    this.eventHallsRegistry.clear();
    try {
      const eventHalls = await agent.EventHalls.list();
      eventHalls.forEach((eventHall) => {
        this.setEventHall(eventHall);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  loadEventHallById = async (id: string) => {
    let eventHall = this.getEventHall(id);
    if (eventHall) {
      this.selectedEventHall = eventHall;
      return eventHall;
    } else {
      this.setLoadingInitial(true);
      try {
        eventHall = await agent.EventHalls.details(id);
        this.setEventHall(eventHall);
        runInAction(() => (this.selectedEventHall = eventHall));

        this.setLoadingInitial(false);
        return eventHall;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  createEventHall = async (eventHall: EventHall) => {
    try {
      this.loading = true;
      const createdEventHall = await agent.EventHalls.create(eventHall);
      this.setEventHall(createdEventHall);
      router.navigate("/salonlar");
      store.notificationStore.openNotification("success", "Salon başarıyla eklendi.", "");
      this.loading = false;
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Salon eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateEventHall = async (eventHall: EventHall) => {
    try {
      this.loading = true;
      await agent.EventHalls.update(eventHall);
      runInAction(() => {
        if (eventHall.id) {
          const updatedEventHall = { ...this.getEventHall(eventHall.id), ...eventHall };
          this.eventHallsRegistry.set(eventHall.id, updatedEventHall as EventHall);
          this.selectedEventHall = updatedEventHall as EventHall;
        }
        router.navigate("/salonlar");
        store.notificationStore.openNotification("success", "Salon başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Salon güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteEventHall = async (id: string) => {
    this.loading = true;
    try {
      await agent.EventHalls.delete(id);
      runInAction(() => {
        this.eventHallsRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedEventHall = () => {
    this.selectedEventHall = undefined;
  };
}
