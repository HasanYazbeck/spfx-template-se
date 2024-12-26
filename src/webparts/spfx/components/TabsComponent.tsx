import * as React from 'react';
import styles from './Spfx.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SiteInfo } from './SiteInfo/SiteInfo';
import {ISiteInfoProps} from '../components/SiteInfo/ISiteInfoProps';
import { SPCrudOperations } from '../../Classes/SPCrudOperations';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ITabsComponentState {
  activeTab: string; // To keep track of the currently active tab
}

export default class TabsComponent extends React.Component<{}, ITabsComponentState> {
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
  constructor(props: {}) {
    super();
    this.state = {
      activeTab: 'site-tab' // Default active tab
    };
  }

  /**
   * Handles tab change when a user clicks on a tab
   * @param tabId The id of the tab to activate
   */
  private handleTabChange = (tabId: string): void => {
    this.setState({ activeTab: tabId });
  }

  private _getSitesInfo = (context: WebPartContext): ISiteInfoProps => {
    return this.siteInfoProps;
  }

  public render(): React.ReactElement<{}> {
     const { activeTab } = this.state;

    const searchSites: React.ReactEventHandler<HTMLInputElement> = (event) => {
      debugger;
      let siteName: string = event.currentTarget.value;
      siteName = siteName.replace(/'/g, "''");
      console.log(event.currentTarget.value);
      try{
        this.searchSite(siteName);
      } catch (error ){
        console.log(error);
      }
    };
    
    return (
      <div>
        <ul className={`nav nav-tabs`} id='nav-bar-tab' role='tablist'>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'site-tab' ? 'active' : 'text-white'} ${styles.navLinkBg}`} 
            id='site-tab' type='button'
            role='tab' onClick={() => this.handleTabChange('site-tab')}>Sites</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'problems-tab' ? 'active' : 'text-white'} ${styles.navLinkBg}`} 
            id='problems-tab' type='button' role='tab'
            onClick={() => this.handleTabChange('problems-tab')}>Problems</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'userfulNumbers-tab' ? 'active' : 'text-white'} ${styles.navLinkBg}`} 
            id='userfulNumbers-tab'
            type='button'
            role='tab' onClick={() => this.handleTabChange('userfulNumbers-tab')}>Useful Numbers</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'report-tab' ? 'active' : 'text-white'} ${styles.navLinkBg}`}
            id='report-tab'
            type='button'
            role='tab' onClick={() => this.handleTabChange('report-tab')}>Report</button>
          </li>
        </ul>
        <div className={`tab-content align-baseline p-2 mb-5 text-primary-emphasis ${styles.tabContentBg}`}
        id='nav-bar-tab-content'>
          <div className={`tab-pane fade fw-medium ${activeTab === 'site-tab' ? 'show active' : ''}`}
          id='site-tab-pane'
          role='tabpanel'>
            <SiteInfo props={this.siteInfoProps} searchOnClick={searchSites}/>
          </div>
          <div className={`tab-pane fade ${activeTab === 'problems-tab' ? 'show active' : ''}`}
          id='problems-tab-pane' role='tabpanel'>
            Problems Content
          </div>
          <div className={`tab-pane fade ${activeTab === 'userfulNumbers-tab' ? 'show active' : ''}`}
          id='userfulNumbers-tab-pane' role='tabpanel'>
            Useful Numbers Content
          </div>
          <div className={`tab-pane fade ${activeTab === 'report-tab' ? 'show active' : ''}`}
          id='report-tab-pane' role='tabpanel'>
            Report Content
          </div>
        </div>
      </div>
    );
  }

  public searchSite = (siteName: string) : ISiteInfoProps []  => {
    const result: ISiteInfoProps [] = [];
    try {
      debugger;
      const query: string = `?$filter=startswith(SiteName,'${siteName}')&$select=SiteName,SiteType,Latitude,Longtitude,PowerSourceNumber,IsSecure,Priority,NearestArmyCenter,NearstArmyCenterNumber,Remarks,Kadaa/Id,Kadaa/Title&$expand=Kadaa`;
      this.spCrudOperations = new SPCrudOperations(this.context.spHttpClient,
                              this.context.pageContext.web.absoluteUrl,'Site',query);
      this.spCrudOperations._getItemsWithQuery()
      .then((data) => {
        data.map((obj) => {
          const temp : ISiteInfoProps = {
            SiteName: obj['SiteName'],
            SiteType: obj['SiteType'],
          };
          result.push(temp);
        });
        console.log('Item retreived successfully!', data);
      })
      .catch(error => {
        console.error('An error has occurred while retrieving items!', error);
      });
    } catch (error) {
    console.error('An error has occurred!', error);
    }
    return result;
  }
}