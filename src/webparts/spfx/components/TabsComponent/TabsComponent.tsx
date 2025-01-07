import * as React from 'react';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Spfx.module.scss';

// Interfaces
import {site} from '../SiteInfo/ISiteInfoProps';
import {PhoneNumber} from '../UsefullNumbers/IUsefulNumbers';
import {ITabsComponentProps , ITabsComponentState} from './ITabsComponent';
import { Report } from '../Report/IReport';
import { Problem } from '../Problems/IProblems';

// Components
import { SiteInfo } from '../SiteInfo/SiteInfo';
import {UsefullNumbersDirectory} from '../UsefullNumbers/UsefulNumbersDirectory';
import { Problems } from '../Problems/Problems';
import { Reports } from '../Report/Report';

export default class TabsComponent extends React.Component<ITabsComponentProps, ITabsComponentState> {
  private  siteInfoProps: site = {
    Id: 0,
    Title: '',
    SiteType: '',
    Latitude: '',
    Longtitude: '',
    PowerSource: '',
    PowerSourceNumber: '',
    Kaza: '',
    IsSecure: false,
    Priority: 0,
    NearestArmyCenter: '',
    NearestArmyCenterNumber: '',
    Remarks: ''
  };
  private usefullNumber : PhoneNumber = {
    Title: '',
    Number: '',
    Category: '',
    Region: ''
  };
  private problem: Problem = {
    Title: '',
    SieName: ''
  };
  private report: Report = {
    Title: ''
  };
  constructor(props: ITabsComponentProps) {
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

  public render(): React.ReactElement<{}> {
     const { activeTab } = this.state;

    return (
      <div>
        <ul className={`nav nav-tabs`} id='nav-bar-tab' role='tablist'>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'site-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
            id='site-tab' type='button'
            role='tab' onClick={() => this.handleTabChange('site-tab')}>Sites</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'userfulNumbers-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
            id='userfulNumbers-tab'
            type='button'
            role='tab' onClick={() => this.handleTabChange('userfulNumbers-tab')}>Useful Numbers</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'problems-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
            id='problems-tab' type='button' role='tab'
            onClick={() => this.handleTabChange('problems-tab')}>Site Problems</button>
          </li>
          <li className={`nav-item`} role='presentation'>
            <button className={`nav-link ${activeTab === 'report-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
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
            <SiteInfo siteInfo={this.siteInfoProps} context={this.props.context}/>
          </div>
          <div className={`tab-pane fade ${activeTab === 'userfulNumbers-tab' ? 'show active' : ''}`}
              id='userfulNumbers-tab-pane' role='tabpanel'>
              <UsefullNumbersDirectory usefullNumber={this.usefullNumber} context={this.props.context}/>
          </div>
          <div className={`tab-pane fade ${activeTab === 'problems-tab' ? 'show active' : ''}`}
          id='problems-tab-pane' role='tabpanel'>
            <Problems context={this.props.context} problem={this.problem} />
          </div>
          <div className={`tab-pane fade ${activeTab === 'report-tab' ? 'show active' : ''}`}
          id='report-tab-pane' role='tabpanel'>
            <Reports context={this.props.context} report={this.report} />
          </div>
        </div>
      </div>
    );
  } 
}