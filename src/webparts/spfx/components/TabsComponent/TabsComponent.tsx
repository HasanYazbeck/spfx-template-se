import * as React from 'react';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Spfx.module.scss';

// Classes
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';
// Interfaces
import {ISite , IDeviceType , IDeviceCategory , IDevice} from '../../../../Interfaces/ICommon';
import {PhoneNumber} from '../UsefullNumbers/IUsefulNumbers';
import {ITabsComponentProps , ITabsComponentState} from './ITabsComponent';
import { Report } from '../Report/IReport';
import { Problem } from '../Problems/IProblems';


// Components
import { SiteInfo } from '../SiteInfo/SiteInfo';
import {UsefullNumbersDirectory} from '../UsefullNumbers/UsefulNumbersDirectory';
import { Problems } from '../Problems/Problems';
import { Reports } from '../Report/Report';
import { Loader } from '../Common/Loader/Loader';

export default class TabsComponent extends React.Component<ITabsComponentProps, ITabsComponentState> {
  private spCrudOperations: SPCrudOperations;
  private  siteInfoProps: ISite = {
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
  // private problem: Problem = {
  //   Title: '',
  //   SieName: ''
  // };
  private report: Report = {
    Title: ''
  };
  constructor(props: ITabsComponentProps) {
    super();
    this.state = {
      activeTab: 'site-tab',
      sites: [],
      deviceTypes: [],
      deviceCategories: [],
      devices: [],
      loading: true,
      error: null
    };
  }

  /**
  * Handles tab change when a user clicks on a tab
  * @param tabId The id of the tab to activate
  */
  private handleTabChange = (tabId: string): void => {
    this.setState({ activeTab: tabId });
  }

  async componentWillMount(): Promise<void>{
    await this.fetchData();
  }

  public render(): React.ReactElement<{}> {
     const { activeTab } = this.state;
     if(this.state.loading){
      return(
        <Loader/>
       );
     }
     else{
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
              role='tab' onClick={() => this.handleTabChange('userfulNumbers-tab')}>Phone Numbers</button>
            </li>
            <li className={`nav-item`} role='presentation'>
              <button className={`nav-link ${activeTab === 'problems-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
              id='problems-tab' type='button' role='tab'
              onClick={() => this.handleTabChange('problems-tab')}>Site Problems</button>
            </li>
            <li className={`nav-item`} role='presentation'>
              <button className={`nav-link ${activeTab === 'report-tab' ? 'active' : 'text-white'} ${styles.navLinkBg} ${styles.fsl}`}
              id='report-tab' type='button' role='tab' onClick={() => this.handleTabChange('report-tab')}>Report</button>
            </li>
          </ul>
          <div className={`tab-content align-baseline p-2 mb-5 text-primary-emphasis ${styles.tabContentBg}`}
          id='nav-bar-tab-content'>
            <div className={`tab-pane fade fw-medium ${activeTab === 'site-tab' ? 'show active' : ''}`}
            id='site-tab-pane' role='tabpanel'>
              <SiteInfo siteInfo={this.siteInfoProps} context={this.props.context} sites={this.state.sites}/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'userfulNumbers-tab' ? 'show active' : ''}`}
                id='userfulNumbers-tab-pane' role='tabpanel'>
                <UsefullNumbersDirectory usefullNumber={this.usefullNumber} context={this.props.context}/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'problems-tab' ? 'show active' : ''}`}
            id='problems-tab-pane' role='tabpanel'>
              <Problems context={this.props.context} problems={[]} sites={this.state.sites} devices={this.state.devices} deviceCategories={this.state.deviceCategories} deviceTypes={this.state.deviceTypes}/>
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

  private fetchData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      this.getSites();
      this.getDeviceTypes();
      this.getDeviceCategories();
      this.getDevices();
    } catch (err) {
      this.setState({error: 'Failed to load data. Please try again later.'});
    } finally {
      this.setState({loading:false});
    }
  };
  
  public  getSites = (): void => {
    const result: ISite [] = [];
      try {
        const query: string = `?$select=Id,Title,Latitude,Logtitude,PowerSourceNumber,IsSecure,Priority,NearestArmyCenter,NearestArmyCenterNumber,Remarks,`+
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
            const temp: ISite = {
              Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
              Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
              SiteType: siteType,
              Latitude: obj['Latitude'] !== undefined && obj['Latitude'] !== null ? obj['Latitude'] : '',
              Longtitude : obj['Logtitude'] !== undefined && obj['Logtitude'] !== null ? obj['Logtitude'] : '',
              Priority: obj['Priority'] !== undefined && obj['Priority'] !== null ? obj['Priority'] : 0,
              Remarks: obj['Remarks'] !== undefined && obj['Remarks'] !== null ? obj['Remarks'] : '',
              NearestArmyCenter: obj['NearestArmyCenter'] !== undefined && obj['NearestArmyCenter'] !== null ? obj['NearestArmyCenter'] : '',
              NearestArmyCenterNumber: obj['NearestArmyCenterNumber'] !== undefined && obj['NearestArmyCenterNumber'] !== null ? obj['NearestArmyCenterNumber'] : '',
              PowerSourceNumber: obj['PowerSourceNumber'] !== undefined && obj['PowerSourceNumber'] !== null ? obj['PowerSourceNumber'] : '',      
              IsSecure: obj['IsSecure'] !== undefined && obj['IsSecure'] !== null ? obj['IsSecure'] : '',
              Kaza: obj.Kaza !== undefined && obj.Kaza !== null ? obj.Kaza.Title : '',
              PowerSource: obj.PowerSource !== undefined && obj.PowerSource !== null ? obj.PowerSource.Title : ''
            };
            result.push(temp);
          });
          this.setState({sites: result});
        })
        .catch(error => {
          console.error('An error has occurred while retrieving items!', error);
        });
      } catch (error) {
      console.error('An error has occurred!', error);
    }
  }

  public  getDeviceTypes = (): void => {
    const result: IDeviceType [] = [];
      try {
        const query: string = '';
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl, 'DeviceTypes', query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            const temp: IDeviceType = {
              Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
              Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
            };
            result.push(temp);
          });
          this.setState({deviceTypes: result})  
        })
        .catch(error => {
          console.error('An error has occurred while retrieving items!', error);
        });
      } catch (error) {
      console.error('An error has occurred!', error);
    }
  }

  public  getDeviceCategories = (): void => {
    const result: IDeviceCategory [] = [];
      try {
        const query: string = '';
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl, 'DeviceCategory', query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            const temp: IDeviceCategory = {
              Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
              Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
              DeviceTypes: obj.DeviceTypes !== undefined && obj.DeviceTypes !== null ? {Id: obj.DeviceTypes.Id.toString(), Title: obj.DeviceTypes.Title.toString()} : {Id: '', Title: ''},
            };
            result.push(temp);
          });
          this.setState({deviceCategories: result})  
        })
        .catch(error => {
          console.error('An error has occurred while retrieving items!', error);
        });
      } catch (error) {
      console.error('An error has occurred!', error);
    }
  }

  public  getDevices = (): void => {
    const result: IDevice [] = [];
      try {
        const query: string = '';
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                                this.props.context.pageContext.web.absoluteUrl, 'Devices', query);
        this.spCrudOperations._getItemsWithQuery()
        .then((data) => {
          data.map((obj) => {
            const temp: IDevice = {
              Id: obj['ID'] !== undefined && obj['ID'] !== null ? obj['ID'] : '',
              Title: obj['Title'] !== undefined && obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
              DeviceType: obj.DeviceType !== undefined && obj.DeviceType !== null ? {Id: obj.DeviceType.Id.toString(), Title: obj.DeviceType.Title.toString()} : {Id: '', Title: ''},
              DeviceCategory: obj.DeviceCategory !== undefined && obj.DeviceCategory !== null ? {Id: obj.DeviceCategory.Id.toString(), Title: obj.DeviceCategory.Title.toString()} : {Id: '', Title: ''},
            };
            result.push(temp);
          });
          this.setState({devices: result})  
        })
        .catch(error => {
          console.error('An error has occurred while retrieving items!', error);
        });
      } catch (error) {
      console.error('An error has occurred!', error);
    }
  }
}