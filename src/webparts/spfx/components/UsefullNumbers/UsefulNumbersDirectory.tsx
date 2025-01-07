import * as React from 'react';
// Components
import { SearchBar } from '../SearchBarComponent/SearchBar';

// Interfaces
import {IUsefullNumberState , IUsefullNumberProps, PhoneNumber} from './IUsefulNumbers';

// Classess
import { SPCrudOperations } from '../../../../Classes/SPCrudOperations';

// Styles
import styles from './UsefullNumbers.module.scss';


export class UsefullNumbersDirectory extends React.Component<IUsefullNumberProps, IUsefullNumberState> {
  state: IUsefullNumberState = {
    searchResults: [],
    selectedItem: null
  };

  private spCrudOperations: SPCrudOperations;
  constructor(props: IUsefullNumberProps) {
        super(props);
      }

 // Handle search input change
  private handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let phoneTitle: string = event.currentTarget.value;
      phoneTitle = phoneTitle.replace(/'/g, "''");
      if (phoneTitle === '' ) {
        this.setState({ selectedItem: null, searchResults: []});
      } else {
        this.searchUsefullNumber(phoneTitle);
      }
    }

  // Handle site selection
    private handleItemSelect = (phone: PhoneNumber) => {
      if (phone !== null ) {
        this.setState({ selectedItem: phone, searchResults: []});
      } else {
        this.setState({ selectedItem: null, searchResults: []});
      }
    }

  public render(): React.ReactElement<{}> {
    return(
      <div className='directory-container'>
        <div className='mt-1 position-relative'>
          <SearchBar keyId={'UseFullNumbersSearchBar'} itemTitle='Usefull Numbers' OnChange={this.handleSearchChange}
          onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
        </div>
        {
        this.state.selectedItem !== null && <div className={`${styles.profileContainer}`}>
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
                <div className={`row align-items-center col-md-12`}>
                  <label htmlFor='category' className={`p-3 col-md-2`}>Category</label>
                  <input type='text' id='category' value={this.state.selectedItem.Category}
                  className={`${styles.formControl}`} disabled />
                </div>
              </div>
            </div>
            <div className={`${styles.postBox}`}>
              <textarea placeholder='Leave a new remark...'></textarea>
              <button type='button'>Post Remarks</button>
            </div>
        </div>
        }
    </div>
    );
  }

  public searchUsefullNumber = (phoneNumber: string): void  => {
    const result: PhoneNumber [] = [];
    try {
      const query: string = `?$filter=startswith(Title,'${phoneNumber}')` +
                            `&$select=Title,PhoneNumber,Category,` +
                            `Region/Id,Region/Title` +
                            `&$expand=Region`;
      this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                              this.props.context.pageContext.web.absoluteUrl, 'Usefull Numbers', query);
      this.spCrudOperations._getItemsWithQuery()
      .then((data) => {
        data.map((obj) => {
          const temp: PhoneNumber = {
            Title: obj['Title'] !== undefined ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '',
            Number: obj['PhoneNumber'] !== undefined ? obj['PhoneNumber'] : '',
            Category: obj['Category'] !== undefined ? obj['Category'] : '',
            Region: obj.Region !== undefined ?  obj.Region.Title : ''
          };
          result.push(temp);
        });
        this.setState({ searchResults: result });
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
