import { WebPartContext } from "@microsoft/sp-webpart-base";
import {ISite , IDeviceType , IDeviceCategory , IDevice} from '../../../../Interfaces/ICommon';

export interface ITabsComponentState {
    activeTab: string; // To keep track of the currently active tab
    sites: ISite [];
    deviceTypes: IDeviceType [];
    deviceCategories: IDeviceCategory [];
    devices: IDevice [];
    loading: boolean;
    error: string | null;
  }



  export interface ITabsComponentProps {
    context: WebPartContext;
  }