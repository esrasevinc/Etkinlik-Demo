import { Category } from "./category";

export interface IActivity {
    id: string | undefined;
    name: string;
    categoryId: string;
    category: Category;
    date: Date | null;
    location: string;
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
      this.location = init.location;
      this.isActive = init.isActive;
      this.isDeleted = init.isDeleted;
      this.categoryId = init.categoryId;
      this.category = init.category;
    }
    id: string | undefined;
    name: string;
    description: string;
    date: Date | null;
    location: string;
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
    location: string = "";
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
        this.location = activity.location;
        this.isActive = activity.isActive;
        this.isDeleted = activity.isDeleted;
        this.isCancelled = activity.isCancelled;
        this.categoryId = activity.categoryId;
        this.category = activity.category;
      }
    }
}

