import { Guid } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICalenderEventsSeProps {
  description: string;
  events: IEvent [];
  context: WebPartContext;
  categories: Category [];
}

export interface ICalenderEventsSeState {
  events: IEvent[];
  currentDate: Date;
  currentPage: number;  // Start on page 1
  eventsPerPage: number;
  selectedDate: Date | undefined;
  currentTime: string;
  showModal?: boolean;
  newEvent?: IEvent;
}

export interface Category {
  Id: number | string | undefined;
  Title: string;
}

export interface IEvent {
  Id: number;
  GUID?: Guid | undefined;
  Title: string;
  Description?: string;
  EventDate?: Date;
  EndDate?: Date;
  Location?: string;
  Category?: Category [];
  OtherCategory?: string;
  IsCompleted?: boolean;
  Participants?: [{Id: number , Name: string}];
  fAllDayEvent?: boolean | undefined;
  fRecurrence?: boolean | undefined;
  startDate?: Date | undefined, //new Date(2024, 11 - 1, 29)  November (Month 11, 11-1 = 10)
  endDate?: Date | undefined,
  startTime?: string | undefined; //'14:30',
  endTime?: string | undefined;
  RecurrenceType?: string,
  RecurrencePattern?: string,
  // RecurrenceDateRange?: Recurrences
};

