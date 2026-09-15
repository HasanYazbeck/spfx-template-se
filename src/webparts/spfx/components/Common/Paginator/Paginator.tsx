import * as React from "react";
import { IPaginatorProps, IPaginatorState } from "./IPaginator";
import styles from "../../../../common.module.scss";

export class Paginator extends React.Component<
  IPaginatorProps<{}>,
  IPaginatorState<{}>
> {
  constructor(props: IPaginatorProps<{}>) {
    super(props);
  }

  public render(): React.ReactElement<{}> {
    const totalPages: number = this.getTotalPages();
    const pageNumbers: number[] = [];
    for (let i: number = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className="page-item disabled">
            <button
              className={`page-link ${styles.militaryBrownColor}`}
              tabIndex={-1}
              aria-disabled="true"
              onClick={this.props.handleNextPage} // {this.handlePrevPage}
              disabled={this.props.currentPage === 1}
            >
              ❮
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li
              className={`page-item ${this.props.currentPage === page ? `active ${styles.militaryBrownBackground}` : ""}`}
              key={page}
              aria-current="page"
            >
              <a
                className={`${styles.militaryBrownColor} page-link`}
                onClick={this.props.handlePageClick}
                role="link"
              >
                {page}
              </a>
            </li>
          ))}
          <li className="page-item">
            <button
              className={`page-link ${styles.militaryBrownColor}`}
              onClick={this.props.handleNextPage}
              disabled={this.props.currentPage === totalPages}
            >
              ❯
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  private getTotalPages = (): number => {
    const items =
      this.props.items !== undefined && this.props.items !== null
        ? this.props.items
        : [];
    const itemsPerPage =
      this.props.itemPerPage !== undefined && this.props.itemPerPage !== null
        ? this.props.itemPerPage
        : 1;
    return Math.ceil(items.length / itemsPerPage);
  };
  public state: IPaginatorState<{}> = {};
}
