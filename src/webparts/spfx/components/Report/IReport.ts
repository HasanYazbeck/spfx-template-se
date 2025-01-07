import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface Report {
    Title: string;
  }

export interface IReportProps {
    context: WebPartContext;
    report : Report;
}

export interface IReportState {
    searchResults: Report[];
    selectedItem: Report;
}