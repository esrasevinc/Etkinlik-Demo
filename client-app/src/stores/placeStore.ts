import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../routes/Routes";
import { Place } from "../models/place";

export default class PlaceStore {
  placesRegistry = new Map<string, Place>();
  selectedPlace: Place | undefined = undefined;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get places() {
    return Array.from(this.placesRegistry.values());
  }

  private setPlace = (place: Place) => {
    this.placesRegistry.set(place.id!, place);
  };

  private getPlace = (id: string) => {
    return this.placesRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadPlaces = async () => {
    this.setLoadingInitial(true);
    this.placesRegistry.clear();
    try {
      const places = await agent.Places.list();
      places.forEach((place) => {
        this.setPlace(place);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  loadPlaceById = async (id: string) => {
    let place = this.getPlace(id);
    if (place) {
      this.selectedPlace = place;
      return place;
    } else {
      this.setLoadingInitial(true);
      try {
        place = await agent.Places.details(id);
        this.setPlace(place);
        runInAction(() => (this.selectedPlace = place));

        this.setLoadingInitial(false);
        return place;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  createPlace = async (place: Place) => {
    try {
      this.loading = true;
      const createdPlace = await agent.Places.create(place);
      this.setPlace(createdPlace);
      router.navigate("/gosteri-merkezleri");
      store.notificationStore.openNotification("success", "Gösteri merkezi başarıyla eklendi.", "");
      this.loading = false;
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Gösteri merkezi eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updatePlace = async (place: Place) => {
    try {
      this.loading = true;
      await agent.Places.update(place);
      runInAction(() => {
        if (place.id) {
          const updatedPlace = { ...this.getPlace(place.id), ...place };
          this.placesRegistry.set(place.id, updatedPlace as Place);
          this.selectedPlace = updatedPlace as Place;
        }
        router.navigate("/gosteri-merkezleri");
        store.notificationStore.openNotification("success", "Gösteri merkezi başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Gösteri merkezi güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePlace = async (id: string) => {
    this.loading = true;
    try {
      await agent.Places.delete(id);
      runInAction(() => {
        this.placesRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedPlace = () => {
    this.selectedPlace = undefined;
  };
}
