import { createContext, useContext } from "react";
import NotificationStore from "./notificationStore";
import ActivityStore from "./activityStore";
import CategoriesStore from "./categoryStore";


interface Store {
  notificationStore: NotificationStore;
  activityStore: ActivityStore;
  categoryStore: CategoriesStore
  
}

export const store: Store = {
  notificationStore: new NotificationStore(),
  activityStore: new ActivityStore(),
  categoryStore: new CategoriesStore
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}