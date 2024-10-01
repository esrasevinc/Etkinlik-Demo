import { Category } from "./category";
import { EventHall } from "./eventHall";
import { Place } from "./place";

export interface IActivity {
    id: string | undefined;
    name: string;
    categoryId: string;
    category: Category;
    placeId: string;
    place: Place;
    eventHall: EventHall;
    eventHallId: string;
    date: Date | null;
    description: string;
    duration: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
    isPaid?: boolean;
}

export class Activity implements IActivity {
    constructor(init: ActivityFormValues) {
      this.id = init.id!;
      this.name = init.name;
      this.description = init.description;
      this.duration = init.duration;
      this.date = init.date;
      this.isActive = init.isActive;
      this.isDeleted = init.isDeleted;
      this.isCancelled = init.isCancelled;
      this.isPaid = init.isPaid;
      this.categoryId = init.categoryId;
      this.eventHall = init.eventHall;
      this.eventHallId = init.eventHallId;
      this.category = init.category;
      this.placeId = init.placeId;
      this.place = init.place;
    }
    id: string | undefined;
    name: string;
    description: string;
    duration: string;
    date: Date | null;
    placeId: string;
    place: Place = { id: "", title: "" };
    categoryId: string;
    category: Category = { id: "", title: "" };
    eventHallId: string;
    eventHall: EventHall = { id: "", title: "", rows: 0, columns: 0, place: { id: "", title: "" }, placeId: "" };
    isActive: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
    isPaid: boolean;
  }
  
  export class ActivityFormValues {
    id: string | undefined = undefined;
    name: string = "";
    description: string = "";
    duration: string = "";
    placeId: string = "";
    place: Place = { id: "", title: "" };
    date: Date | null = null;
    isActive: boolean = true;
    isDeleted: boolean = false;
    isCancelled: boolean = false;
    isPaid: boolean = false;
    categoryId: string = "";
    category: Category = { id: "", title: "" };
    eventHallId: string = "";
    eventHall: EventHall = { id: "", title: "", rows: 0, columns: 0, place: { id: "", title: "" }, placeId: "" };
  
    constructor(activity?: ActivityFormValues) {
      if (activity) {
        this.id = activity.id;
        this.name = activity.name;
        this.date = activity.date;
        this.description = activity.description;
        this.duration = activity.duration;
        this.placeId = activity.placeId;
        this.place = activity.place;
        this.isActive = activity.isActive;
        this.isDeleted = activity.isDeleted;
        this.isCancelled = activity.isCancelled;
        this.isPaid = activity.isPaid;
        this.categoryId = activity.categoryId;
        this.category = activity.category;
        this.eventHallId = activity.eventHallId;
        this.eventHall = activity.eventHall;
      }
    }
}

