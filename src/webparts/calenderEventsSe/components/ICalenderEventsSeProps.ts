import { Guid } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISite } from '../../../Interfaces/ICommon';

export interface ICalenderEventsSeProps {
  description: string;
  // events: IEvent [];
  context: WebPartContext;
  categories: Category [];
  
}

export interface ICalenderEventsSeState {
  events: IEvent[];
  sites: ISite[];
  currentDate: Date;
  currentPage: number;  // Start on page 1
  eventsPerPage: number;
  selectedDate: Date | undefined;
  currentTime: string;
  showModal?: boolean;
  newEvent?: IEvent;
  IsTimeEarlier: boolean;
  isLoading: boolean;
}

export interface Category {
  Id: number | string | undefined;
  Title: string;
}

export interface IEvent {
  Id: number;
  Site?: {Id: string,Title: string};
  GUID?: Guid | undefined;
  Title: string;
  Description?: string;
  EventDate?: Date | undefined;
  EndDate?: Date | undefined;
  Location?: string;
  Category?: Category [];
  IsCategory?: boolean;
  OtherCategory?: string;
  IsOtherCategory?: boolean;
  IsCompleted?: boolean;
  ParticipantsPicker?: [{Id: number , Name: string}];
  fAllDayEvent?: boolean | undefined;
  fRecurrence?: boolean | undefined;
  startDate?: Date | undefined,
  endDate?: Date | undefined,
  StartTime?: string | undefined; //'14:30',
  EndTime?: string | undefined;
  RecurrenceType?: string,
  RecurrencePattern?: string,
  // RecurrenceDateRange?: Recurrences
};

