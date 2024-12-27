import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISearchBarProps<T> {
    onSelectItem?: (item: any | null) => void ;
    OnChange: React.ChangeEventHandler<HTMLInputElement>;
    searchResults: any[];
    itemTitle: string;
}

export interface ISearchBarState<T>{
    searchResults: T[];
    selectedItem: T | null;
}