import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISite } from '../../../../Interfaces/ICommon';

export type Remark = {
  Id?: number;
  ItemId: string;
  ListName: string;
  Description: string;
  Title: string;
  AddedBy?: string; //{ ID: string, Email: string, DisplayName: string };
  ModifiedBy?: string;
  DateAdded?: Date;
  DateModified?: Date;
}

export interface ISiteInfoProps {
    siteInfo:  ISite;
    context:WebPartContext;
    sites: ISite [];
  }

  export interface ISiteInfoState {
    searchResults: ISite[];
    selectedSite: ISite | undefined;
    siteRemarksList: Remark [];
    siteRemark: string | undefined;
    currentPage: number;
    remarksPerPage: number;
    remarkEmpty: boolean;
    totalRemarks: number;
    loading: boolean;
  }