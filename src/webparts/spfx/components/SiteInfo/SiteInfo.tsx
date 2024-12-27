import * as React from 'react';
import {site, ISiteInfoProps , ISiteInfoState } from './ISiteInfoProps';
import { SPCrudOperations } from '../../../Classes/SPCrudOperations';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SearchBar } from '../SearchBarComponent/SearchBar';


export class SiteInfo extends React.Component<ISiteInfoProps, ISiteInfoState> {
    private spCrudOperations: SPCrudOperations ;

    // private  siteInfoProps: site = {
    //   Title: '',
    //   SiteName: '',
    //   SiteType: '',
    //   Latitude: '',
    //   Longtitude: '',
    //   PowerSource: '',
    //   PowerSourceNumber: '',
    //   Kadaa: '',
    //   IsSecure: false,
    //   Priority: 0,
    //   NearestArmyCenter: '',
    //   NearstArmyCenterNumber: '',
    //   Remarks: '',
    //   Id: 0
    // };
    constructor(props: ISiteInfoProps) {
      super();
      this.state = {
        searchResults: [],
        selectedSite: null,
      };
    }

      // Handle search input change
  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let siteName: string = event.currentTarget.value;
    siteName = siteName.replace(/'/g, "''");
    if (siteName === ''){
      this.setState({ selectedSite: null, searchResults: []});
    } else {
      this.searchSite(siteName);
    }
  };

  // Handle site selection
  private   handleSiteSelect = (site: site) => {
    if (site.Id !== 0){
      this.setState({ selectedSite: site, searchResults: []});
    } else {
      this.setState({ selectedSite: null, searchResults: []});
    }
  };

    public render(): React.ReactElement<{}> {
        return (
            <div className='mt-1 position-relative'>
              <SearchBar itemTitle='Site' OnChange={this.handleSearchChange} onSelectItem={this.handleSiteSelect} searchResults={this.state.searchResults}/>
              {this.state.selectedSite != null &&
                    <div className='card'>
                    <div className='card-header bg-primary text-white text-center'>
                        <h5>{this.state.selectedSite.SiteName.charAt(0).toUpperCase() + this.state.selectedSite.SiteName.slice(1)}</h5>
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
                                    placeholder={this.state.selectedSite.SiteType}/>
                                </div>
                                <div className='form-group col-md-6'>
                                    <label>Kadaa - قضاء</label>
                                    <input type='text'
                                    className='form-control'
                                    id='kadaa'
                                    placeholder={this.state.selectedSite.Kadaa} />
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
                                    placeholder={this.state.selectedSite.IsSecure ? 'Yes' : 'No'} />
                                </div>
                            </div>

                            {/* <!-- Priority and Coordinates --> */}
                            <div className='d-flex p-2'>
                              <div className='form-group col-md-6'>
                                <label >Priority</label>
                                <input type='text'
                                className='form-control'
                                id='priority'
                                placeholder={this.state.selectedSite.Priority ? this.state.selectedSite.Priority.toString() : ''} />
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Coordinates</label>
                                <input type='text'
                                className='form-control'
                                id='coordinates'
                                placeholder={
                                  this.state.selectedSite.Latitude !== null && this.state.selectedSite.Longtitude !== null ?
                                  this.state.selectedSite.Latitude + ' , ' + this.state.selectedSite.Longtitude : ''} />
                              </div>
                            </div>

                            {/* <!-- Nearest Army Point and Phone Numbers --> */}
                            <div className='d-flex p-2'>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenter'
                                placeholder={this.state.selectedSite.NearestArmyCenter}/>
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Nearest Army Point Numbers</label>
                                <input type='text'
                                className='form-control'
                                id='armyCenterNumbers'
                                placeholder={this.state.selectedSite.NearstArmyCenterNumber}/>
                              </div>
                            </div>

                            <div className='d-flex p-2'>
                            <div className='form-group col-md-6'>
                                    <label>Power Source</label>
                                    <input type='text'
                                    className='form-control'
                                    id='powerSource'
                                    placeholder={this.state.selectedSite.PowerSource}/>
                              </div>
                              <div className='form-group col-md-6'>
                                <label>Phone Numbers</label>
                                <input type='text'
                                className='form-control'
                                id='phoneNumbers'
                                placeholder={this.state.selectedSite.PowerSourceNumber}/>
                              </div>
                            </div>

                            {/* <!-- Remarks --> */}
                            <div className='form-row p-2'>
                              <div className='form-group col-md-12'>
                                <label>Remarks</label>
                                <textarea className='form-control'
                                id='remarks'
                                rows={3}
                                placeholder={this.state.selectedSite.Remarks}></textarea>
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
                  }
            </div>
        );
    }

    public searchSite = (siteName: string) : void  => {
      const result: site [] = [];
      try {
        const query: string = `?$filter=startswith(SiteName,'${siteName}')` + 
        `&$select=SiteName,SiteType,Latitude,Longtitude,PowerSourceNumber,IsSecure,` + 
        `Priority,NearestArmyCenter,NearstArmyCenterNumber,Remarks,Kadaa/Id,Kadaa/Title,` + 
        `PowerSource/Id,PowerSource/Title&$expand=Kadaa,PowerSource`;
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl, 'Site', query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            const siteName: string = obj['SiteName'] !== null ? obj['SiteName'].charAt(0).toUpperCase() + obj['SiteName'].slice(1) : '';
            const siteType: string = obj['SiteType'] !== null ? obj['SiteType'].charAt(0).toUpperCase() + obj['SiteType'].slice(1) : '';
            const temp: site = {
              Id: obj['Id'],
              SiteName: obj['SiteName'],
              SiteType: obj['SiteType'],
              Title : siteName !== '' && siteType !== '' ? siteName + ' - ' + siteType : siteName !== '' ? siteName : '',
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