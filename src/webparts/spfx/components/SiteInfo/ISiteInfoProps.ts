import { WebPartContext } from '@microsoft/sp-webpart-base';

export type site = {
  Id?: number;
  Title: string;
  SiteType: string;
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

export interface ISiteInfoProps {
    siteInfo: site;
    context:WebPartContext;
  }

  export interface ISiteInfoState {
    searchResults: site[];
    selectedSite: site | null;
  }