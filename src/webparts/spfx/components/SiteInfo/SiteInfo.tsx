import * as React from 'react';
import {ISiteInfoProps} from './ISiteInfoProps';

export interface ISiteInfoState {
  siteSearched: string;
}

export class SiteInfo extends React.Component<{props: ISiteInfoProps , searchOnClick: 
  React.ReactEventHandler<HTMLInputElement>} , ISiteInfoState> {

    constructor(props: ISiteInfoProps) {
      super();
      this.state = {
        siteSearched : ''
      };
    }
    public render(): React.ReactElement<{}> {
        return (
            <div className='mt-1'>
                <div className='input-group input-group-sm mb-3'>
                  <span className='input-group-text' id='inputGroup-sizing-sm'>Search</span>
                  <input onChange={this.props.searchOnClick}
                  type='text'
                  className='form-control'
                  aria-label='Sizing example input'
                  aria-describedby='inputGroup-sizing-sm'/>
                </div>

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
}