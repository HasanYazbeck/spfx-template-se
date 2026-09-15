
  export interface ICommon {
    Id?: string | undefined;
    Title?: string | undefined;
  }

  export type ISite = {
    Id?: string | undefined;
    MTSID: string | undefined;
    Title?: string | undefined;
    PowerTechSiteName: string | undefined;
    SiteType?: string | undefined;
    Kaza?: string | undefined;
    IsSecure?: boolean | undefined;
    PowerSource?: string | undefined;
    PowerSourceNumber?: string | undefined;
    Priority?: number | undefined;
    NearestArmyCenter?: string | undefined;
    NearestArmyCenterNumber?: string | undefined;
    Remarks?: string | undefined;
    Latitude?: string | undefined;
    Longtitude?: string | undefined;
  }

  export type IDeviceType = {
    Id?: string | undefined;
    Title?: string | undefined;
  }

  export type IDeviceCategory = {
    Id?: string | undefined;
    Title?: string | undefined;
    DeviceTypes?: IDeviceType;
  }

  export type IDevice = {
    Id?: string | undefined;
    Title?: string | undefined;
    DeviceType?: IDeviceType | undefined;
    DeviceCategory?: IDeviceCategory | undefined;
  }

  export interface DateRange {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }


  