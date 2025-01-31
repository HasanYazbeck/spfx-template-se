import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISite , IDevice , IDeviceCategory , IDeviceType } from '../../../../Interfaces/ICommon';
import { IUser } from '../../../../Interfaces/IUser';

  export interface Problem {
    Id: string | undefined;
    Site: ISite | undefined
    DeviceCategory: IDeviceCategory | undefined;
    DeviceType: IDeviceType | undefined;
    IssueTitle: string | undefined;
    Description: string | undefined;
    Severity: Severity | undefined;
    Author: IUser | undefined;
    Created: Date | undefined;
    ContactNumber: string | undefined;
    Attachments?: FileWithPreview[] | undefined;
  }

  export interface IProblemsProps {
    context: WebPartContext;
    problems: Problem[];
    // problem : Problem;
    sites: ISite [];
    users: IUser [];
    devices: IDevice [];
    deviceCategories: IDeviceCategory [] | undefined;
    deviceTypes: IDeviceType [] | undefined;
  }

  export interface IProblemsState {
    problems: Problem[];
    originalProblems: Problem[],
    formProblem: Problem;
    loading: boolean;
    error: string | undefined;
    selectedCategory: IDevice | undefined,
    showModal: boolean,
    selectedProblem: Problem | undefined,
    startDate: Date | undefined;
    endDate: Date | undefined;
  }   

  export type Severity = 'critical' | 'high' | 'medium' | 'low';

  export type FileWithPreview = {
    file: File;
    preview?: string;
    id: string;
  };
