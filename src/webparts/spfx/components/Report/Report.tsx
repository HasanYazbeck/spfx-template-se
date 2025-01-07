import * as React from 'react';
import {IReportProps , IReportState , Report } from './IReport';
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';
import { SearchBar } from '../SearchBarComponent/SearchBar';

export class Reports extends React.Component<IReportProps, IReportState> {
    private spCrudOperations: SPCrudOperations;
    state: IReportState = {
        searchResults: [],
        selectedItem: null
      }

    constructor(props: IReportProps) {
        super(props);
    }
   
    public render(): React.ReactElement<{}> {
        return (
            <div className={`directory-container`}>
                <div className={`mt-1 position-relative`}>
                  <SearchBar keyId={'ReportsSearchBar'} itemTitle='Reports' OnChange={this.handleSearchChange}
                  onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
                </div>
                <div className={`p-3 text-white`}>
                  Coming Soon! Stay Tuned.....
                </div>
            </div>
        );
    }

    // Handle search input change
    private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let reportTitle: string = event.currentTarget.value;
      reportTitle = reportTitle.replace(/'/g, "''");
        if (reportTitle === '' ) {
          this.setState({ selectedItem: null, searchResults: []});
        } else {
          // this.searchReports(reportTitle);
        }
      }

    // Handle site selection
    private handleItemSelect = (report: Report) => {
      if (report !== null ) {
        this.setState({ selectedItem: report, searchResults: []});
      } else {
        this.setState({ selectedItem: null, searchResults: []});
      }
    }
}