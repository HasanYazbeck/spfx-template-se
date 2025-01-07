import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface Problem {
    Title: string;
    SieName: string;
  }

export interface IProblemsProps {
    context: WebPartContext;
    problem : Problem;
}

export interface IProblemsState {
    searchResults: Problem[];
    selectedItem: Problem;
}