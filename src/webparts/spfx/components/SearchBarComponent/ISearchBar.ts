export interface ISearchBarProps<T> {
    onSelectItem?: (item: any | undefined) => void ;
    OnChange: React.ChangeEventHandler<HTMLInputElement>;
    searchResults: T[];
    itemTitle: string;
    keyId: string;
    className?: string | undefined;
    placeholder?: string,
    value?: any | undefined
}

export interface ISearchBarState<T>{
    searchResults: T[];
    selectedItem: T | undefined;
}