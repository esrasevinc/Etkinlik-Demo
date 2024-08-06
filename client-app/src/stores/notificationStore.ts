import { makeAutoObservable } from "mobx";
import { notification } from "antd";

class NotificationStore {
  constructor() {
    makeAutoObservable(this);
  }

  openNotification = (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description: string
  ) => {
    notification[type]({
      message: message,
      description: description,
    });
  };
}

export default NotificationStore;