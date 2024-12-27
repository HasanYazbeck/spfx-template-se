import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITabsComponentState {
    activeTab: string; // To keep track of the currently active tab
  }

  export interface ITabsComponentProps {
    context: WebPartContext;
  }