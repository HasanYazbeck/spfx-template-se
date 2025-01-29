export interface ISearchBarProps<T> {
    onSelectItem?: (item: any | null) => void ;
    OnChange: React.ChangeEventHandler<HTMLInputElement>;
    searchResults: T[];
    itemTitle: string;
    keyId: string;
    className?: string | undefined;
    placeholder?: string
}

export interface ISearchBarState<T>{
    searchResults: T[];
    selectedItem: T | null;
}