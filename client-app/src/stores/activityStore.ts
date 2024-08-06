import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity?: Activity = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.setLoadingInitial(true)

        try {
            const activities = await agent.Activities.list()
                activities.forEach(activity => {
                    this.activities.push(activity)
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

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    createActivity = async (activity: Activity) => {
        this.loading = true

        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activities.push(activity)
                this.selectedActivity = activity
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true

        try {
            await agent.Activities.update(activity)
            runInAction(() => {
                this.activities = [...this.activities.filter(a => a.id != activity.id), activity]
                this.selectedActivity = activity
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}


