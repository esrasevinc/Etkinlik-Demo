import { createContext, useContext } from "react";
import NotificationStore from "./notificationStore";
import ActivityStore from "./activityStore";
import CategoriesStore from "./categoryStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import PlaceStore from "./placeStore";


interface Store {
  notificationStore: NotificationStore;
  activityStore: ActivityStore;
  categoryStore: CategoriesStore;
  userStore: UserStore;
  placeStore: PlaceStore;
  commonStore: CommonStore;
}

export const store: Store = {
  notificationStore: new NotificationStore(),
  activityStore: new ActivityStore(),
  categoryStore: new CategoriesStore(),
  userStore: new UserStore(),
  placeStore: new PlaceStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}