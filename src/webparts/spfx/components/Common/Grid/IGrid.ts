export interface IGridProps<T> {
    OnChange?: React.ChangeEventHandler<HTMLInputElement>;
    OnClick?: () => void;
    OnViewDetailsClick?: React.MouseEventHandler<HTMLButtonElement>;
    list: T[];
}

export interface IGridState<T> {
    list?: T[];
}
