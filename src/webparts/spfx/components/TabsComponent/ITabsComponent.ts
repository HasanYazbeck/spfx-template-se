import { WebPartContext } from "@microsoft/sp-webpart-base";

// Common interfaces
import {
  ISite,
  IDeviceType,
  IDeviceCategory,
  IDevice,
} from "../../../../Interfaces/ICommon";

// User interface
import { IUser } from "../../../../Interfaces/IUser";

export interface ITabsComponentState {
  activeTab: string; // To keep track of the currently active tab
  sites: ISite[];
  deviceTypes: IDeviceType[];
  deviceCategories: IDeviceCategory[];
  devices: IDevice[];
  users: IUser[];
  loading: boolean;
  error: string | undefined;
}

export interface ITabsComponentProps {
  context: WebPartContext;
}
