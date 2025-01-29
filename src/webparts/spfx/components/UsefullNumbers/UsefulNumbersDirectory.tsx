import * as React from 'react';
// Components
import { SearchBar } from '../SearchBarComponent/SearchBar';

// Interfaces
import {IUsefullNumberState , IUsefullNumberProps, PhoneNumber} from './IUsefulNumbers';

// Classess
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';

// Styles
import styles from './UsefullNumbers.module.scss';
// import commonStyles from '../../../common.module.scss';
import { ICommon } from '../../../../Interfaces/ICommon';

export class UsefullNumbersDirectory extends React.Component<IUsefullNumberProps, IUsefullNumberState> {
  state: IUsefullNumberState = {
    searchResults: [],
    selectedItem: null,
    selectedCategory: {Id: '', Title: ''},
    categoryError: false
  };

  private spCrudOperations: SPCrudOperations;

  private categories: ICommon[] = [
    { Id: 'Military' , Title: 'Military'},
    { Id: 'Soldiers' , Title: 'Soldiers'},
    { Id: 'Civilians' , Title: 'Civilians'}
  ]

  constructor(props: IUsefullNumberProps) {
        super(props);
      }

    // Handle input changes for Category Dropdown
    private handleCategoryChange = (event: React.ChangeEvent<any>, field: string) => {
      const selectedCategory: HTMLSelectElement  = document.getElementById('Category') as HTMLSelectElement;
      const searchQuery: HTMLInputElement = document.getElementById('UseFullNumbersSearchBar') as HTMLInputElement;
      const selectedCategoryValue: string = selectedCategory.value;
      const query: string = searchQuery.value;

      if (selectedCategoryValue !== '' && query !== '') {
        let phoneTitle: string = query;
        phoneTitle = phoneTitle.replace(/'/g, "''");
        // Call the api to get based on the Selected Category
        this.setState({categoryError: false , selectedItem: null });
        this.setState(prevState => ({
          selectedCategory: {
            ...prevState.selectedCategory,
            ['Title']: selectedCategoryValue
          }
        }));
        this.searchUsefullNumber(phoneTitle, selectedCategoryValue);
      } else if (selectedCategoryValue === '' &&  query !== '') {
        this.setState({categoryError: true, 
                       searchResults: [], 
                       selectedItem: null , 
                       selectedCategory: {Id: '', Title: ''}});
      } else if (selectedCategoryValue !== '' &&  query === '') {
        this.setState({categoryError: false, searchResults: [], selectedItem: null});
        this.setState(prevState => ({
          selectedCategory: {
            ...prevState.selectedCategory,
            ['Title']: selectedCategoryValue
          }
        }));
      } else {
        this.setState({categoryError: false, searchResults: [], selectedItem: null, selectedCategory: {Id: '', Title: ''}});
      }
    }

  // Handle site selection
  private handleItemSelect = (item: any) => {
      if (item !== null ) {
        this.setState({ selectedItem: item, searchResults: [], categoryError: false});
      } else {
        this.setState({ selectedItem: null, searchResults: [], categoryError: false});
      }
  }

  private soldierPage = (): JSX.Element => {
    return(
      <div className={`${styles.profileContainer}`}>
        <div className={`${styles.profileHeader}`}>
          <div className={`${styles.itemDetails}`}>
            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='RankAr' className={`p-3 col-md-2`}>Rank</label>
                  <input type='text' id='RankAr' value={this.state.selectedItem.RankAr !== null ? this.state.selectedItem.RankAr : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='MilitaryId' className={`p-3 col-md-2`}>Military Id</label>
                  <input type='text' id='MilitaryId' value={this.state.selectedItem.MilitaryId !== null ? this.state.selectedItem.MilitaryId : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='FullName' className={`p-3 col-md-2`}>Name</label>
                  <input type='text' id='FullName' value={this.state.selectedItem.FullName !== null ? this.state.selectedItem.FullName : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='Email' className={`p-3 col-md-2`}>Email</label>
                  <input type='text' id='Email' value={this.state.selectedItem.Email !== null ? this.state.selectedItem.Email : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='Mobile' className={`p-3 col-md-2`}>Mobile</label>
                  <input type='text' id='Mobile' value={this.state.selectedItem.Mobile !== null ? this.state.selectedItem.Mobile : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='Landline' className={`p-3 col-md-2`}>Landline</label>
                  <input type='text' id='Landline' value={this.state.selectedItem.Landline !== null ? this.state.selectedItem.Landline : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='Address' className={`p-3 col-md-2`}>Address</label>
                  <input type='text' id='Address' value={this.state.selectedItem.Address !== null ? this.state.selectedItem.Address : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>

            <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='BloodType' className={`p-3 col-md-2`}>Blood Type</label>
                  <input type='text' id='BloodType' value={this.state.selectedItem.BloodType !== null ? this.state.selectedItem.BloodType : ''}
                    className={`${styles.formControl}`} disabled/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private otherPage = (): JSX.Element => {
    return(
      <div className={`${styles.profileContainer}`}>
          <div className={`${styles.profileHeader}`}>
              <div className={`${styles.itemDetails}`}>
                <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='title' className={`p-3 col-md-2`}>Name</label>
                  <input type='text' id='title' value={this.state.selectedItem.Title !== undefined ? this.state.selectedItem.Title : ''}
                    className={`${styles.formControl}`} disabled/>
                </div>
                <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='number' className={`p-3 col-md-2`}>Number</label>
                  <input type='text' id='number' value={this.state.selectedItem.Number}
                  className={`${styles.formControl}`} disabled />
                </div>
                <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='region' className={`p-3 col-md-2`}>Region</label>
                  <input type='text' id='region' value={this.state.selectedItem.Region}
                  className={`${styles.formControl}`} disabled />
                </div>
              </div>
            </div>
            {/* <div className={`${styles.postBox}`}>
              <textarea placeholder='Leave a new remark...'></textarea>
              <button type='button'>Post Remarks</button>
            </div> */}
        </div>
    );
  }

  public render(): React.ReactElement<{}> {
    const selectedSold: boolean = this.state.selectedCategory !== undefined
                               && this.state.selectedCategory.Title === 'Soldiers' ? true :  false;
    return(
      <div className='directory-container'>
        <div className='mt-1 position-relative row'>
        <div className='col-md-4'>
            <select id='Category' className= {`form-select ${this.state.categoryError ? 'border-danger' : ''}`}
                onChange={(e) => this.handleCategoryChange(e, 'Category')}>
            <option value=''>Select a Category</option>
              {this.categories.map(category => (
                <option key={category.Id} value={category.Id}>
                    {category.Title}
                </option>))
              }
            </select>
          </div>          
          <div className='col-md-8'>
            <SearchBar className={`input-group`} keyId={'UseFullNumbersSearchBar'} itemTitle='Usefull Numbers' 
                OnChange={(e) => this.handleCategoryChange(e , 'UseFullNumbersSearchBar')}
                onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
              {this.state.categoryError && (<small className='text-danger'>Category is required</small>)}
          </div>
        </div>
        {this.state.selectedItem !== null && !selectedSold && <this.otherPage/>}
        {this.state.selectedItem !== null && selectedSold && <this.soldierPage/>}
    </div>
    );
  }

  public searchUsefullNumber = (numberTitle: string , listName: string): void  => {
    const result: any [] = [];
    try {
      let query: string = ``;
      if (listName === 'Soldiers') {
        query = `?$filter=substringof('${numberTitle}',FirstName) or substringof('${numberTitle}',LastName)` +
        `&$select=FullName,MilitaryId,Mobile,Landline,Address,Email,EmergencyContact,EmergencyContactNumber,BloodType,Driver,` +
        `Rank/Title,Rank/TitleAr,Squads/Title,Squads/TitleAr` +
        `&$expand=Rank,Squads`;
        this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
          this.props.context.pageContext.web.absoluteUrl, 'Users', query);
          this.spCrudOperations._getItemsWithQuery()
      .then((data) => {
        data.map((obj) => {
          const temp: any = {
              MilitaryId: obj['MilitaryId'] !== undefined && obj['MilitaryId'] !== null  ? obj['MilitaryId'] : '',
              FullName: obj['FullName'] !== undefined && obj['FullName'] !== null ? obj['FullName'].charAt(0).toUpperCase() + obj['FullName'].slice(1) : '',
              Mobile: obj['Mobile'] !== undefined && obj['Mobile'] !== null ? obj['Mobile'] : '',
              Landline: obj['Landline'] !== undefined && obj['Landline'] !== null ? obj['Landline'] : '',
              Address: obj['Address'] !== undefined && obj['Address'] !== null ? obj['Address'] : '',
              Email: obj['Email'] !== undefined && obj['Email'] !== null ? obj['Email'] : '',
              EmergencyContact: obj['EmergencyContact'] !== undefined && obj['EmergencyContact'] !== null ? obj['EmergencyContact'] : '',
              EmergencyContactNumber: obj['EmergencyContactNumber'] !== undefined && obj['EmergencyContactNumber'] !== null ? obj['EmergencyContactNumber'] : '',
              BloodType: obj['BloodType'] !== undefined && obj['BloodType'] !== null ? obj['BloodType'] : '',
              Driver: obj['Driver'] !== undefined && obj['Driver'] !== null ? obj['Driver'] : '',
              Rank: obj.Rank !== undefined && obj.Rank !== null ?  obj.Rank.Title : '',
              RankAr: obj.Rank !== undefined && obj.Rank !== null ?  obj.Rank.TitleAr : '',
              Squads: obj.Squads !== undefined && obj.Squads !== null ?  obj.Squads.Title : '',
              SquadsAr: obj.Squads !== undefined && obj.Squads !== null ?  obj.Squads.TitleAr : ''
          };
          result.push(temp);
        });
        this.setState({ searchResults: result});
        // console.log('Item retreived successfully!', data);
      })
      .catch(error => {
        console.error('An error has occurred while retrieving items!', error);
      });
      } else {
        query = `?$filter=substringof('${numberTitle}',Title)` +
        `&$select=Title,PhoneNumber,Category,` +
        `Region/Id,Region/Title` +
        `&$expand=Region`;
          this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
            this.props.context.pageContext.web.absoluteUrl, 'Usefull Numbers', query);
            this.spCrudOperations._getItemsWithQuery()
      .then ((data) => {
        data.map ((obj) => {
          const temp: PhoneNumber = {
            Title: obj['Title'] !== undefined ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
            Number: obj['PhoneNumber'] !== undefined ? obj['PhoneNumber'] : '',
            Category: obj['Category'] !== undefined ? obj['Category'] : '',
            Region: obj.Region !== undefined ?  obj.Region.Title : ''
          };
          result.push(temp);
        });
        this.setState({ searchResults: result });
        // console.log('Item retreived successfully!', data);
      })
      .catch(error => {
        console.error('An error has occurred while retrieving items!', error);
      });
      }
    } catch (error) {
    console.error('An error has occurred!', error);
    }
  }
}
