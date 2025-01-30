import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISite , IDevice , IDeviceCategory , IDeviceType } from '../../../../Interfaces/ICommon';

  export interface Problem {
    Id: string | null;
    SiteName: string | null;
    DeviceCategory: IDeviceCategory | null;
    DeviceType: IDeviceType | null;
    IssueTitle: string | null;
    Description: string | null;
    Severity: Severity | null;
    ReportedBy: string;
    ContactNumber: string;
    Attachments?: FileWithPreview[] | null;
  }

  export interface IProblemsProps {
    context: WebPartContext;
    problems: Problem[];
    // problem : Problem;
    sites: ISite [];
    devices: IDevice [];
    deviceCategories: IDeviceCategory [] | null;
    deviceTypes: IDeviceType [] | null;
  }

  export interface IProblemsState {
    searchResults: Problem[];
    formProblem: Problem;
    loading: boolean;
    error: string | null;
    selectedCategory: IDevice | null,
    showModal: boolean,
    selectedProblem: Problem | null
  }   

  export type Severity = 'critical' | 'high' | 'medium' | 'low';

  export type FileWithPreview = {
    file: File;
    preview?: string;
    id: string;
  };
