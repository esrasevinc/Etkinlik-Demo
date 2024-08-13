import { Category } from "./category";
import { Place } from "./place";

export interface IActivity {
    id: string | undefined;
    name: string;
    categoryId: string;
    category: Category;
    placeId: string;
    place: Place;
    date: Date | null;
    description: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
}

export class Activity implements IActivity {
    constructor(init: ActivityFormValues) {
      this.id = init.id!;
      this.name = init.name;
      this.description = init.description;
      this.date = init.date;
      this.isActive = init.isActive;
      this.isDeleted = init.isDeleted;
      this.categoryId = init.categoryId;
      this.category = init.category;
      this.placeId = init.placeId;
      this.place = init.place;
    }
    id: string | undefined;
    name: string;
    description: string;
    date: Date | null;
    placeId: string;
    place: Place = { id: "", title: "" };
    isActive: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
    categoryId: string;
    category: Category = { id: "", title: "" };
  }
  
  export class ActivityFormValues {
    id: string | undefined = undefined;
    name: string = "";
    description: string = "";
    placeId: string = "";
    place: Place = { id: "", title: "" };
    date: Date | null = null;
    isActive: boolean = true;
    isDeleted: boolean = false;
    isCancelled: boolean = false;
    categoryId: string = "";
    category: Category = { id: "", title: "" };
  
    constructor(activity?: ActivityFormValues) {
      if (activity) {
        this.id = activity.id;
        this.name = activity.name;
        this.date = activity.date;
        this.description = activity.description;
        this.placeId = activity.placeId;
        this.place = activity.place;
        this.isActive = activity.isActive;
        this.isDeleted = activity.isDeleted;
        this.isCancelled = activity.isCancelled;
        this.categoryId = activity.categoryId;
        this.category = activity.category;
      }
    }
}

