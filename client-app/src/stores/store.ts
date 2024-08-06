import { createContext, useContext } from "react";
import NotificationStore from "./notificationStore";
import ActivityStore from "./activityStore";


interface Store {
  notificationStore: NotificationStore;
  activityStore: ActivityStore;
  
}

export const store: Store = {
  notificationStore: new NotificationStore(),
  activityStore: new ActivityStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}