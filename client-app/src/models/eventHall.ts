import { Place } from "./place";

export interface IEventHall {
    id: string | undefined;
    title: string;
    placeId: string;
    place: Place;
    rows: number;
    columns: number;
}

export class EventHall implements IEventHall {
    constructor(init: EventHallFormValues) {
      this.id = init.id!;
      this.title = init.title;
      this.placeId = init.placeId;
      this.place = init.place;
      this.rows = init.rows;
      this.columns = init.columns;
    }
    id: string | undefined;
    title: string;
    placeId: string;
    place: Place = { id: "", title: "" };
    rows: number = 1;
    columns: number = 1;
  }
  
  export class EventHallFormValues {
    id: string | undefined = undefined;
    title: string = "";
    placeId: string = "";
    place: Place = { id: "", title: "" };
    rows: number = 1;
    columns: number = 1;

    constructor(eventHall?: EventHallFormValues) {
      if (eventHall) {
        this.id = eventHall.id;
        this.title = eventHall.title;
        this.placeId = eventHall.placeId;
        this.place = eventHall.place;
        this.rows = eventHall.rows;
        this.columns = eventHall.columns;
      }
    }
}

