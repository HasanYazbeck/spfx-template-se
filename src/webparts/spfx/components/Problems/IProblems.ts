import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISite , IDevice , IDeviceCategory , IDeviceType } from '../../../../Interfaces/ICommon';

  export interface Problem {
    Title: string;
    SieName: string;
  }

  export interface IProblemsProps {
    context: WebPartContext;
    problem : Problem;
    sites: ISite [];
    devices: IDevice [];
    deviceCategories: IDeviceCategory [];
    deviceTypes: IDeviceType [];
  }

  export interface IProblemsState {
    searchResults: Problem[];
    selectedItem: Problem;
    loading: boolean;
    error: string | null;
    selectedCategory: IDevice | null,
    attachments: FileWithPreview[],
    formProblem : ProblemForm
  }   
  
  export type Severity = 'critical' | 'high' | 'medium' | 'low';

  export type FileWithPreview = {
    file: File;
    preview?: string;
    id: string;
  };

  export type ProblemForm = {
    siteName: string;
    siteLocation: string;
    deviceCategory: IDeviceCategory;
    deviceType: IDeviceType;
    issueTitle: string;
    description: string;
    severity: Severity;
    reportedBy: string;
    contactNumber: string;
  }