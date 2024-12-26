import * as React from 'react';
import {ISiteInfoProps} from './ISiteInfoProps';
import { SPCrudOperations } from '../../../Classes/SPCrudOperations';
import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface ISiteInfoState {
  siteSearched: string;
  searchResults: ISiteInfoProps[];
  selectedSite: ISiteInfoProps | null;
}

export class SiteInfo extends React.Component<{props: ISiteInfoProps , searchOnClick: 
  React.ReactEventHandler<HTMLInputElement> , context:WebPartContext } , ISiteInfoState> {
    private spCrudOperations: SPCrudOperations ;
    private  siteInfoProps: ISiteInfoProps = {
      SiteName: '',
      SiteType: '',
      Latitude: '',
      Longtitude: '',
      PowerSource: '',
      PowerSourceNumber: '',
      Kadaa: '',
      IsSecure: false,
      Priority: 0,
      NearestArmyCenter: '',
      NearstArmyCenterNumber: '',
      Remarks: ''
    };
    constructor(props: ISiteInfoProps , context : WebPartContext) {
      super();
      this.state = {
        siteSearched : '',
        searchResults: [],
        selectedSite: null,
      };
    }

      // Handle search input change
  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let siteName: string = event.currentTarget.value;
    siteName = siteName.replace(/'/g, "''");
    this.searchSite(siteName);
    this.setState({ siteSearched: siteName });
  };

  // Handle site selection
  private handleSiteSelect = (site: ISiteInfoProps) => {
    this.setState({ selectedSite: site, searchResults: [], siteSearched: '' });
  };

    public render(): React.ReactElement<{}> {
        return (
            <div className='mt-1'>
                <div className='input-group input-group-sm mb-3'>
                  <span className='input-group-text' id='inputGroup-sizing-sm'>Search</span>
                  <input onChange={this.handleSearchChange}
                  type='text'
                  className='form-control'
                  aria-label='Sizing example input'
                  aria-describedby='inputGroup-sizing-sm'/>
                </div>

                  {/* Search Results List */}
                  {this.state.searchResults.length > 0 && (
                    <ul className='list-group mb-3'>
                      {this.state.searchResults.map((site) => (
                        <li
                          key={site.SiteName}
                          className='list-group-item list-group-item-action'
                          onClick={() => this.handleSiteSelect(site)}
                          style={{ cursor: 'pointer' }}
                        >{site.SiteName}</li>
                      ))}
                    </ul>
                  )}

                <div className='card'>
                    <div className='card-header bg-primary text-white text-center'>
                        <h5>{this.props.props.SiteName}</h5>
                    </div>
                    <div className='card-body'>
                        <form>
                            {/* <!-- Site Information --> */}
                            <div className='d-flex p-2 mr-2'>
                                <div className='form-group col-md-6'>
                                    <label>Site Project</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteProject'
                                    placeholder={this.props.props.SiteType}/>
                                </div>
                                <div className='form-group col-md-6'>
                                    <label>Kadaa - قضاء</label>
                                    <input type='text'
                                    className='form-control'
                                    id='kadaa'
                                    placeholder={this.props.props.Kadaa} />
                                </div>
                            </div>
                            <div className='d-flex p-2'>
                                 <div className='form-group col-md-6'>
                                    <label>Site Usage</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteUsage'
                                    placeholder=''/>
                                </div>
                                <div className='form-group col-md-6'>
                                    <label>Site Secure</label>
                                    <input type='text'
                                    className='form-control'
                                    id='siteSecure'
                                    placeholder={this.props.props.IsSecure ? 'Yes' : 'No'} />
                                </div>
                            </div>

                            {/* <!-- Priority and Coordinates --> */}
                            <div className='d-flex p-2'>
                              <div className='form-group col-md-6'>
                                <label >Priority</label>
                                <input type='text'
                                className='form-control'
                                id='priority'
                                placeholder={this.props.props.Priority ? this.props.props.Priority.toString() : ''} />
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Coordinates</label>
                                <input type='text'
                                className='form-control'
                                id='coordinates'
                                placeholder={this.props.props.Latitude + ' , ' + this.props.props.Longtitude} />
                              </div>
                            </div>

                            {/* <!-- Nearest Army Point and Phone Numbers --> */}
                            <div className='d-flex p-2'>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenter'
                                placeholder={this.props.props.NearestArmyCenter}/>
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point Numbers</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenterNumbers'
                                placeholder={this.props.props.NearstArmyCenterNumber}/>
                              </div>
                            </div>

                            <div className='d-flex p-2'>
                            <div className='form-group col-md-6'>
                                    <label>Power Source</label>
                                    <input type='text'
                                    className='form-control'
                                    id='powerSource'
                                    placeholder={this.props.props.PowerSource}/>
                                </div>
                              <div className='form-group col-md-6'>
                                <label>Phone Numbers</label>
                                <input type='text'
                                className='form-control'
                                id='phoneNumbers'
                                placeholder={this.props.props.PowerSourceNumber}/>
                              </div>
                            </div>

                            {/* <!-- Remarks --> */}
                            <div className='form-row p-2'>
                              <div className='form-group col-md-12'>
                                <label>Remarks</label>
                                <textarea className='form-control'
                                id='remarks'
                                rows={3}
                                placeholder={this.props.props.Remarks}></textarea>
                              </div>
                            </div>

                            {/* <!-- Power Control --> */}
                             <div className='form-row p-2'>
                               <div className='form-group col-md-6'>
                                 <h6>Power Control</h6>
                                 <ul className='list-group'>
                                   <li className='list-group-item'>PowerTech: 81302215</li>
                                   <li className='list-group-item'>Touch: 03792276</li>
                                   <li className='list-group-item'>Alfa: 03391313</li>
                                   <li className='list-group-item'>Ogero: 09645510</li>
                                 </ul>
                               </div>
                             </div>
                       </form>
                    </div>
                </div>
            </div>
        );
    }

    public searchSite = (siteName: string) : void  => {
      const result: ISiteInfoProps [] = [];
      try {
        debugger;
        const query: string = `?$filter=startswith(SiteName,'${siteName}')` + 
        `&$select=SiteName,SiteType,Latitude,Longtitude,PowerSourceNumber,IsSecure,` + 
        `Priority,NearestArmyCenter,NearstArmyCenterNumber,Remarks,Kadaa/Id,Kadaa/Title,` + 
        `PowerSource/Id,PowerSource/Title&$expand=Kadaa,PowerSource`;
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl,'Site',query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            const temp : ISiteInfoProps = {
              SiteName: obj['SiteName'],
              SiteType: obj['SiteType'],
              Latitude: obj['Latitude'],
              Longtitude : obj['Longtitude'],
              Priority: obj['Priority'],
              Remarks: obj['Remarks'],
              NearestArmyCenter: obj['NearestArmyCenter'],
              NearstArmyCenterNumber: obj['NearstArmyCenterNumber'],
              PowerSourceNumber: obj['PowerSourceNumber'],         
              IsSecure: obj['IsSecure'],
              Kadaa: obj.Kadaa.Title,
              PowerSource: obj.PowerSource.Title,
            };
            result.push(temp);
          });
          this.setState({ searchResults : result });
          console.log('Item retreived successfully!', data);
        })
        .catch(error => {
          console.error('An error has occurred while retrieving items!', error);
        });
      } catch (error) {
      console.error('An error has occurred!', error);
      }
    }
}