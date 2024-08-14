import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../routes/Routes";

export default class UserStore {
  user: User | null = null;
  refreshTokenTimeout?: number;
  usersRegistry = new Map<string, User>();
  selectedUser: User | undefined = undefined;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get usersAll() {
    return Array.from(this.usersRegistry.values());
  }

  private setUser = (user: User) => {
    this.usersRegistry.set(user.id!, user);
  };

  private getUser = (id: string) => {
    return this.usersRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadUsers = async () => {
    this.setLoadingInitial(true);
    this.usersRegistry.clear();
    try {
      const users = await agent.Users.list();
      users.forEach((user) => {
        this.setUser(user);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  getUserById = async (id: string) => {
    let user = this.getUser(id);
    if (user) {
      this.selectedUser = user;
      return user;
    } else {
      this.setLoadingInitial(true);
      try {
        user = await agent.Users.details(id);
        this.setUser(user);
        runInAction(() => (this.selectedUser = user));

        this.setLoadingInitial(false);
        return user;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  updateUser = async (user: User) => {
    try {
      this.loading = true;
      await agent.Users.update(user);
      runInAction(() => {
        if (user.id) {
          const updatedUser = { ...this.getUser(user.id), ...user };
          this.usersRegistry.set(user.id, updatedUser as User);
          this.selectedUser = updatedUser as User;
        }
        router.navigate("/kullanicilar");
        store.notificationStore.openNotification("success", "Kullanıcı başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Kullanıcı güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteUser = async (id: string) => {
    this.loading = true;
    try {
      await agent.Users.delete(id);
      runInAction(() => {
        this.usersRegistry.delete(id);
        this.loading = false;
        
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedUser = () => {
    this.selectedUser = undefined;
  };


  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    const user = await agent.Account.login(creds);
    store.commonStore.setToken(user.token);
    this.startRefreshTokenTimer(user);
    runInAction(() => (this.user = user));
    router.navigate("/");
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    router.navigate("/giris");
  };


register = async (creds: UserFormValues) => {
  try {
    const user = await agent.Account.register(creds);
    store.commonStore.setToken(user.token);
    runInAction(() => this.user = user);
    router.navigate('/kullanicilar');
  } catch (error) {
    console.log(error);
  }
};

  getCurrentUser = async () => {
    try {
      const user = await agent.Account.current();
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.Account.refreshToken();
      runInAction(() => (this.user = user));
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  private startRefreshTokenTimer(user: User) {
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 30 * 1000;
    this.refreshTokenTimeout = window.setTimeout(this.refreshToken, timeout);
    console.log({ refreshTimeout: this.refreshTokenTimeout });
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
