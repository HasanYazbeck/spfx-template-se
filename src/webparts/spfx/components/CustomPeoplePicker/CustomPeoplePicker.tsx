import * as React from 'react';
import styles from './CustomPeoplePicker.module.scss';
import { IUser } from '../../../Interfaces/IUser';

export interface ICustomPeoplePickerProps {
  context: any; // SPFx context to access SharePoint API
  onUserSelect: (users: any[]) => void; // Callback to send selected users to the parent component
}

export interface ICustomPeoplePickerState {
  searchQuery: string;
}


export default class CustomPeoplePicker extends React.Component<ICustomPeoplePickerProps, ICustomPeoplePickerState> {


}



