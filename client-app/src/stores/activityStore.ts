import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { router } from "../routes/Routes";
import { store } from "./store";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity?: Activity = undefined;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    private setActivity = (activity: Activity) => {
        this.activityRegistry.set(activity.id!, activity);
      };
    
      private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
      };
    
      clearSelectedActivity = () => {
        this.selectedActivity = undefined;
      };

      get activitiesAll() {
        return Array.from(this.activityRegistry.values());
      }

      get axiosParams() {
        const params = new URLSearchParams();
        return params;
      }

      loadActivityById = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }


    loadActivities = async () => {
        this.setLoadingInitial(true)
        this.activityRegistry.clear()

        try {
            const result = await agent.Activities.list()
                result.forEach(activity => {
                    this.setActivity(activity)
                })
                this.setLoadingInitial(false)
           
            
        } catch (error) {
            console.log(error)
                this.setLoadingInitial(false)
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }

    

    createActivity = async (activity: Activity) => {
        this.loading = true

        try {
            this.loading = true;
            await agent.Activities.create(activity);

            runInAction(() => {
              this.setActivity(activity);
              router.navigate("/etkinlikler");
              store.notificationStore.openNotification("success", "Etkinlik başarıyla oluşturuldu!", "");
              this.loading = false;
            });
          }  catch (err) {
            if (err instanceof Array) {
              for (const error of err) {
                store.notificationStore.openNotification("error", error, "");
              }
            } else store.notificationStore.openNotification("error", "Etkinlik oluşturulamadı!", "");
            runInAction(() => {
              this.loading = false;
            });
          }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true

        try {
            await agent.Activities.update(activity)
            runInAction(() => {
                if (activity.id) {
                  const updatedActivity = { ...this.getActivity(activity.id), ...activity };
                  this.activityRegistry.set(activity.id, updatedActivity as Activity);
                  this.selectedActivity = updatedActivity as Activity;
                }
                router.navigate("/etkinlikler");
                store.notificationStore.openNotification("success", "Etkinlik başarıyla güncellendi!", "");
                this.loading = false;
              });
        } catch (err) {
            if (err instanceof Array) {
              for (const error of err) {
                store.notificationStore.openNotification("error", error, "");
              }
            } else store.notificationStore.openNotification("error", "Etkinlik güncellenemedi!", "");
            runInAction(() => {
              this.loading = false;
            });
          }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                store.notificationStore.openNotification("success", "Etkinlik başarıyla silindi!", "");
                this.loading = false;
            })
        } catch (err) {
          if (err instanceof Array) {
            for (const error of err) {
              store.notificationStore.openNotification("error", error, "");
            }
          } else store.notificationStore.openNotification("error", "Etkinlik silinemedi!", "");
          runInAction(() => {
            this.loading = false;
          });
        }
    }   
}


