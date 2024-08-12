import { createContext, useContext } from "react";
import NotificationStore from "./notificationStore";
import ActivityStore from "./activityStore";
import CategoriesStore from "./categoryStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";


interface Store {
  notificationStore: NotificationStore;
  activityStore: ActivityStore;
  categoryStore: CategoriesStore;
  userStore: UserStore;
  commonStore: CommonStore;
}

export const store: Store = {
  notificationStore: new NotificationStore(),
  activityStore: new ActivityStore(),
  categoryStore: new CategoriesStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}