import { WebPartContext } from "@microsoft/sp-webpart-base";

export type site = {
  Title: string;
  Id?: number;
  SiteName: string;
  SiteType: string;
  Kadaa?: string;
  IsSecure?: boolean;
  PowerSource?: string;
  PowerSourceNumber?: string;
  Priority?: number;
  NearestArmyCenter?: string;
  NearstArmyCenterNumber?: string;
  Remarks?: string;
  Latitude?: string;
  Longtitude?: string;
}

export interface ISiteInfoProps {
    siteInfo: site;
    context:WebPartContext;
  }

  export interface ISiteInfoState {
    searchResults: site[];
    selectedSite: site | null;
  }