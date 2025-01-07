import * as React from 'react';
import {site, ISiteInfoProps , ISiteInfoState } from './ISiteInfoProps';
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';
import { SearchBar } from '../SearchBarComponent/SearchBar';
import styles from '../Spfx.module.scss';

export class SiteInfo extends React.Component<ISiteInfoProps, ISiteInfoState> {
    private spCrudOperations: SPCrudOperations ;
    constructor(props: ISiteInfoProps) {
      super();
      this.state = {
        searchResults: [],
        selectedSite: undefined
      };
    }

      // Handle search input change
  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let siteName: string = event.currentTarget.value;
    siteName = siteName.replace(/'/g, "''");
    if (siteName === '') {
      this.setState({ selectedSite: undefined, searchResults: []});
    } else {
      this.searchSite(siteName);
    }
  }

  // Handle site selection
  private handleSiteSelect = (site: site) => {
    if (site.Id !== 0) {
      this.setState({ selectedSite: site, searchResults: []});
    } else {
      this.setState({ selectedSite: undefined, searchResults: []});
    }
  }

    public render(): React.ReactElement<{}> {
        return (
            <div className='mt-1 position-relative'>
              <SearchBar keyId={'SiteInfoSearchBar'} 
                        itemTitle='Site' 
                        OnChange={this.handleSearchChange} 
                        onSelectItem={this.handleSiteSelect} 
                        searchResults={this.state.searchResults}/>
              {this.state.selectedSite !== undefined &&
                    <div className='card'>
                    <div className={`card-header text-white text-center`} style={{backgroundColor: '#4d784e'}}>
                        <h5>{this.state.selectedSite.Title.charAt(0).toUpperCase() 
                        + this.state.selectedSite.Title.slice(1)}</h5>
                    </div>
                    <div className='card-body'>
                        <form>
                            {/* <!-- Site Information --> */}
                            <div className='row'>
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

                            {/* <!-- Remarks --> */}
                            <div className='form-row'>
                              <div className='form-group col-md-12'>
                                <label>Remarks</label>
                                <textarea className='form-control'
                                id='remarks'
                                rows={3}
                                placeholder={this.state.selectedSite.Remarks}></textarea>
                              </div>
                            </div>

                            {/* <!-- Power Control --> */}
                             {/* <div className='form-row'>
                               <div className='form-group col-md-6'>
                                 <h6>Power Control</h6>
                                 <ul className='list-group'>
                                   <li className='list-group-item'>PowerTech: 81302215</li>
                                   <li className='list-group-item'>Touch: 03792276</li>
                                   <li className='list-group-item'>Alfa: 03391313</li>
                                   <li className='list-group-item'>Ogero: 09645510</li>
                                 </ul>
                               </div>
                             </div> */}
                       </form>
                    </div>
                </div>
                  }
            </div>
        );
    }

    public searchSite = (siteName: string): void  => {
      const result: site [] = [];
      try {
        const query: string = `?$filter=startswith(Title,'${siteName}')` +
        `&$select=Title,Latitude,Logtitude,PowerSourceNumber,IsSecure,Priority,NearestArmyCenter,NearestArmyCenterNumber,Remarks,`+
        `Kaza/Id,Kaza/Title,SiteType/Id,SiteType/Title,PowerSource/Id,PowerSource/Title`+
        `&$expand=Kaza,PowerSource,SiteType`;
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl, 'Site', query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            let siteType: string = '';
            obj.SiteType.map((item: any) => {
              siteType = siteType === '' ? item.Title.charAt(0).toUpperCase() + item.Title.slice(1) : siteType + '-' + item.Title.charAt(0).toUpperCase() + item.Title.slice(1);
            });
            debugger;
            const temp: site = {
              Id: obj['id'] !== undefined ? obj['id'] : '',
              Title: obj['Title'] !== undefined ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
              SiteType: siteType,
              Latitude: obj['Latitude'] !== undefined ? obj['Latitude'] : '',
              Longtitude : obj['Logtitude'] !== undefined ? obj['Logtitude'] : '',
              Priority: obj['Priority'] !== undefined ? obj['Priority'] : 0,
              Remarks: obj['Remarks'] !== undefined ? obj['Remarks'] : '',
              NearestArmyCenter: obj['NearestArmyCenter'] !== undefined ? obj['NearestArmyCenter'] : '',
              NearestArmyCenterNumber: obj['NearestArmyCenterNumber'] !== undefined ? obj['NearestArmyCenterNumber'] : '',
              PowerSourceNumber: obj['PowerSourceNumber'] !== undefined ? obj['PowerSourceNumber'] : '',      
              IsSecure: obj['IsSecure'] !== undefined ? obj['IsSecure'] : '',
              Kaza: obj.Kaza !== undefined ? obj.Kaza.Title : '',
              PowerSource: obj.PowerSource !== undefined ? obj.PowerSource.Title : ''
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