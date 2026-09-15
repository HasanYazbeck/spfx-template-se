export interface IPaginatorProps<T> {
    // OnChange?: React.ChangeEventHandler<HTMLInputElement>;
    handlePageClick?: () => void;
    handlePrevPage?: () => void;
    handleNextPage?: () => void;
    items: T[];
    currentPage: number | undefined;
    itemPerPage: number | undefined;
}

export interface IPaginatorState<T> {
    items?: T[];
}
