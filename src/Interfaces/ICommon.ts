
export interface ICommon {
    Id: string;
    Title: string;
}

export type ISite = {
    Id?: number;
    Title: string;
    SiteType?: string;
    Kaza?: string;
    IsSecure?: boolean;
    PowerSource?: string;
    PowerSourceNumber?: string;
    Priority?: number;
    NearestArmyCenter?: string;
    NearestArmyCenterNumber?: string;
    Remarks?: string;
    Latitude?: string;
    Longtitude?: string;
  }

  export type IDeviceType = {
    Id: string;
    Title: string;
  }

  export type IDeviceCategory = {
    Id: string;
    Title: string;
    DeviceTypes?: IDeviceType;
  }

  export type IDevice = {
    Id: string;
    Title: string;
    DeviceType?: IDeviceType;
    DeviceCategory?: IDeviceCategory;
  }

  

  