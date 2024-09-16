import { Place } from "./place";

export interface EventHall {
    id: string;
    title: string;
    rows: number;
    columns: number;
    place: Place;
    placeId: string;
  }