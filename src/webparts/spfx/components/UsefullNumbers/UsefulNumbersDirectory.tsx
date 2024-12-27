import * as React from 'react';
// Components
import { SearchBar } from '../SearchBarComponent/SearchBar';

// Interfaces
import {IUsefullNumberState , IUsefullNumberProps, PhoneNumber} from './IUsefulNumbers';

// Classess
import { SPCrudOperations } from '../../../Classes/SPCrudOperations';

// Styles
import styles from './UsefullNumbers.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export class UsefullNumbersDirectory  extends React.Component<IUsefullNumberProps, IUsefullNumberState> {
  state: IUsefullNumberState = {
    searchResults: [],
    selectedItem: null,
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
          <SearchBar itemTitle='Usefull Numbers' OnChange={this.handleSearchChange} 
          onSelectItem={this.handleItemSelect} searchResults={this.state.searchResults}/>
        </div>
        {
          this.state.selectedItem !== null && <div className={`${styles.profileContainer}`}>
          <div className={`${styles.profileHeader}`}>
           <div className={`${styles.profileAvatar}`}>
              <img src="https://via.placeholder.com/100" alt="User Avatar" />
          </div>
              <div className={`${styles.itemDetails}`}>
                <div className={`d-flex align-items-center col-md-12`}>
                  <label htmlFor="title" className={`p-3 ${styles.formLabel}`}>Title</label>
                  <input type="text" id="title" value={this.state.selectedItem.Title} 
                         className={`${styles.formControl}`} readOnly />
                </div>
                <div className={`d-flex align-items-center col-md-12`}>
                  <label htmlFor="number" className={`p-3 ${styles.formLabel}`}>Number</label>
                  <input type="text" id="number" value={this.state.selectedItem.Number} 
                  className={`${styles.formControl}`} readOnly />
                </div>
                <div className={`d-flex align-items-center col-md-12`}>
                  <label htmlFor="region" className={`p-3 ${styles.formLabel}`}>Region</label>
                  <input type="text" id="region" value={this.state.selectedItem.Region} 
                  className={`${styles.formControl}`} readOnly />
                </div>
                <div className={`d-flex align-items-center col-md-12`}>
                  <label htmlFor="category" className={`p-3 ${styles.formLabel}`}>Category</label>
                  <input type="text" id="category" value={this.state.selectedItem.Category} 
                  className={`${styles.formControl}`} readOnly />
                </div>
              </div>
            </div>

            {/* <div className={`${styles.profileStats}`}>
                <div>
                  <span>752</span>
                  <p>Posts</p>
                </div>
                <div>
                  <span>128</span>
                  <p>Followers</p>
                </div>
              </div> */
            }
            <div className={`${styles.postBox}`}>
              <textarea placeholder="Leave a new remark..."></textarea>
              <button type="button">Post Remarks</button>
            </div>
        </div>
        }
        
   
    </div>
    );
  }

  public searchUsefullNumber = (phoneNumber: string) : void  => {
    const result: PhoneNumber [] = [];
    try {
      const query: string = `?$filter=startswith(Title,'${phoneNumber}')` +
                            `&$select=Title,Number,Category,` +
                            `Regions/Id,Regions/Title` +
                            `&$expand=Regions`;
      this.spCrudOperations = new SPCrudOperations(this.props.context.spHttpClient,
                              this.props.context.pageContext.web.absoluteUrl, 'Usefull Numbers', query);
      this.spCrudOperations._getItemsWithQuery()
      .then((data) => {
        data.map((obj) => {
          const name: string = obj['Title'] !== null ? obj['Title'].charAt(0).toUpperCase() + obj['Title'].slice(1) : '';
          const temp: PhoneNumber = {
            Title: name,
            Number: obj['Number'],
            Category: obj['Category'],
            Region: obj.Regions.Title,
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
