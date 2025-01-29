import * as React from 'react';

// Interfaces
import {ISiteInfoProps , ISiteInfoState, Remark } from './ISiteInfoProps';
import { ISite } from '../../../../Interfaces/ICommon';

// Components
import { SearchBar } from '../SearchBarComponent/SearchBar';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import commonStyles from '../../../common.module.scss';

// Classes
import { SPHelpers } from '../../../../Classes/SPHelpers';
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';

export class SiteInfo extends React.Component<ISiteInfoProps, ISiteInfoState> {
  private spCrudOperations: SPCrudOperations ;
  private spHelpers: SPHelpers = new SPHelpers();
  private listName: string = 'Site';

  constructor(props: ISiteInfoProps) {
      super();
      this.state = {
        searchResults: [],
        selectedSite: undefined,
        siteRemarksList: [],
        siteRemark : undefined,
        currentPage: 1,  // Initialize with the first page
        remarksPerPage: 4,
        remarkEmpty: false,
        totalRemarks:0,
        loading: false,
      };
  }

  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let siteName: string = event.currentTarget.value;
      siteName = siteName.replace(/'/g, "''");
    if (siteName === '') {
      this.setState({ selectedSite: undefined, searchResults: []});
    //event.currentTarget : {value: event.currentTarget.value}
    } else {
      this.searchSite(siteName);
    }
  }

  // Handle Site selection
  private handleSiteSelect = (site: ISite) => {
    if (site.Id !== 0) {
      this.getRemarks(site.Id.toString(),this.listName);
      this.setState({ selectedSite: site, searchResults: []});
    } else {
      this.setState({ selectedSite: undefined, searchResults: [] });
    }
  }

   private handleAddRemark = (): void => {
  const tempRemark: HTMLInputElement = document.getElementById('remark') as HTMLInputElement;
  const remarkValue: string = tempRemark.value.toString();
  if(remarkValue!== undefined && remarkValue!== null && remarkValue !== '') {
    this.setState({ remarkEmpty: false,});
    const remark: Remark = {
      Title: this.listName,
      ListName: this.listName,
      ItemId: this.state.selectedSite !== undefined && this.state.selectedSite.Id != null ? this.state.selectedSite.Id.toString() : '0',
      Description: this.state.siteRemark !== undefined ? this.state.siteRemark : ''
    };

    // Add the new remark
    this.addRemark(remark)
      .then(() => {
        // Clear the remark input after the addition
        tempRemark.value = '';  // Clear the textarea value
        // Optionally, update the component state if you want to reset any related state
        this.setState({siteRemark: '',remarkEmpty: false});
        // Fetch the updated remarks after adding the new one
        this.getRemarks(this.state.selectedSite.Id.toString(), this.listName);
      })
      .catch((error) => {
        console.error('An error occurred while adding the remark:', error);
      });
    } else {
      this.setState({remarkEmpty: true,});
    }
  }

  private handleRemarkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  this.setState({ siteRemark: event.target.value ,remarkEmpty: false });
  }

  private handleNextPage = (): void => {
  this.setState(
    (prevState) => ({currentPage: prevState.currentPage + 1,}),
    () => {
      // After updating the page, fetch the new set of remarks
      if (this.state.selectedSite) {
        this.getRemarks(this.state.selectedSite.Id.toString(), this.listName);
      }
    }
  );
  };

  private handlePreviousPage = (): void => {
  this.setState(
    (prevState) => ({currentPage: prevState.currentPage - 1,}),
    () => {
      // After updating the page, fetch the new set of remarks
      if (this.state.selectedSite) {
        this.getRemarks(this.state.selectedSite.Id.toString(), this.listName);
      }
    }
  );
  };
  
  private Pagination = (): JSX.Element => {
  const totalPages = this.getTotalPages();

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if(pageNumbers.length > 0){
    return (
      <div className={commonStyles.pagination}>
        <button className={commonStyles.prev} onClick={this.handlePreviousPage} disabled={this.state.currentPage === 1}>❮</button>
        {pageNumbers.map(page => (
          <span key={page} 
            className={`${commonStyles.pageNumber} ${this.state.currentPage === page ? commonStyles.active : ''}`}
            onClick={() => this.handlePageClick(page)} role=''>
            {page}
          </span>
        ))}
        <button className={commonStyles.next} onClick={this.handleNextPage}
        disabled={this.state.currentPage === totalPages} role=''>❯</button>
      </div>
    );
  }
  else {
    return null;
  }
  };

  private handlePageClick = (page: number) => {
      this.setState({ currentPage: page }, () => {
        if (this.state.selectedSite) {
            this.getRemarks(this.state.selectedSite.Id.toString(), this.listName);
        }
    });
  };

  private getTotalPages = (): number => {
  const { remarksPerPage, totalRemarks  } = this.state;
  return Math.ceil(totalRemarks / remarksPerPage);
  };

  private RemarksGrid = () : JSX.Element => {
  const { siteRemarksList, currentPage, remarksPerPage } = this.state;
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Beirut'
  };

  // const latestRemark: string =  this.state.siteRemarksList !== undefined && this.state.siteRemarksList.length > 0 ?
  //                               this.state.siteRemarksList.sort((a,b) => new Date(b.DateModified.toString()).getDate() - 
  //                               new Date(a.DateModified.toString()).getDate())[0].Description:'';
    return (
      <div className='card-body'>
              <form>
                {/* Existing form fields */}
                <div className='form-row mb-2'>
                  <div className='form-group col-md-12'>
                    <label>Remarks</label>
                    <textarea className='form-control' id='remark' rows={3}
                      placeholder={this.state.selectedSite.Remarks}
                      // value={this.state.selectedSite.Remarks || latestRemark}
                      onChange={(e) => this.handleRemarkChange(e) }
                    />
                  </div>
                  {this.state.remarkEmpty && (<small className="text-danger">Add your Remark</small>)}
                </div>

                {/* Add remark fields */}
                <div className='form-row mb-3'>
                  <div className='form-group col-md-12 d-flex justify-content-end'>
                    <button type='button' className='btn btn-primary' style={{backgroundColor: 'rgb(103, 86, 69)'}}
                    onClick={this.handleAddRemark}>Add Remark</button>
                  </div>
                </div>

                {/* Remarks Grid */}
                {siteRemarksList.length > 0 && 
                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th>Remark</th>
                        {/* <th>Added By</th>
                        <th>Date Added</th> */}
                        <th>Modified By</th>
                        <th>Date Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.siteRemarksList.map((remark, index) => (
                          <tr key={index}>
                          <td>{remark.Description}</td>
                          {/* <td>{remark.AddedBy}</td>
                          <td>{remark.DateAdded !== undefined && remark.DateAdded !== null ? this.spHelpers.convertGMTToLocalTime12Hour(remark.DateAdded.toString()) : ''}</td> */}
                          <td>{remark.ModifiedBy}</td>
                          <td>{remark.DateModified.toLocaleString('en-US', {timeZone: 'Asia/Beirut',hour12: true,hour: '2-digit',minute: '2-digit',second: '2-digit',
                               })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table> 
                   <this.Pagination/> 
                </div>
                }
              </form>
      </div>
    );
  }

  public render(): React.ReactElement<{}> {
        return (
            <div className='mt-1 position-relative'>
              <SearchBar keyId={'SiteInfoSearchBar'} 
                        itemTitle='Site' 
                        OnChange={this.handleSearchChange} 
                        onSelectItem={this.handleSiteSelect} 
                        searchResults={this.state.searchResults}
                        placeholder='Site Name or Site ID'/>

              {this.state.selectedSite !== undefined &&
                  <div className='card'>
                    <div className={`card-header text-white text-center`} style={{backgroundColor: '#4d784e'}}>
                        <h5>{this.state.selectedSite.Title.charAt(0).toUpperCase() 
                        + this.state.selectedSite.Title.slice(1)} - {this.state.selectedSite.Id} </h5>
                    </div>
                    <div className='card-body'>
                        <form>
                            {/* <!-- Site Information --> */}
                            <div className='row'>
                              <input type='text' className='form-control' id='siteId' value={this.state.selectedSite.Id} hidden/>
                                <div className='form-group col-md-6'>
                                    <label>Site Project</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteProject'
                                    placeholder={this.state.selectedSite.SiteType} disabled/>
                                </div>
                                <div className='form-group col-md-6'>
                                    <label>Kadaa - قضاء</label>
                                    <input type='text'
                                    className='form-control'
                                    id='kadaa'
                                    placeholder={this.state.selectedSite.Kaza} disabled/>
                                </div>
                            </div>
                            <div className='row'>
                                 <div className='form-group col-md-6'>
                                    <label>Site Usage</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteUsage'
                                    placeholder='' disabled/>
                                </div>
                                <div className='form-group col-md-6'>
                                    <label>Site Secure</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteSecure'
                                    placeholder={this.state.selectedSite.IsSecure ? 'Yes' : 'No'} disabled/>
                                </div>
                            </div>

                            {/* <!-- Priority and Coordinates --> */}
                            <div className='row'>
                              <div className='form-group col-md-6'>
                                <label >Priority</label>
                                <input type='text'
                                className='form-control'
                                id='priority'
                                placeholder={this.state.selectedSite.Priority ? this.state.selectedSite.Priority.toString() : ''} disabled/>
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Coordinates</label>
                                <input type='text'
                                className='form-control'
                                id='coordinates'
                                placeholder={
                                  this.state.selectedSite.Latitude !== null && this.state.selectedSite.Longtitude !== null ?
                                  this.state.selectedSite.Latitude + ' , ' + this.state.selectedSite.Longtitude : ''} disabled/>
                              </div>
                            </div>

                            {/* <!-- Nearest Army Point and Phone Numbers --> */}
                            <div className='row'>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenter'
                                placeholder={this.state.selectedSite.NearestArmyCenter} disabled/>
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point Numbers</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenterNumbers'
                                placeholder={this.state.selectedSite.NearestArmyCenterNumber} disabled/>
                              </div>
                            </div>

                            <div className='row'>
                                <div className='form-group col-md-6'>
                                      <label>Power Source</label>
                                      <input type='text'
                                      className='form-control'
                                      id='powerSource'
                                      placeholder={this.state.selectedSite.PowerSource} disabled/>
                                </div>
                                <div className='form-group col-md-6'>
                                  <label>Phone Numbers</label>
                                  <input type='text'
                                  className='form-control'
                                  id='phoneNumbers'
                                  placeholder={this.state.selectedSite.PowerSourceNumber} disabled/>
                                </div>
                            </div>
                            <this.RemarksGrid/>
                       </form>
                    </div>
                </div>
                  }
            </div>
        );
  }

  public searchSite = (siteName: string): void  => {
    const result: ISite [] = [];
    this.setState({ loading: true });
      try {
        // const query: string = `?$filter=substringof('${siteName}',Title) or ID eq '${siteName}'` +
        // `&$select=Id,Title,Latitude,Logtitude,PowerSourceNumber,IsSecure,Priority,NearestArmyCenter,NearestArmyCenterNumber,Remarks,`+
        // `Kaza/Id,Kaza/Title,SiteType/Id,SiteType/Title,PowerSource/Id,PowerSource/Title`+
        // `&$expand=Kaza,PowerSource,SiteType`;
        // this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
        //                         this.props.context.pageContext.web.absoluteUrl, 'Site', query);
        // this.spCrudOperations._getItemsWithQuery()
        // .then((data) => {
        //   data.map((obj) => {
        //     let siteType: string = '';
        //     obj.SiteType.map((item: any) => {
        //       siteType = siteType === '' ? item.Title.charAt(0).toUpperCase() + item.Title.slice(1) : siteType + '-' + item.Title.charAt(0).toUpperCase() + item.Title.slice(1);
        //     });
        //     const temp: ISite = {
        //       Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
        //       Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
        //       SiteType: siteType,
        //       Latitude: obj['Latitude'] !== undefined && obj['Latitude'] !== null ? obj['Latitude'] : '',
        //       Longtitude : obj['Logtitude'] !== undefined && obj['Logtitude'] !== null ? obj['Logtitude'] : '',
        //       Priority: obj['Priority'] !== undefined && obj['Priority'] !== null ? obj['Priority'] : 0,
        //       Remarks: obj['Remarks'] !== undefined && obj['Remarks'] !== null ? obj['Remarks'] : '',
        //       NearestArmyCenter: obj['NearestArmyCenter'] !== undefined && obj['NearestArmyCenter'] !== null ? obj['NearestArmyCenter'] : '',
        //       NearestArmyCenterNumber: obj['NearestArmyCenterNumber'] !== undefined && obj['NearestArmyCenterNumber'] !== null ? obj['NearestArmyCenterNumber'] : '',
        //       PowerSourceNumber: obj['PowerSourceNumber'] !== undefined && obj['PowerSourceNumber'] !== null ? obj['PowerSourceNumber'] : '',      
        //       IsSecure: obj['IsSecure'] !== undefined && obj['IsSecure'] !== null ? obj['IsSecure'] : '',
        //       Kaza: obj.Kaza !== undefined && obj.Kaza !== null ? obj.Kaza.Title : '',
        //       PowerSource: obj.PowerSource !== undefined && obj.PowerSource !== null ? obj.PowerSource.Title : ''
        //     };
        //     result.push(temp);
        //   });
        //   this.setState({ searchResults : result });
        //   // console.log('Item retreived successfully!', data);
        // })
        // .catch(error => {
        //   console.error('An error has occurred while retrieving items!', error);
        // });
        const matchingSites = this.props.sites.filter(site => 
          site.Title.toLowerCase().indexOf(siteName.toLowerCase()) >= 0 || 
          site.Id.toString().indexOf(siteName.toLowerCase()) >= 0
        );
        if (matchingSites.length > 0) {
          this.setState({ searchResults: matchingSites, loading: false });
        } else {
          this.setState({ searchResults: [], loading: false });
        }
      } catch (error) {
      console.error('An error has occurred!', error);
    }
  }

  async addRemark(remark: Remark): Promise<void> {
    try {
      this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,this.props.context.pageContext.web.absoluteUrl, 'Remarks', '');
      await this.spCrudOperations._insertItem(remark);
    } catch (error) {
    console.error('An error has occurred!', error);
    }
  }

  public getRemarks = (itemId: string , listName: string): void => {
    const result: Remark [] = [];
    const startIndex = (this.state.currentPage - 1) * this.state.remarksPerPage;
    const endIndex = startIndex + this.state.remarksPerPage;
    try {
      const query: string = `?$filter=ItemId eq '${itemId}' and ListName eq '${listName}'` +
      `&$select=Title,ItemId,ListName,Description,Author/Id,Author/Title,Created,Editor/Id,Editor/Title,Modified` +
      `&$expand=Author,Editor` ;
      // `&$top=${this.state.remarksPerPage}` +
      // `&$skip=${startIndex}`;
      this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                              this.props.context.pageContext.web.absoluteUrl, 'Remarks', query);
      this.spCrudOperations._getItemsWithQuery()
      .then((data) => {
        data.map((obj) => {
          const temp: Remark = {
            Id: obj['id'] !== undefined && obj['id'] !== null ? obj['id'] : '',
            Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
            ItemId:  obj['ItemId'] !== undefined && obj['ItemId'] !== null ? obj['ItemId'] : '',
            Description:  obj['Description'] !== undefined && obj['Description'] !== null ? obj['Description'] : '',
            ListName: obj['ListName'] !== undefined && obj['ListName'] !== null ? obj['ListName'] : '',
            AddedBy:  obj.Author !== undefined && obj.Author !== null ? obj.Author.Title : '',
            ModifiedBy: obj.Editor !== undefined && obj.Editor !== null ? obj.Editor.Title : '',
            DateAdded: obj['Created'] !== undefined && obj['Created'] !== null ? obj['Created'] : '',
            DateModified : obj['Modified'] !== undefined && obj['Modified'] !== null ? obj['Modified'] : '',
          };
          result.push(temp);
        });
        const paginatedRemarks = result.slice(startIndex, endIndex);
        this.setState({ siteRemarksList : paginatedRemarks , totalRemarks: result.length});
      })
      .catch(error => {
        console.error('An error has occurred while retrieving items!', error);
      });
    } catch (error) {
    console.error('An error has occurred!', error);
    }
  }
}